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
// @grant        GM_setClipboard
// @connect      api.groq.com
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    if (window.top !== window.self) {
        console.log('Verba Prism script skipped inside iframe.');
        return;
    }

    const SCRIPT_DEBUG_VERSION = `debug-${Date.now()}`;
    const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
    const GROQ_MODELS_URL = 'https://api.groq.com/openai/v1/models';
    const DEFAULT_MODEL = 'llama-3.3-70b-versatile';
    const ACCENT_COLOR = '#ED0053';
    const MODAL_Z_INDEX = 100000;

    let groqApiKey = GM_getValue('groqApiKey', '');
    let selectedModel = GM_getValue('selectedModel', DEFAULT_MODEL);
    let promptMode = GM_getValue('promptMode', 'Aprimorar');

    let backdrop = null;
    let toastContainer = null;
    let loadingOverlay = null;
    let resultModal = null;
    let settingsModal = null;
    let fieldActionButton = null;
    let activeTextField = null;
    let fieldHideTimeout = null;
    let originalSelectionData = null;
    let contextMenuOverlay = null;

    function createElement(tag, attrs = {}, styles = {}, html = '') {
        const el = document.createElement(tag);
        Object.keys(attrs).forEach(key => el.setAttribute(key, attrs[key]));
        Object.assign(el.style, styles);
        if (html) {
            el.innerHTML = html;
        }
        return el;
    }

    function injectStyles() {
        if (document.getElementById('groq-enhancer-styles')) {
            return;
        }

        const css = `
            #groq-enhancer-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(10, 12, 24, 0.82);
                backdrop-filter: blur(8px);
                z-index: ${MODAL_Z_INDEX - 1};
            }
            .groq-enhancer-modal header {
                padding: 22px 24px 16px;
                border-bottom: 1px solid rgba(255,255,255,0.08);
            }
            .groq-enhancer-modal header h3 {
                margin: 0;
                font-size: 1.15rem;
                letter-spacing: -0.03em;
                color: #fff;
            }
            .groq-enhancer-modal header p {
                margin: 8px 0 0;
                font-size: 0.95rem;
                color: #cbd5e1;
                line-height: 1.5;
            }
            .groq-enhancer-modal {
                position: fixed;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: min(92vw, 720px);
                max-height: 92vh;
                border-radius: 22px;
                background: #111827;
                border: 1px solid rgba(237, 0, 83, 0.22);
                box-shadow: 0 28px 80px rgba(0,0,0,0.42);
                color: #f8fafc;
                font-family: Inter, system-ui, sans-serif;
                z-index: ${MODAL_Z_INDEX};
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }
            .groq-enhancer-modal .groq-body {
                padding: 20px 24px 22px;
                display: grid;
                gap: 16px;
                overflow: auto;
            }
            .groq-enhancer-modal .groq-footer {
                padding: 16px 24px 20px;
                display: flex;
                justify-content: flex-end;
                gap: 12px;
                flex-wrap: wrap;
                border-top: 1px solid rgba(255,255,255,0.08);
            }
            .groq-enhancer-modal button,
            .groq-enhancer-action-button {
                border: none;
                border-radius: 999px;
                padding: 12px 18px;
                font-size: 0.95rem;
                font-weight: 600;
                transition: transform 0.16s ease, opacity 0.16s ease, background-color 0.16s ease;
                cursor: pointer;
            }
            .groq-enhancer-modal button:hover,
            .groq-enhancer-action-button:hover {
                transform: translateY(-1px);
            }
            .groq-enhancer-primary {
                background: linear-gradient(135deg, ${ACCENT_COLOR} 0%, #bf0041 100%);
                color: #fff;
                box-shadow: 0 18px 40px rgba(237, 0, 83, 0.28);
            }
            .groq-enhancer-secondary {
                background: rgba(255,255,255,0.08);
                color: #f8fafc;
            }
            .groq-enhancer-danger {
                background: #e11d48;
                color: #fff;
            }
            .groq-enhancer-textarea,
            .groq-enhancer-input,
            .groq-enhancer-select {
                width: 100%;
                min-height: 44px;
                padding: 12px 14px;
                border-radius: 16px;
                border: 1px solid rgba(255,255,255,0.12);
                background: #0f172a;
                color: #e2e8f0;
                font-size: 0.96rem;
                outline: none;
            }
            .groq-enhancer-textarea {
                min-height: 220px;
                max-height: calc(72vh - 160px);
                resize: vertical;
            }
            .groq-enhancer-textarea:focus,
            .groq-enhancer-input:focus,
            .groq-enhancer-select:focus {
                border-color: rgba(237,0,83,0.7);
                box-shadow: 0 0 0 4px rgba(237,0,83,0.14);
            }
            .groq-enhancer-label {
                display: block;
                margin-bottom: 6px;
                color: #cbd5e1;
                font-size: 0.88rem;
                font-weight: 600;
            }
            .groq-enhancer-note {
                font-size: 0.9rem;
                color: #94a3b8;
                line-height: 1.5;
            }
            .groq-enhancer-message {
                border-radius: 16px;
                padding: 14px 16px;
                background: rgba(30, 41, 59, 0.95);
                border: 1px solid rgba(255,255,255,0.08);
                color: #f8fafc;
                font-size: 0.93rem;
            }
            .groq-enhancer-error {
                border-color: rgba(241, 146, 188, 0.35);
                background: rgba(244, 63, 94, 0.12);
                color: #f8d7da;
            }
            #groq-enhancer-toast-container {
                position: fixed;
                right: 18px;
                bottom: 18px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                z-index: ${MODAL_Z_INDEX + 20};
                pointer-events: none;
            }
            .groq-enhancer-toast {
                min-width: 280px;
                max-width: 360px;
                padding: 14px 18px;
                border-radius: 16px;
                background: rgba(15, 23, 42, 0.98);
                color: #f8fafc;
                box-shadow: 0 18px 40px rgba(0,0,0,0.18);
                border: 1px solid rgba(255,255,255,0.08);
                pointer-events: auto;
                animation: groq-toast-enter 0.28s ease;
            }
            .groq-enhancer-toast.success { border-color: rgba(16, 185, 129,0.35); }
            .groq-enhancer-toast.error { border-color: rgba(252, 165, 165,0.35); }
            .groq-enhancer-toast strong { display: block; margin-bottom: 6px; }
            @keyframes groq-toast-enter { from { transform: translateY(10px); opacity:0; } to { transform: translateY(0); opacity:1; }}
            .groq-enhancer-action-button {
                position: fixed;
                right: 18px;
                bottom: 18px;
                width: 42px;
                height: 42px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                background: ${ACCENT_COLOR};
                color: #fff;
                font-size: 1.1rem;
                border: 1px solid rgba(255,255,255,0.15);
                z-index: ${MODAL_Z_INDEX - 2};
                opacity: 1;
                transform: translateY(0) scale(1);
                visibility: visible;
                transition: box-shadow 0.18s ease, background-color 0.18s ease, transform 0.18s ease;
                backdrop-filter: blur(10px);
                box-shadow: 0 16px 38px rgba(237, 0, 83, 0.25);
                padding: 0;
                cursor: pointer;
            }
        `;

        const style = createElement('style', { id: 'groq-enhancer-styles' }, {}, css);
        document.head.appendChild(style);
    }

    function createToastContainer() {
        if (toastContainer) {
            return;
        }
        toastContainer = createElement('div', { id: 'groq-enhancer-toast-container' });
        document.body.appendChild(toastContainer);
    }

    function showToast(message, type = 'info') {
        createToastContainer();
        const toast = createElement('div', { class: `groq-enhancer-toast ${type}` }, {}, `
            <strong>${type === 'error' ? 'Erro' : type === 'success' ? 'Sucesso' : 'Aviso'}</strong>
            <div>${message}</div>
        `);
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 4200);
    }

    function showError(message) {
        showToast(message, 'error');
    }

    function showSuccess(message) {
        showToast(message, 'success');
    }

    function showBackdrop() {
        if (backdrop) {
            return;
        }
        backdrop = createElement('div', { id: 'groq-enhancer-backdrop' });
        document.body.appendChild(backdrop);
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
        return new Set(['text', 'search', 'email', 'url', 'tel', 'number']).has((element.type || 'text').toLowerCase()) && !element.readOnly && !element.disabled;
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
        fieldActionButton = createElement('button', { id: 'groq-enhancer-field-action', type: 'button', title: 'Melhorar texto com Verba Prism' }, {
            position: 'fixed',
            right: '18px',
            bottom: '18px',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: ACCENT_COLOR,
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.15)',
            cursor: 'pointer',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            fontWeight: '700',
            boxShadow: '0 16px 38px rgba(237, 0, 83, 0.25)',
            padding: '0',
            pointerEvents: 'auto',
            zIndex: MODAL_Z_INDEX - 2,
            transition: 'box-shadow 0.18s ease, background-color 0.18s ease, transform 0.18s ease'
        });
        fieldActionButton.textContent = '✦';

        fieldActionButton.addEventListener('click', handleFieldActionClick);
        fieldActionButton.addEventListener('mousedown', event => event.stopPropagation());
        document.body.appendChild(fieldActionButton);
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
        let textToSend = '';
        let selectionData = null;

        if (activeTextField && activeTextField.value) {
            const value = activeTextField.value;
            const start = activeTextField.selectionStart || 0;
            const end = activeTextField.selectionEnd || value.length;
            const selectedText = value.slice(start, end).trim();

            if (selectedText) {
                textToSend = selectedText;
                selectionData = {
                    source: 'input',
                    element: activeTextField,
                    text: selectedText,
                    start,
                    end
                };
            } else if (value.trim()) {
                textToSend = value;
                selectionData = {
                    source: 'input',
                    element: activeTextField,
                    text: value,
                    start: 0,
                    end: value.length
                };
            }
        }

        if (!textToSend) {
            const pageSelection = getSelectionData();
            if (pageSelection.text && pageSelection.text.trim()) {
                textToSend = pageSelection.text;
                selectionData = pageSelection;
            }
        }

        if (!textToSend || !textToSend.trim()) {
            showError('Selecione algum texto na página ou clique dentro de um campo de texto.');
            return;
        }

        callGroqAPI(textToSend.trim(), selectionData);
    }

    function getSelectionData() {
        const activeEl = document.activeElement;
        if (activeEl && /^(?:INPUT|TEXTAREA)$/.test(activeEl.tagName) && typeof activeEl.selectionStart === 'number') {
            const value = activeEl.value || '';
            const start = activeEl.selectionStart;
            const end = activeEl.selectionEnd;
            const selectedText = value.slice(start, end).trim();
            if (selectedText) {
                return {
                    source: 'input',
                    element: activeEl,
                    text: selectedText,
                    start,
                    end
                };
            }
            if (value.trim()) {
                return {
                    source: 'input',
                    element: activeEl,
                    text: value,
                    start: 0,
                    end: value.length
                };
            }
        }

        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const text = selection.toString().trim();
            if (text) {
                return {
                    source: 'range',
                    range: selection.getRangeAt(0).cloneRange(),
                    text
                };
            }
        }

        return { source: 'none', text: '' };
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

    function createLoadingOverlay() {
        if (loadingOverlay) {
            return;
        }
        loadingOverlay = createElement('div', {}, {
            position: 'fixed',
            inset: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(15, 23, 42, 0.82)',
            zIndex: MODAL_Z_INDEX + 5,
            color: '#fff',
            fontFamily: 'Inter, system-ui, sans-serif'
        });
        loadingOverlay.innerHTML = `
            <div style="display:flex;align-items:center;gap:14px;padding:18px 22px;border-radius:20px;background:rgba(15,23,42,0.96);border:1px solid rgba(255,255,255,0.1);box-shadow:0 28px 80px rgba(0,0,0,0.28);">
                <div style="width:34px;height:34px;border:4px solid rgba(255,255,255,0.18);border-top-color:${ACCENT_COLOR};border-radius:50%;animation:groq-spin 1s linear infinite;"></div>
                <div style="font-size:0.98rem;line-height:1.4;">Aprimorando texto com IA...</div>
            </div>
        `;
        document.body.appendChild(loadingOverlay);
    }

    function removeLoadingOverlay() {
        if (loadingOverlay) {
            loadingOverlay.remove();
            loadingOverlay = null;
        }
    }

    function createResultModal(text, selectionData) {
        originalSelectionData = selectionData;
        showBackdrop();
        resultModal = createElement('div', { class: 'groq-enhancer-modal' });
        resultModal.innerHTML = `
            <header>
                <h3>Resultado Verba Prism</h3>
                <p>Revise o resultado e escolha copiar ou substituir o texto original.</p>
            </header>
            <section class="groq-body">
                <div class="groq-enhancer-message">O Verba Prism processou seu texto usando o modelo <strong>${selectedModel}</strong> no modo <strong>${promptMode}</strong>.</div>
                <textarea id="groq-enhanced-text" class="groq-enhancer-textarea" rows="10">${text}</textarea>
            </section>
            <footer class="groq-footer">
                <button id="groq-copy-btn" class="groq-enhancer-secondary">Copiar</button>
                <button id="groq-replace-btn" class="groq-enhancer-primary">Substituir</button>
                <button id="groq-close-btn" class="groq-enhancer-secondary">Fechar</button>
            </footer>
        `;
        document.body.appendChild(resultModal);

        const resultTextarea = resultModal.querySelector('#groq-enhanced-text');
        resultTextarea.focus();
        resultModal.querySelector('#groq-copy-btn').addEventListener('click', async () => {
            const textToCopy = resultTextarea.value;
            const copied = await copyTextToClipboard(textToCopy);
            if (copied) {
                showSuccess('Texto copiado para a área de transferência.');
            } else {
                showError('Não foi possível copiar o texto automaticamente. Tente novamente.');
            }
        });

        resultModal.querySelector('#groq-replace-btn').addEventListener('click', () => {
            const success = replaceSelectedText(originalSelectionData, resultTextarea.value);
            if (!success) {
                showError('Não foi possível substituir automaticamente. Copie o texto e cole manualmente.');
            } else {
                showSuccess('Texto original substituído com sucesso.');
            }
            removeResultModal();
        });

        resultModal.querySelector('#groq-close-btn').addEventListener('click', removeResultModal);
    }

    function removeResultModal() {
        if (resultModal) {
            resultModal.remove();
            resultModal = null;
            originalSelectionData = null;
            hideBackdrop();
        }
    }

    async function copyTextToClipboard(text) {
        if (!text) {
            return false;
        }
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                return true;
            }
            if (typeof GM_setClipboard === 'function') {
                GM_setClipboard(text, 'text');
                return true;
            }
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            const success = document.execCommand('copy');
            textarea.remove();
            return success;
        } catch (error) {
            console.error('Erro ao copiar para clipboard:', error);
            return false;
        }
    }

    function callGroqAPI(textToEnhance, selectionData) {
        if (!groqApiKey) {
            showError('Configure sua chave Groq antes de usar o Verba Prism.');
            openSettingsModal();
            return;
        }
        createLoadingOverlay();
        const messages = [
            { role: 'system', content: buildPrompt() },
            { role: 'user', content: textToEnhance }
        ];
        GM_xmlhttpRequest({
            method: 'POST',
            url: GROQ_API_URL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${groqApiKey}`
            },
            data: JSON.stringify({ model: selectedModel, messages, temperature: 0.7 }),
            onload(response) {
                removeLoadingOverlay();
                try {
                    const data = JSON.parse(response.responseText);
                    if (response.status < 200 || response.status >= 300) {
                        const message = data?.error?.message || response.statusText || 'Erro na requisição';
                        showError(`Erro ${response.status}: ${message}`);
                        console.error('Groq API HTTP error:', response.status, response.responseText);
                        return;
                    }
                    const enhancedText = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text;
                    if (enhancedText) {
                        createResultModal(enhancedText.trim(), selectionData);
                    } else if (data?.error) {
                        showError(`Erro da API: ${data.error.message}`);
                        console.error('Groq API Error:', data.error);
                    } else {
                        showError('Resposta inesperada da API Groq.');
                        console.error('Unexpected Groq API response:', data);
                    }
                } catch (error) {
                    showError('Erro ao processar a resposta da API Groq.');
                    console.error('Error parsing Groq API response:', error);
                }
            },
            onerror(error) {
                removeLoadingOverlay();
                showError('Erro de conexão com a API Groq. Verifique sua rede ou chave.');
                console.error('GM_xmlhttpRequest error:', error);
            }
        });
    }

    function buildPrompt() {
        const basePrompt = `Você é um corretor e aprimorador de textos em português. Sua função é revisar, corrigir e melhorar apenas o texto enviado. Priorize a correção de erros de ortografia, digitação e gramática, preservando a intenção, o significado e o tom original. Não reinterprete o contexto do texto; corrija o texto mantendo o mesmo sentido básico. Retorne apenas o texto corrigido, sem explicações, comentários, exemplos ou instruções.`;
        const modePrompt = promptMode === 'Formal'
            ? 'Ajuste o texto para um tom mais formal, profissional e claro.'
            : promptMode === 'Conciso'
                ? 'Torne o texto mais conciso e direto, mantendo o significado.'
                : promptMode === 'Criativo'
                    ? 'Melhore o texto com maior fluidez, criatividade e expressividade.'
                    : 'Aprimore a clareza, correção e fluidez do texto.';
        return `${basePrompt} ${modePrompt}`;
    }

    function openSettingsModal() {
        if (settingsModal) {
            settingsModal.remove();
        }
        showBackdrop();
        settingsModal = createElement('div', { class: 'groq-enhancer-modal' });
        settingsModal.innerHTML = `
            <header>
                <h3>Configurações do Verba Prism</h3>
                <p>Defina sua chave Groq, modelo e modo de revisão. Essas configurações são salvas automaticamente.</p>
            </header>
            <section class="groq-body">
                <div class="groq-enhancer-message groq-enhancer-error" id="groq-settings-message" style="display:none;"></div>
                <label class="groq-enhancer-label" for="groq-api-key-input">Chave de API Groq</label>
                <input id="groq-api-key-input" type="password" class="groq-enhancer-input" placeholder="Insira sua chave Groq" value="${groqApiKey}" />
                <label class="groq-enhancer-label" for="groq-model-select">Modelo Groq</label>
                <select id="groq-model-select" class="groq-enhancer-select"></select>
                <label class="groq-enhancer-label" for="groq-prompt-select">Modo de revisão</label>
                <select id="groq-prompt-select" class="groq-enhancer-select">
                    <option value="Aprimorar">Aprimorar</option>
                    <option value="Formal">Formal</option>
                    <option value="Conciso">Conciso</option>
                    <option value="Criativo">Criativo</option>
                </select>
                <div class="groq-enhancer-note">A lista de modelos será atualizada automaticamente ao abrir este modal se a chave estiver válida.</div>
            </section>
            <footer class="groq-footer">
                <button id="groq-save-settings-btn" class="groq-enhancer-primary">Salvar configurações</button>
                <button id="groq-close-settings-btn" class="groq-enhancer-secondary">Fechar</button>
            </footer>
        `;
        document.body.appendChild(settingsModal);

        const apiKeyInput = settingsModal.querySelector('#groq-api-key-input');
        const modelSelect = settingsModal.querySelector('#groq-model-select');
        const promptSelect = settingsModal.querySelector('#groq-prompt-select');
        const messageBox = settingsModal.querySelector('#groq-settings-message');

        promptSelect.value = promptMode;
        loadModelOptions(modelSelect, messageBox);

        settingsModal.querySelector('#groq-save-settings-btn').addEventListener('click', () => {
            const apiKey = apiKeyInput.value.trim();
            if (!validateApiKey(apiKey)) {
                messageBox.textContent = 'Chave de API inválida. Verifique e tente novamente.';
                messageBox.style.display = 'block';
                return;
            }
            messageBox.style.display = 'none';
            groqApiKey = apiKey;
            selectedModel = modelSelect.value || DEFAULT_MODEL;
            promptMode = promptSelect.value;
            GM_setValue('groqApiKey', groqApiKey);
            GM_setValue('selectedModel', selectedModel);
            GM_setValue('promptMode', promptMode);
            showSuccess('Configurações salvas com sucesso.');
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

    function loadModelOptions(selectElement, messageBox) {
        selectElement.innerHTML = '';
        if (!groqApiKey) {
            addDefaultModelOption(selectElement);
            return;
        }
        GM_xmlhttpRequest({
            method: 'GET',
            url: GROQ_MODELS_URL,
            headers: { 'Authorization': `Bearer ${groqApiKey}` },
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
                        selectElement.value = selectedModel;
                    } else {
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

    function addDefaultModelOption(selectElement) {
        selectElement.innerHTML = '';
        const option = document.createElement('option');
        option.value = DEFAULT_MODEL;
        option.textContent = `${DEFAULT_MODEL} (padrão)`;
        selectElement.appendChild(option);
        selectElement.value = DEFAULT_MODEL;
    }

    function validateApiKey(key) {
        return typeof key === 'string' && key.length >= 20;
    }

    function createCustomContextMenu(x, y, selectionData) {
        removeCustomContextMenu();
        contextMenuOverlay = createElement('div', { id: 'groq-enhancer-context-menu-overlay' }, {
            position: 'fixed',
            inset: '0',
            zIndex: MODAL_Z_INDEX + 5,
            pointerEvents: 'none'
        });
        const button = createElement('button', { class: 'groq-enhancer-action-button groq-enhancer-primary' }, {
            position: 'fixed',
            left: `${x}px`,
            top: `${y}px`,
            pointerEvents: 'auto'
        }, 'Melhorar seleção');
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

    function removeCustomContextMenu() {
        if (contextMenuOverlay) {
            contextMenuOverlay.remove();
            contextMenuOverlay = null;
        }
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

    document.addEventListener('focusin', event => {
        const field = findTextField(event.target);
        if (field) {
            activeTextField = field;
        }
    }, true);

    document.addEventListener('focusout', event => {
        const field = findTextField(event.target);
        if (field === activeTextField) {
            activeTextField = null;
        }
    }, true);

    document.addEventListener('mousedown', event => {
        if (contextMenuOverlay && !event.target.closest('#groq-enhancer-context-menu-overlay')) {
            removeCustomContextMenu();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            removeCustomContextMenu();
            if (resultModal) {
                removeResultModal();
            }
            if (settingsModal) {
                closeSettingsModal();
            }
        }
    });

    function registerMenuCommands() {
        GM_registerMenuCommand('Configurações do Verba Prism', openSettingsModal);
        GM_registerMenuCommand('Melhorar seleção usando IA', () => {
            const selectionData = getSelectionData();
            if (selectionData.text && selectionData.text.trim().length > 0) {
                callGroqAPI(selectionData.text.trim(), selectionData);
            } else {
                showError('Selecione um texto antes de usar o Verba Prism.');
            }
        });
    }

    function initialize() {
        injectStyles();
        createToastContainer();
        createFieldActionButton();
        registerMenuCommands();
        if (!groqApiKey) {
            showToast('Configure sua chave Groq em Configurações antes de usar o Verba Prism.', 'info');
        }
        console.log(`Verba Prism script.js carregado — versão de depuração ${SCRIPT_DEBUG_VERSION}`);
    }

    initialize();
})();
