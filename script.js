// ==UserScript==
// @name         Verba Prism
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Aprimora o texto selecionado usando a API Groq (IA).
// @author       Diones Souza
// @icon         https://cdn-icons-png.magnific.com/64/9708/9708616.png
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      api.groq.com
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
    const GROQ_MODELS_URL = 'https://api.groq.com/openai/v1/models';
    const DEFAULT_MODEL = 'llama-3.3-70b-versatile';
    const PROMPT_TEMPLATE = `Você é um corretor e aprimorador de textos.
Sua função é revisar, corrigir e melhorar qualquer texto enviado pelo usuário, mantendo o estilo, o tom e a estrutura original.

- Corrija ortografia, gramática, pontuação e fluidez.
- Melhore a clareza e o ritmo das frases sem alterar o significado.
- Preserve todos os elementos de formatação existentes (como Markdown, aspas, itálico ou outros estilos especiais).
- Se houver inconsistências de formatação, ajuste-as para que o texto final fique padronizado e harmonioso.

Retorne apenas o texto corrigido e aprimorado, sem explicações adicionais.`;

    let groqApiKey = GM_getValue('groqApiKey', '');
    let selectedModel = GM_getValue('selectedModel', DEFAULT_MODEL);

    // --- UI Elements --- //
    let loadingIndicator = null;
    let resultModal = null;
    let resultTextarea = null;
    let originalSelection = null;
    let originalRange = null;

    function isRangeValid(range) {
        return range && range.startContainer && range.endContainer && document.contains(range.startContainer) && document.contains(range.endContainer);
    }

    function createLoadingIndicator() {
        loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'groq-enhancer-loading';
        loadingIndicator.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px 30px;
            border-radius: 8px;
            font-family: sans-serif;
            font-size: 18px;
            z-index: 99999;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        loadingIndicator.innerHTML = `
            <style>
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 20px; height: 20px; animation: spin 2s linear infinite; }
            </style>
            <div class="spinner"></div>
            <span>Melhorando texto com IA...</span>
        `;
        document.body.appendChild(loadingIndicator);
    }

    function removeLoadingIndicator() {
        if (loadingIndicator) {
            loadingIndicator.remove();
            loadingIndicator = null;
        }
    }

    function createResultModal(text, originalSelectedText, selectionRange) {
        originalSelection = originalSelectedText;
        originalRange = selectionRange;

        resultModal = document.createElement('div');
        resultModal.id = 'groq-enhancer-result-modal';
        resultModal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            color: #333; /* Ensure text is dark on white background */
            border: 1px solid #ccc;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            padding: 20px;
            border-radius: 8px;
            z-index: 100000;
            width: 80%;
            max-width: 700px;
            max-height: 90%;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
        `;

        resultModal.innerHTML = `
            <h3 style="margin-top: 0; color: #333;">Texto Aprimorado</h3>
            <textarea id="groq-enhanced-text" style="width: 100%; height: 200px; margin-bottom: 10px; resize: vertical; font-family: monospace; color: #333;"></textarea>
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
                <button id="groq-copy-btn" style="padding: 8px 15px; border: none; border-radius: 4px; background-color: #007bff; color: white; cursor: pointer;">Copiar Texto</button>
                <button id="groq-replace-btn" style="padding: 8px 15px; border: none; border-radius: 4px; background-color: #28a745; color: white; cursor: pointer;">Substituir Texto</button>
                <button id="groq-close-btn" style="padding: 8px 15px; border: none; border-radius: 4px; background-color: #6c757d; color: white; cursor: pointer;">Fechar</button>
            </div>
        `;

        document.body.appendChild(resultModal);

        resultTextarea = document.getElementById('groq-enhanced-text');
        resultTextarea.value = text;

        document.getElementById('groq-copy-btn').addEventListener('click', async () => {
            const textToCopy = resultTextarea.value;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                try {
                    await navigator.clipboard.writeText(textToCopy);
                    alert('Texto copiado para a área de transferência!');
                    return;
                } catch (err) {
                    console.warn('Clipboard API falhou, usando fallback:', err);
                }
            }
            resultTextarea.select();
            document.execCommand('copy');
            alert('Texto copiado para a área de transferência!');
        });

        document.getElementById('groq-replace-btn').addEventListener('click', () => {
            const newText = resultTextarea.value;
            if (isRangeValid(originalRange)) {
                originalRange.deleteContents();
                originalRange.insertNode(document.createTextNode(newText));
            } else {
                alert('Não foi possível substituir automaticamente o texto na página. Copie o texto aprimorado e cole manualmente.');
            }
            removeResultModal();
        });

        document.getElementById('groq-close-btn').addEventListener('click', removeResultModal);
    }

    function removeResultModal() {
        if (resultModal) {
            resultModal.remove();
            resultModal = null;
            originalSelection = null;
        }
    }

    // --- Groq API Interaction --- //

    async function callGroqAPI(textToEnhance, selectionRange) {
        if (!groqApiKey) {
            alert('Por favor, configure sua chave de API Groq nas configurações do Verba Prism.');
            openSettingsModal();
            return;
        }

        createLoadingIndicator();

        const messages = [
            { role: 'system', content: PROMPT_TEMPLATE },
            { role: 'user', content: textToEnhance }
        ];

        GM_xmlhttpRequest({
            method: 'POST',
            url: GROQ_API_URL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${groqApiKey}`
            },
            data: JSON.stringify({
                model: selectedModel,
                messages: messages,
                temperature: 0.7
            }),
            onload: function(response) {
                removeLoadingIndicator();
                try {
                    const data = JSON.parse(response.responseText);
                    if (response.status < 200 || response.status >= 300) {
                        const message = (data && data.error && data.error.message) ? data.error.message : response.statusText || 'Erro na requisição';
                        alert(`Erro HTTP ${response.status}: ${message}`);
                        console.error('Groq API HTTP error:', response.status, response.responseText);
                        return;
                    }

                    if (data.choices && data.choices.length > 0) {
                        const enhancedText = data.choices[0]?.message?.content || data.choices[0]?.text;
                        if (enhancedText) {
                            createResultModal(enhancedText, textToEnhance, selectionRange);
                        } else {
                            alert('A resposta da API Groq não contém texto aprimorado.');
                            console.error('Groq API response missing content:', data);
                        }
                    } else if (data.error) {
                        alert(`Erro da API Groq: ${data.error.message}`);
                        console.error('Groq API Error:', data.error);
                    } else {
                        alert('Resposta inesperada da API Groq.');
                        console.error('Unexpected Groq API response:', data);
                    }
                } catch (e) {
                    alert('Erro ao processar a resposta da API Groq: ' + e.message);
                    console.error('Error parsing Groq API response:', e);
                }
            },
            onerror: function(error) {
                removeLoadingIndicator();
                alert('Erro ao conectar com a API Groq. Verifique sua conexão ou chave de API.');
                console.error('GM_xmlhttpRequest error:', error);
            }
        });
    }

    // --- Settings Modal --- //
    let settingsModal = null;

    function openSettingsModal() {
        if (settingsModal) {
            settingsModal.remove();
        }

        settingsModal = document.createElement('div');
        settingsModal.id = 'groq-enhancer-settings-modal';
        settingsModal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            color: #333; /* Ensure text is dark on white background */
            border: 1px solid #ccc;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            padding: 20px;
            border-radius: 8px;
            z-index: 100001;
            width: 80%;
            max-width: 600px;
            font-family: sans-serif;
        `;

        settingsModal.innerHTML = `
            <h3 style="margin-top: 0; color: #333;">Configurações do Verba Prism</h3>
            <div style="margin-bottom: 15px;">
                <label for="groq-api-key-input" style="display: block; margin-bottom: 5px; color: #333;">Chave de API Groq:</label>
                <input type="password" id="groq-api-key-input" style="width: calc(100% - 20px); padding: 8px; border: 1px solid #ccc; border-radius: 4px; color: #333;">
            </div>
            <div style="margin-bottom: 15px;">
                <label for="groq-model-select" style="display: block; margin-bottom: 5px; color: #333;">Modelo Groq:</label>
                <select id="groq-model-select" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; color: #333;"></select>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
                <button id="groq-save-settings-btn" style="padding: 8px 15px; border: none; border-radius: 4px; background-color: #007bff; color: white; cursor: pointer;">Salvar</button>
                <button id="groq-close-settings-btn" style="padding: 8px 15px; border: none; border-radius: 4px; background-color: #6c757d; color: white; cursor: pointer;">Fechar</button>
            </div>
        `;

        document.body.appendChild(settingsModal);

        const apiKeyInput = document.getElementById('groq-api-key-input');
        apiKeyInput.value = groqApiKey;

        const modelSelect = document.getElementById('groq-model-select');

        fetchGroqModels(modelSelect);

        document.getElementById('groq-save-settings-btn').addEventListener('click', () => {
            groqApiKey = apiKeyInput.value.trim();
            selectedModel = modelSelect.value;
            GM_setValue('groqApiKey', groqApiKey);
            GM_setValue('selectedModel', selectedModel);
            alert('Configurações salvas!');
            closeSettingsModal();
        });

        document.getElementById('groq-close-settings-btn').addEventListener('click', closeSettingsModal);
    }

    function closeSettingsModal() {
        if (settingsModal) {
            settingsModal.remove();
            settingsModal = null;
        }
    }

    function addDefaultModelOption(selectElement) {
        selectElement.innerHTML = '';
        const option = document.createElement('option');
        option.value = DEFAULT_MODEL;
        option.textContent = `${DEFAULT_MODEL} (Padrão)`;
        selectElement.appendChild(option);
        selectElement.value = DEFAULT_MODEL;
    }

    function fetchGroqModels(selectElement) {
        if (!groqApiKey) {
            console.warn('API Key não configurada. Não é possível buscar modelos.');
            addDefaultModelOption(selectElement);
            return;
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: GROQ_MODELS_URL,
            headers: {
                'Authorization': `Bearer ${groqApiKey}`
            },
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.data && Array.isArray(data.data)) {
                        selectElement.innerHTML = '';
                        data.data.forEach(model => {
                            const option = document.createElement('option');
                            option.value = model.id;
                            option.textContent = model.id;
                            selectElement.appendChild(option);
                        });
                        if (Array.from(selectElement.options).some(opt => opt.value === selectedModel)) {
                            selectElement.value = selectedModel;
                        } else {
                            selectElement.value = DEFAULT_MODEL;
                        }
                    } else {
                        console.error('Resposta inesperada ao buscar modelos Groq:', data);
                        addDefaultModelOption(selectElement);
                    }
                } catch (e) {
                    console.error('Erro ao processar modelos Groq:', e);
                    addDefaultModelOption(selectElement);
                }
            },
            onerror: function(error) {
                console.error('Erro ao buscar modelos Groq:', error);
                addDefaultModelOption(selectElement);
            }
        });
    }



    if (!groqApiKey) {
        console.log("Groq API Key não configurada. Use o menu Tampermonkey para abrir as configurações.");
    }
    GM_registerMenuCommand("Configurações do Verba Prism", openSettingsModal);

    GM_registerMenuCommand("Melhorar seleção usando IA", () => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        const selectedRange = selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;
        if (selectedText.length > 0) {
            callGroqAPI(selectedText, selectedRange);
        } else {
            alert("Por favor, selecione um texto para melhorar.");
        }
    });
})();