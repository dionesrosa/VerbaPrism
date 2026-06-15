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

    const SCRIPT_DEBUG_VERSION = `debug-${Date.now()}`;
    const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
    const GROQ_MODELS_URL = 'https://api.groq.com/openai/v1/models';
    const DEFAULT_MODEL = 'llama-3.3-70b-versatile';
    const MODAL_Z_INDEX = 100000;

    console.log(`Verba Prism script.js carregado — versão de depuração ${SCRIPT_DEBUG_VERSION}`);
    const PROMPT_TEMPLATE = `Você é um corretor e aprimorador de textos.
Sua função é revisar, corrigir e melhorar qualquer texto enviado pelo usuário, mantendo o estilo, o tom e a estrutura original.

- Corrija ortografia, gramática, pontuação e fluidez.
- Melhore a clareza e o ritmo das frases sem alterar o significado.
- Preserve todos os elementos de formatação existentes (como Markdown, aspas, itálico ou outros estilos especiais).
- Se houver inconsistências de formatação, ajuste-as para que o texto final fique padronizado e harmonioso.

Retorne apenas o texto corrigido e aprimorado, sem explicações adicionais.`;

    let groqApiKey = GM_getValue('groqApiKey', '');
    let selectedModel = GM_getValue('selectedModel', DEFAULT_MODEL);

    let loadingIndicator = null;
    let resultModal = null;
    let resultTextarea = null;
    let settingsModal = null;
    let backdrop = null;
    let originalSelectionData = null;
    let contextMenuOverlay = null;
    let fieldActionButton = null;
    let activeTextField = null;
    let fieldHideTimeout = null;
    const CONTEXT_MENU_ID = 'groq-enhancer-context-menu';
    const FIELD_ACTION_BUTTON_ID = 'groq-enhancer-field-action';
    const TEXT_INPUT_TYPES = new Set(['text', 'search', 'email', 'url', 'tel', 'number']);

    function createElement(tag, attrs = {}, styles = {}, html = '') {
        const el = document.createElement(tag);
        Object.keys(attrs).forEach(key => el.setAttribute(key, attrs[key]));
        Object.assign(el.style, styles);
        if (html) {
            el.innerHTML = html;
        }
        return el;
    }

    function showBackdrop() {
        if (!backdrop) {
            backdrop = createElement('div', {}, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                zIndex: MODAL_Z_INDEX - 1
            });
            document.body.appendChild(backdrop);
        }
    }

    function hideBackdrop() {
        if (backdrop) {
            backdrop.remove();
            backdrop = null;
        }
    }

    function isTextField(element) {
        if (!element || element.nodeType !== 1) {
            return false;
        }
        const tag = element.tagName;
        if (tag === 'TEXTAREA') {
            return !element.readOnly && !element.disabled;
        }
        if (tag !== 'INPUT') {
            return false;
        }
        return TEXT_INPUT_TYPES.has((element.type || 'text').toLowerCase()) && !element.readOnly && !element.disabled;
    }

    function findTextField(element) {
        if (!(element instanceof Element)) {
            return null;
        }
        const field = element.closest('input,textarea');
        return isTextField(field) ? field : null;
    }

    function createFieldActionButton() {
        if (fieldActionButton) {
            return;
        }

        fieldActionButton = createElement('button', { id: FIELD_ACTION_BUTTON_ID, type: 'button', title: 'Melhorar texto com Verba Prism' }, {
            position: 'fixed',
            display: 'none',
            visibility: 'hidden',
            minWidth: '110px',
            height: '32px',
            borderRadius: '18px',
            backgroundColor: 'rgba(13, 110, 253, 0.92)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            zIndex: 2147483647,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '0.01em',
            boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
            padding: '0 14px',
            pointerEvents: 'auto',
            opacity: '0',
            transform: 'translateY(4px) scale(0.96)',
            transition: 'opacity 0.16s ease, transform 0.16s ease, visibility 0.16s ease'
        }, 'Verba Prism');

        fieldActionButton.addEventListener('click', handleFieldActionClick);
        fieldActionButton.addEventListener('mousedown', event => event.stopPropagation());
        fieldActionButton.addEventListener('mouseenter', () => clearTimeout(fieldHideTimeout));
        fieldActionButton.addEventListener('mouseleave', scheduleHideFieldActionButton);
        document.body.appendChild(fieldActionButton);
    }

    function updateFieldActionButtonPosition(element) {
        if (!element || !fieldActionButton) {
            return;
        }

        const rect = element.getBoundingClientRect();
        const buttonRect = fieldActionButton.getBoundingClientRect();
        const buttonWidth = buttonRect.width || 120;
        const buttonHeight = buttonRect.height || 32;
        const preferredX = rect.left;
        const preferredY = rect.bottom + 8;

        const x = Math.min(window.innerWidth - buttonWidth - 10, Math.max(10, preferredX));
        let y = preferredY;
        if (y + buttonHeight > window.innerHeight - 10) {
            y = rect.top - buttonHeight - 8;
        }

        fieldActionButton.style.left = `${x}px`;
        fieldActionButton.style.top = `${Math.max(10, y)}px`;
    }

    function showFieldActionButtonFor(element) {
        const field = findTextField(element);
        if (!field) {
            return;
        }

        createFieldActionButton();
        clearTimeout(fieldHideTimeout);
        activeTextField = field;
        fieldActionButton.style.display = 'flex';
        fieldActionButton.style.visibility = 'hidden';
        fieldActionButton.style.opacity = '0';
        fieldActionButton.style.transform = 'translateY(4px) scale(0.96)';
        updateFieldActionButtonPosition(field);
        fieldActionButton.style.visibility = 'visible';
        fieldActionButton.style.opacity = '1';
        fieldActionButton.style.transform = 'translateY(0) scale(1)';
    }

    function hideFieldActionButton() {
        if (fieldActionButton) {
            fieldActionButton.style.display = 'none';
        }
        activeTextField = null;
        clearTimeout(fieldHideTimeout);
    }

    function scheduleHideFieldActionButton() {
        clearTimeout(fieldHideTimeout);
        fieldHideTimeout = setTimeout(() => {
            if (fieldActionButton && !fieldActionButton.matches(':hover') && document.activeElement !== activeTextField) {
                hideFieldActionButton();
            }
        }, 240);
    }

    function getFieldSelectionData(field) {
        const value = field.value || '';
        const start = typeof field.selectionStart === 'number' ? field.selectionStart : 0;
        const end = typeof field.selectionEnd === 'number' ? field.selectionEnd : value.length;
        const hasSelection = end > start;
        return {
            source: 'input',
            element: field,
            text: hasSelection ? value.slice(start, end) : value,
            start: hasSelection ? start : 0,
            end: hasSelection ? end : value.length
        };
    }

    function handleFieldActionClick() {
        if (!activeTextField) {
            return;
        }
        const selectionData = getFieldSelectionData(activeTextField);
        if (!selectionData.text.trim()) {
            alert('Não há texto para melhorar neste campo.');
            return;
        }
        callGroqAPI(selectionData.text.trim(), selectionData);
    }

    function removeCustomContextMenu() {
        if (contextMenuOverlay) {
            contextMenuOverlay.remove();
            contextMenuOverlay = null;
        }
    }

    function createCustomContextMenu(x, y, selectionData) {
        removeCustomContextMenu();

        contextMenuOverlay = createElement('div', { id: CONTEXT_MENU_ID }, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            zIndex: MODAL_Z_INDEX + 5,
            pointerEvents: 'none'
        });

        const button = createElement('button', { id: 'groq-context-action' }, {
            position: 'fixed',
            top: `${y}px`,
            left: `${x}px`,
            backgroundColor: '#0d6efd',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 14px',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
            pointerEvents: 'auto',
            fontSize: '14px',
            fontFamily: 'sans-serif',
            zIndex: MODAL_Z_INDEX + 6
        }, 'Melhorar seleção com Verba Prism');

        button.addEventListener('click', () => {
            callGroqAPI(selectionData.text.trim(), selectionData);
            removeCustomContextMenu();
        });

        contextMenuOverlay.appendChild(button);
        normalizeContextMenuPosition(x, y, button);
        document.body.appendChild(contextMenuOverlay);
    }

    function normalizeContextMenuPosition(x, y, element) {
        const { innerWidth, innerHeight } = window;
        const rect = element.getBoundingClientRect();
        let left = x;
        let top = y;
        if (left + rect.width > innerWidth - 10) {
            left = innerWidth - rect.width - 10;
        }
        if (top + rect.height > innerHeight - 10) {
            top = innerHeight - rect.height - 10;
        }
        element.style.left = `${Math.max(10, left)}px`;
        element.style.top = `${Math.max(10, top)}px`;
    }

    document.addEventListener('contextmenu', event => {
        const selectionData = getSelectionData();
        if (selectionData.text && selectionData.text.trim().length > 0) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            createCustomContextMenu(event.clientX, event.clientY, selectionData);
        } else {
            removeCustomContextMenu();
        }
    }, true);

    document.addEventListener('mouseover', event => {
        const field = findTextField(event.target);
        if (field) {
            showFieldActionButtonFor(field);
        }
    }, true);

    document.addEventListener('mouseout', event => {
        const field = findTextField(event.target);
        if (field && document.activeElement !== field) {
            scheduleHideFieldActionButton();
        }
    }, true);

    document.addEventListener('pointerover', event => {
        const field = findTextField(event.target);
        if (field) {
            showFieldActionButtonFor(field);
        }
    }, true);

    document.addEventListener('pointerout', event => {
        const field = findTextField(event.target);
        if (field && document.activeElement !== field) {
            scheduleHideFieldActionButton();
        }
    }, true);

    document.addEventListener('focusin', event => {
        const field = findTextField(event.target);
        if (field) {
            showFieldActionButtonFor(field);
        }
    }, true);

    document.addEventListener('focusout', event => {
        const field = findTextField(event.target);
        if (field) {
            scheduleHideFieldActionButton();
        }
    }, true);

    document.addEventListener('mousedown', event => {
        if (contextMenuOverlay && !event.target.closest(`#${CONTEXT_MENU_ID}`)) {
            removeCustomContextMenu();
        }
        if (fieldActionButton && event.target !== fieldActionButton && !event.target.closest(`#${FIELD_ACTION_BUTTON_ID}`)) {
            scheduleHideFieldActionButton();
        }
    });

    document.addEventListener('scroll', () => {
        if (activeTextField && fieldActionButton && fieldActionButton.style.display !== 'none') {
            updateFieldActionButtonPosition(activeTextField);
        }
    }, true);

    window.addEventListener('resize', () => {
        if (activeTextField && fieldActionButton && fieldActionButton.style.display !== 'none') {
            updateFieldActionButtonPosition(activeTextField);
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            removeCustomContextMenu();
            hideFieldActionButton();
        }
    });

    function createLoadingIndicator() {
        if (loadingIndicator) {
            return;
        }

        loadingIndicator = createElement('div', { id: 'groq-enhancer-loading' }, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            color: '#fff',
            padding: '18px 26px',
            borderRadius: '10px',
            fontFamily: 'sans-serif',
            fontSize: '16px',
            zIndex: MODAL_Z_INDEX + 2,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        });

        loadingIndicator.innerHTML = `
            <style>
                @keyframes groq-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            </style>
            <div style="width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.4); border-top: 3px solid #fff; border-radius: 50%; animation: groq-spin 1s linear infinite;"></div>
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

    function getSelectionData() {
        const activeEl = document.activeElement;

        if (activeEl && /^(?:INPUT|TEXTAREA)$/.test(activeEl.tagName) && typeof activeEl.selectionStart === 'number') {
            const value = activeEl.value;
            const start = activeEl.selectionStart;
            const end = activeEl.selectionEnd;

            return {
                source: 'input',
                element: activeEl,
                text: value.slice(start, end),
                start,
                end
            };
        }

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            return { source: 'none', text: '' };
        }

        return {
            source: 'range',
            range: selection.getRangeAt(0).cloneRange(),
            text: selection.toString()
        };
    }

    function replaceSelectedText(data, newText) {
        if (!newText) {
            return false;
        }

        if (data.source === 'input' && data.element) {
            const field = data.element;
            const value = field.value;
            field.value = value.slice(0, data.start) + newText + value.slice(data.end);
            const cursorPosition = data.start + newText.length;
            field.setSelectionRange(cursorPosition, cursorPosition);
            field.focus();
            return true;
        }

        if (data.source === 'range' && data.range) {
            const range = data.range;
            if (range.startContainer && range.endContainer && document.contains(range.startContainer) && document.contains(range.endContainer)) {
                range.deleteContents();
                range.insertNode(document.createTextNode(newText));
                return true;
            }
        }

        return false;
    }

    function createResultModal(text, selectionData) {
        originalSelectionData = selectionData;
        showBackdrop();

        resultModal = createElement('div', { id: 'groq-enhancer-result-modal' }, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            color: '#222',
            borderRadius: '10px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
            padding: '20px',
            width: '90%',
            maxWidth: '720px',
            maxHeight: '88vh',
            overflowY: 'auto',
            zIndex: MODAL_Z_INDEX,
            fontFamily: 'sans-serif'
        });

        resultModal.innerHTML = `
            <h3 style="margin-top: 0; margin-bottom: 14px; color: #111;">Texto Aprimorado</h3>
            <textarea id="groq-enhanced-text" style="width: 100%; min-height: 240px; margin-bottom: 16px; resize: vertical; font-family: monospace; font-size: 14px; line-height: 1.5; color: #222; border: 1px solid #ccc; border-radius: 8px; padding: 12px;"></textarea>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: flex-end;">
                <button id="groq-copy-btn" style="padding: 10px 18px; border: none; border-radius: 8px; background-color: #0d6efd; color: white; cursor: pointer;">Copiar</button>
                <button id="groq-replace-btn" style="padding: 10px 18px; border: none; border-radius: 8px; background-color: #198754; color: white; cursor: pointer;">Substituir</button>
                <button id="groq-close-btn" style="padding: 10px 18px; border: none; border-radius: 8px; background-color: #6c757d; color: white; cursor: pointer;">Fechar</button>
            </div>
        `;

        document.body.appendChild(resultModal);
        resultTextarea = resultModal.querySelector('#groq-enhanced-text');
        resultTextarea.value = text;

        resultModal.querySelector('#groq-copy-btn').addEventListener('click', async () => {
            const textToCopy = resultTextarea.value;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                try {
                    await navigator.clipboard.writeText(textToCopy);
                    alert('Texto copiado para a área de transferência!');
                    return;
                } catch (error) {
                    console.warn('Clipboard API falhou:', error);
                }
            }
            resultTextarea.select();
            document.execCommand('copy');
            alert('Texto copiado para a área de transferência!');
        });

        resultModal.querySelector('#groq-replace-btn').addEventListener('click', () => {
            const success = replaceSelectedText(originalSelectionData, resultTextarea.value);
            if (!success) {
                alert('Não foi possível substituir automaticamente o texto. Copie o resultado e cole manualmente.');
            }
            removeResultModal();
        });

        resultModal.querySelector('#groq-close-btn').addEventListener('click', removeResultModal);
    }

    function removeResultModal() {
        if (resultModal) {
            resultModal.remove();
            resultModal = null;
            resultTextarea = null;
            originalSelectionData = null;
            hideBackdrop();
        }
    }

    async function callGroqAPI(textToEnhance, selectionData) {
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
                messages,
                temperature: 0.7
            }),
            onload(response) {
                removeLoadingIndicator();
                try {
                    const data = JSON.parse(response.responseText);
                    if (response.status < 200 || response.status >= 300) {
                        const message = data?.error?.message || response.statusText || 'Erro na requisição';
                        alert(`Erro HTTP ${response.status}: ${message}`);
                        console.error('Groq API HTTP error:', response.status, response.responseText);
                        return;
                    }

                    const enhancedText = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text;
                    if (enhancedText) {
                        createResultModal(enhancedText, selectionData);
                    } else if (data?.error) {
                        alert(`Erro da API Groq: ${data.error.message}`);
                        console.error('Groq API Error:', data.error);
                    } else {
                        alert('Resposta inesperada da API Groq.');
                        console.error('Unexpected Groq API response:', data);
                    }
                } catch (error) {
                    alert('Erro ao processar a resposta da API Groq: ' + error.message);
                    console.error('Error parsing Groq API response:', error);
                }
            },
            onerror(error) {
                removeLoadingIndicator();
                alert('Erro ao conectar com a API Groq. Verifique sua conexão ou chave de API.');
                console.error('GM_xmlhttpRequest error:', error);
            }
        });
    }

    function openSettingsModal() {
        if (settingsModal) {
            settingsModal.remove();
        }

        showBackdrop();

        settingsModal = createElement('div', { id: 'groq-enhancer-settings-modal' }, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            color: '#222',
            borderRadius: '10px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
            padding: '20px',
            width: '90%',
            maxWidth: '620px',
            zIndex: MODAL_Z_INDEX,
            fontFamily: 'sans-serif'
        });

        settingsModal.innerHTML = `
            <h3 style="margin-top: 0; margin-bottom: 16px; color: #111;">Configurações do Verba Prism</h3>
            <label for="groq-api-key-input" style="display: block; margin-bottom: 6px; color: #333; font-weight: 600;">Chave de API Groq:</label>
            <input id="groq-api-key-input" type="password" style="width: 100%; padding: 10px 12px; margin-bottom: 18px; border: 1px solid #ccc; border-radius: 8px; color: #222; font-size: 14px;" />
            <label for="groq-model-select" style="display: block; margin-bottom: 6px; color: #333; font-weight: 600;">Modelo Groq:</label>
            <select id="groq-model-select" style="width: 100%; padding: 10px 12px; margin-bottom: 18px; border: 1px solid #ccc; border-radius: 8px; color: #222; font-size: 14px;"></select>
            <div style="display: flex; justify-content: flex-end; gap: 10px; flex-wrap: wrap;">
                <button id="groq-save-settings-btn" style="padding: 10px 18px; border: none; border-radius: 8px; background-color: #0d6efd; color: white; cursor: pointer;">Salvar</button>
                <button id="groq-close-settings-btn" style="padding: 10px 18px; border: none; border-radius: 8px; background-color: #6c757d; color: white; cursor: pointer;">Fechar</button>
            </div>
        `;

        document.body.appendChild(settingsModal);

        const apiKeyInput = settingsModal.querySelector('#groq-api-key-input');
        apiKeyInput.value = groqApiKey;
        const modelSelect = settingsModal.querySelector('#groq-model-select');

        fetchGroqModels(modelSelect);

        settingsModal.querySelector('#groq-save-settings-btn').addEventListener('click', () => {
            groqApiKey = apiKeyInput.value.trim();
            selectedModel = modelSelect.value;
            GM_setValue('groqApiKey', groqApiKey);
            GM_setValue('selectedModel', selectedModel);
            alert('Configurações salvas!');
            closeSettingsModal();
        });

        settingsModal.querySelector('#groq-close-settings-btn').addEventListener('click', closeSettingsModal);
    }

    function closeSettingsModal() {
        if (settingsModal) {
            settingsModal.remove();
            settingsModal = null;
            hideBackdrop();
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
            onload(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (Array.isArray(data.data)) {
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
                } catch (error) {
                    console.error('Erro ao processar modelos Groq:', error);
                    addDefaultModelOption(selectElement);
                }
            },
            onerror(error) {
                console.error('Erro ao buscar modelos Groq:', error);
                addDefaultModelOption(selectElement);
            }
        });
    }

    if (!groqApiKey) {
        console.log('Groq API Key não configurada. Use o menu Tampermonkey para abrir as configurações.');
    }

    GM_registerMenuCommand('Configurações do Verba Prism', openSettingsModal);
    GM_registerMenuCommand('Melhorar seleção usando IA', () => {
        const selectionData = getSelectionData();
        if (selectionData.text && selectionData.text.trim().length > 0) {
            callGroqAPI(selectionData.text.trim(), selectionData);
        } else {
            alert('Por favor, selecione um texto para melhorar.');
        }
    });
})();
