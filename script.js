// ==UserScript==
// @name         Verba Prism v3.1 (Tabs & Modes)
// @namespace    http://tampermonkey.net/
// @version      0.5.0
// @description  Aprimora texto com abas para chaves de API, seletor de provedor ativo e modos de processamento expandidos.
// @author       Diones Souza (Melhorias: Manus AI)
// @icon         https://cdn-icons-png.magnific.com/64/9708/9708616.png
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @connect      api.groq.com
// @connect      api.openai.com
// @connect      generativelanguage.googleapis.com
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    if (window.top !== window.self) return;

    // ============================================
    // CONSTANTES E CONFIGURAÇÕES
    // ============================================
    const ACCENT_COLOR = '#ED0053';
    const MODAL_Z_INDEX = 100000;
    
    const PROVIDERS = {
        groq: { name: 'Groq', apiUrl: 'https://api.groq.com/openai/v1/chat/completions', defaultModel: 'llama-3.3-70b-versatile' },
        openai: { name: 'OpenAI', apiUrl: 'https://api.openai.com/v1/chat/completions', defaultModel: 'gpt-4o-mini' },
        gemini: { name: 'Gemini', apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent', defaultModel: 'gemini-1.5-flash' }
    };

    // ============================================
    // MODOS DE PROCESSAMENTO
    // Cada entrada define o prompt enviado à IA.
    // Use template literals para prompts com múltiplas linhas.
    // ============================================
    const MODES = {
        'Aprimorar': `Melhore a clareza, gramática e fluidez, mantendo o sentido original.
Caso existam textos entre asteriscos, mantenha este formato.`,

        'Formal': `Reescreva em um tom profissional, elegante e formal.`,

        'Conciso': `Reduza o texto ao essencial, eliminando redundâncias.`,

        'Criativo': `Dê um toque artístico, expressivo e criativo ao texto.`,

        'Roleplay': `Você é um FORMATADOR RÍGIDO de texto em estilo roleplay.
Sua função é converter qualquer entrada em uma cena estruturada seguindo regras estritas de formatação, sem criar conteúdo adicional, sem explicações e sem repetir informações.

REGRAS ABSOLUTAS:
(1) Todo conteúdo que não for fala direta deve obrigatoriamente estar dentro de *asteriscos*. Isso inclui ações, pensamentos, emoções e descrições.
(2) Apenas falas podem existir fora de *asteriscos*.
(3) Fala nunca pode estar dentro de *asteriscos*.
(4) Falas começam com letra maiúscula e terminam com ponto final.
(5) Nunca usar aspas.
(6) Nunca adicionar qualquer texto fora do formato final da cena.
(7) É PROIBIDO repetir a mesma informação em mais de um formato ou linha; cada informação deve aparecer apenas uma vez.
(8) Se houver qualquer dúvida de classificação, sempre usar *asteriscos*.
(9) Nunca quebrar essas regras sob nenhuma circunstância.

ESTRUTURA: separar ações em blocos apenas quando houver mudança clara de foco, personagem ou ambiente, evitando redundância ou repetição de ideias.

REGRA FINAL: se não for fala direta, obrigatoriamente deve estar em *asteriscos*.

EXEMPLOS:
INPUT: personagem entra nervoso
OUTPUT: *O personagem entrou devagar, com o corpo tenso e atento ao ambiente.* Ele está nervoso.

INPUT: personagem quer ver o local
OUTPUT: *O personagem observou o ambiente com atenção antes de agir.* Quero ver o local.

INPUT: personagem se apresenta
OUTPUT: *O personagem manteve postura calma antes de falar.* Prazer.`,

        'Traduzir (EN)': `Traduza o texto fielmente para o Inglês.`,

        'Resumir': `Crie um resumo conciso em tópicos (bullet points).`,

        'Corrigir': `Apenas corrija erros de ortografia e pontuação, sem alterar o estilo.`,
    };

    // Estado global
    let currentProvider = GM_getValue('provider', 'groq');
    let apiKeys = GM_getValue('apiKeys', { groq: '', openai: '', gemini: '' });
    let selectedModels = GM_getValue('selectedModels', { groq: 'llama-3.3-70b-versatile', openai: 'gpt-4o-mini', gemini: 'gemini-1.5-flash' });
    let promptMode = GM_getValue('promptMode', 'Aprimorar');
    let showDiffMode = GM_getValue('showDiffMode', true);
    let locale = GM_getValue('locale', 'pt');

    // UI Elements
    let backdrop = null;
    let activeModal = null;
    let floatingBtn = null;
    let lastFocusedField = null;

    // ============================================
    // ESTILOS (UI COM ABAS)
    // ============================================
    function injectStyles() {
        if (document.getElementById('vp-styles')) return;
        const css = `
            :root {
                --vp-accent: ${ACCENT_COLOR};
                --vp-bg: #0f172a;
                --vp-card: #1e293b;
                --vp-text: #f1f5f9;
                --vp-text-dim: #94a3b8;
                --vp-border: rgba(255,255,255,0.08);
            }

            .vp-modal-backdrop {
                position: fixed; inset: 0; background: rgba(2,6,23,0.85); backdrop-filter: blur(8px);
                z-index: ${MODAL_Z_INDEX}; display: flex; align-items: center; justify-content: center;
                animation: vp-fade 0.2s ease-out;
            }

            .vp-modal {
                background: var(--vp-bg); color: var(--vp-text); width: min(92vw, 550px);
                border-radius: 1.25rem; border: 1px solid var(--vp-border);
                box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); overflow: hidden; display: flex; flex-direction: column;
                animation: vp-slide 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
            }

            .vp-header {
                padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--vp-border);
                display: flex; justify-content: space-between; align-items: center;
                background: rgba(255,255,255,0.02);
            }

            .vp-header h2 { margin: 0; font-size: 1.1rem; font-weight: 700; color: var(--vp-accent); text-transform: uppercase; letter-spacing: 0.05em; }

            .vp-body { padding: 1.5rem; overflow-y: auto; max-height: 75vh; }

            .vp-footer {
                padding: 1.25rem; border-top: 1px solid var(--vp-border);
                display: flex; justify-content: flex-end; gap: 0.75rem; background: rgba(0,0,0,0.15);
            }

            /* Tabs System */
            .vp-tabs { display: flex; border-bottom: 1px solid var(--vp-border); margin-bottom: 1.5rem; gap: 4px; }
            .vp-tab {
                padding: 0.75rem 1rem; cursor: pointer; color: var(--vp-text-dim); font-size: 0.875rem;
                font-weight: 600; border-bottom: 2px solid transparent; transition: all 0.2s;
                flex: 1; text-align: center;
            }
            .vp-tab:hover { color: var(--vp-text); background: rgba(255,255,255,0.03); }
            .vp-tab.active { color: var(--vp-accent); border-bottom-color: var(--vp-accent); background: rgba(237,0,83,0.05); }

            .vp-input-group { margin-bottom: 1.25rem; }
            .vp-label { display: block; margin-bottom: 0.5rem; font-size: 0.8rem; font-weight: 700; color: var(--vp-text-dim); text-transform: uppercase; }
            
            .vp-input, .vp-select, .vp-textarea {
                width: 100%; background: var(--vp-card); border: 1px solid var(--vp-border);
                border-radius: 0.75rem; padding: 0.8rem; color: var(--vp-text);
                font-size: 0.95rem; transition: all 0.2s; box-sizing: border-box;
            }

            .vp-input:focus, .vp-select:focus { border-color: var(--vp-accent); outline: none; background: #2d3a4f; }

            .vp-btn {
                padding: 0.7rem 1.4rem; border-radius: 0.75rem; font-weight: 700; cursor: pointer;
                transition: all 0.2s; border: none; font-size: 0.85rem;
            }

            .vp-btn-primary { background: var(--vp-accent); color: white; box-shadow: 0 4px 12px rgba(237,0,83,0.3); }
            .vp-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(237,0,83,0.4); }
            .vp-btn-secondary { background: var(--vp-card); color: var(--vp-text); border: 1px solid var(--vp-border); }
            .vp-btn-secondary:hover { background: #334155; }

            .vp-textarea { min-height: 220px; resize: vertical; line-height: 1.6; font-family: inherit; }

            .vp-floating-btn {
                position: fixed; right: 24px; bottom: 24px; width: 54px; height: 54px;
                background: var(--vp-accent); color: white; border-radius: 50%;
                display: flex; align-items: center; justify-content: center; cursor: pointer;
                box-shadow: 0 10px 25px -5px rgba(237,0,83,0.4); z-index: ${MODAL_Z_INDEX - 1};
                transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); border: 2px solid rgba(255,255,255,0.1);
                font-size: 1.6rem;
            }

            .vp-floating-btn:hover { transform: scale(1.1) rotate(15deg); box-shadow: 0 15px 30px -5px rgba(237,0,83,0.5); }

            .vp-diff-box {
                background: #020617; border-radius: 0.75rem; padding: 1.25rem; font-family: 'JetBrains Mono', 'Fira Code', monospace;
                font-size: 0.85rem; margin-top: 1rem; white-space: pre-wrap; line-height: 1.5; border: 1px solid var(--vp-border);
            }

            .vp-removed { color: #ef4444; text-decoration: line-through; background: rgba(239,68,68,0.15); padding: 0 2px; border-radius: 2px; }
            .vp-added { color: #10b981; background: rgba(16,185,129,0.15); padding: 0 2px; border-radius: 2px; font-weight: 600; }

            @keyframes vp-fade { from { opacity: 0; } to { opacity: 1; } }
            @keyframes vp-slide { from { transform: translateY(30px) scale(0.9); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        `;
        const style = document.createElement('style');
        style.id = 'vp-styles';
        style.textContent = css;
        document.head.appendChild(style);
    }

    // ============================================
    // LÓGICA DE API
    // ============================================
    async function callAI(text, selectionData) {
        const provider = PROVIDERS[currentProvider];
        const key = apiKeys[currentProvider];
        const model = selectedModels[currentProvider];

        if (!key) {
            alert(`Configure a chave de API para ${provider.name} nas abas de configurações.`);
            openSettings();
            return;
        }

        showLoading();

        try {
            let responseText = '';
            const modePrompt = MODES[promptMode];
            const systemPrompt = `Você é um assistente de escrita especializado.\n\nObjetivo:\n${modePrompt}\n\nRetorne APENAS o texto processado, sem introduções ou explicações.`;

            if (currentProvider === 'gemini') {
                const url = provider.apiUrl.replace('{model}', model) + `?key=${key}`;
                const payload = {
                    contents: [{ parts: [{ text: `${systemPrompt}\n\nTexto: ${text}` }] }],
                    generationConfig: { temperature: 0.7 }
                };

                const res = await request('POST', url, { 'Content-Type': 'application/json' }, JSON.stringify(payload));
                const data = JSON.parse(res.responseText);
                if (data.error) throw new Error(data.error.message);
                responseText = data.candidates[0].content.parts[0].text;
            } else {
                const payload = {
                    model: model,
                    messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: text }],
                    temperature: 0.7
                };

                const res = await request('POST', provider.apiUrl, {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${key}`
                }, JSON.stringify(payload));
                
                const data = JSON.parse(res.responseText);
                if (data.error) throw new Error(data.error.message);
                responseText = data.choices[0].message.content;
            }

            hideLoading();
            openResult(responseText.trim(), selectionData);
        } catch (err) {
            hideLoading();
            alert(`Erro no ${PROVIDERS[currentProvider].name}: ${err.message || 'Falha na conexão'}`);
        }
    }

    function request(method, url, headers, data) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({ method, url, headers, data, onload: resolve, onerror: reject });
        });
    }

    // ============================================
    // UI - MODAL DE CONFIGURAÇÕES (COM ABAS)
    // ============================================
    function openSettings() {
        let activeTab = 'groq';

        const content = `
            <div class="vp-tabs">
                <div class="vp-tab active" data-tab="groq">GROQ</div>
                <div class="vp-tab" data-tab="openai">OPENAI</div>
                <div class="vp-tab" data-tab="gemini">GEMINI</div>
            </div>
            
            <div id="vp-tab-content">
                <!-- Conteúdo da aba injetado aqui -->
            </div>

            <hr style="border: 0; border-top: 1px solid var(--vp-border); margin: 1.5rem 0;">

            <div class="vp-input-group">
                <label class="vp-label">Provedor Ativo</label>
                <select id="vp-set-active-provider" class="vp-select">
                    <option value="groq" ${currentProvider === 'groq' ? 'selected' : ''}>Groq (Recomendado)</option>
                    <option value="openai" ${currentProvider === 'openai' ? 'selected' : ''}>OpenAI</option>
                    <option value="gemini" ${currentProvider === 'gemini' ? 'selected' : ''}>Google Gemini</option>
                </select>
            </div>

            <div class="vp-input-group">
                <label class="vp-label">Modo de Processamento</label>
                <select id="vp-set-mode" class="vp-select">
                    ${Object.keys(MODES).map(m => `<option value="${m}" ${promptMode === m ? 'selected' : ''}>${m}</option>`).join('')}
                </select>
            </div>
        `;

        const footer = `
            <button class="vp-btn vp-btn-secondary" id="vp-btn-close">Fechar</button>
            <button class="vp-btn vp-btn-primary" id="vp-btn-save">Salvar Tudo</button>
        `;

        openModal('VERBA PRISM - CONFIGURAÇÕES', content, footer);

        const renderTab = (tabId) => {
            activeTab = tabId;
            document.querySelectorAll('.vp-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
            
            const contentDiv = document.getElementById('vp-tab-content');
            contentDiv.innerHTML = `
                <div class="vp-input-group">
                    <label class="vp-label">Chave de API (${PROVIDERS[tabId].name})</label>
                    <input type="password" id="vp-tab-key" class="vp-input" value="${apiKeys[tabId] || ''}" placeholder="sk-...">
                </div>
                <div class="vp-input-group">
                    <label class="vp-label">Modelo Customizado</label>
                    <input type="text" id="vp-tab-model" class="vp-input" value="${selectedModels[tabId] || PROVIDERS[tabId].defaultModel}" placeholder="${PROVIDERS[tabId].defaultModel}">
                </div>
            `;

            // Salvar temporariamente ao digitar para não perder ao trocar de aba
            document.getElementById('vp-tab-key').oninput = (e) => apiKeys[activeTab] = e.target.value;
            document.getElementById('vp-tab-model').oninput = (e) => selectedModels[activeTab] = e.target.value;
        };

        document.querySelectorAll('.vp-tab').forEach(tab => {
            tab.onclick = () => renderTab(tab.dataset.tab);
        });

        renderTab('groq');

        document.getElementById('vp-btn-close').onclick = closeModal;
        document.getElementById('vp-btn-save').onclick = () => {
            currentProvider = document.getElementById('vp-set-active-provider').value;
            promptMode = document.getElementById('vp-set-mode').value;

            GM_setValue('provider', currentProvider);
            GM_setValue('apiKeys', apiKeys);
            GM_setValue('selectedModels', selectedModels);
            GM_setValue('promptMode', promptMode);

            alert('Configurações salvas com sucesso!');
            closeModal();
        };
    }

    // ============================================
    // MODAL DE RESULTADO E AUXILIARES
    // ============================================
    function openModal(title, contentHtml, footerHtml) {
        if (activeModal) closeModal();
        backdrop = document.createElement('div');
        backdrop.className = 'vp-modal-backdrop';
        const modal = document.createElement('div');
        modal.className = 'vp-modal';
        modal.innerHTML = `
            <div class="vp-header"><h2>${title}</h2><button class="vp-btn vp-btn-secondary" style="padding: 0.4rem 0.6rem;" id="vp-close-x">✕</button></div>
            <div class="vp-body">${contentHtml}</div>
            <div class="vp-footer">${footerHtml}</div>
        `;
        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);
        activeModal = backdrop;
        document.getElementById('vp-close-x').onclick = closeModal;
        backdrop.onclick = (e) => { if (e.target === backdrop) closeModal(); };
    }

    function closeModal() { if (activeModal) { activeModal.remove(); activeModal = null; } }

    function openResult(result, selectionData) {
        const content = `
            <textarea id="vp-result-text" class="vp-textarea">${result}</textarea>
            ${showDiffMode && selectionData.text ? `<div class="vp-diff-box">${generateDiff(selectionData.text, result)}</div>` : ''}
        `;
        const footer = `
            <button class="vp-btn vp-btn-secondary" id="vp-res-copy">Copiar</button>
            <button class="vp-btn vp-btn-primary" id="vp-res-replace">Substituir Texto</button>
        `;
        openModal('VERBA PRISM - RESULTADO', content, footer);
        document.getElementById('vp-res-copy').onclick = () => {
            GM_setClipboard(document.getElementById('vp-result-text').value);
            document.getElementById('vp-res-copy').textContent = '✓ Copiado';
        };
        document.getElementById('vp-res-replace').onclick = () => {
            replaceText(selectionData, document.getElementById('vp-result-text').value);
            closeModal();
        };
    }

    function showLoading() {
        const div = document.createElement('div');
        div.id = 'vp-loading';
        div.className = 'vp-modal-backdrop';
        div.innerHTML = `<div class="vp-modal" style="width: auto; padding: 2.5rem; align-items: center;">
            <div style="width: 44px; height: 44px; border: 4px solid var(--vp-accent); border-top-color: transparent; border-radius: 50%; animation: vp-spin 0.8s linear infinite;"></div>
            <p style="margin: 1.25rem 0 0; font-weight: 700; color: var(--vp-accent); letter-spacing: 0.1em;">PROCESSANDO...</p>
        </div><style>@keyframes vp-spin { to { transform: rotate(360deg); } }</style>`;
        document.body.appendChild(div);
    }

    function hideLoading() { const l = document.getElementById('vp-loading'); if (l) l.remove(); }

    function generateDiff(oldText, newText) {
        const oldWords = oldText.split(/\s+/);
        const newWords = newText.split(/\s+/);
        let html = '';
        let i = 0, j = 0;
        while (i < oldWords.length || j < newWords.length) {
            if (i < oldWords.length && j < newWords.length && oldWords[i] === newWords[j]) {
                html += oldWords[i] + ' '; i++; j++;
            } else if (i < oldWords.length && (j >= newWords.length || oldWords[i] !== newWords[j])) {
                html += `<span class="vp-removed">${oldWords[i]}</span> `; i++;
            } else if (j < newWords.length) {
                html += `<span class="vp-added">${newWords[j]}</span> `; j++;
            }
        }
        return html;
    }

    function replaceText(data, newText) {
        if (data.source === 'input' && data.element) {
            const el = data.element;
            const val = el.value;
            el.value = val.slice(0, data.start) + newText + val.slice(data.end);
            el.dispatchEvent(new Event('input', { bubbles: true }));
        } else if (data.source === 'range' && data.range) {
            data.range.deleteContents();
            data.range.insertNode(document.createTextNode(newText));
        }
    }

    function getSelectionData() {
        const sel = window.getSelection();
        const text = sel.toString().trim();
        if (text) return { source: 'range', range: sel.getRangeAt(0).cloneRange(), text };
        if (lastFocusedField && lastFocusedField.value) {
            const el = lastFocusedField;
            if (el.selectionStart !== el.selectionEnd) {
                return { source: 'input', element: el, text: el.value.slice(el.selectionStart, el.selectionEnd), start: el.selectionStart, end: el.selectionEnd };
            }
            return { source: 'input', element: el, text: el.value, start: 0, end: el.value.length };
        }
        return null;
    }

    // ============================================
    // INICIALIZAÇÃO
    // ============================================
    function init() {
        injectStyles();
        floatingBtn = document.createElement('button');
        floatingBtn.className = 'vp-floating-btn';
        floatingBtn.innerHTML = '✨';
        floatingBtn.style.display = 'none';
        document.body.appendChild(floatingBtn);
        floatingBtn.onclick = () => {
            const data = getSelectionData();
            if (data) callAI(data.text, data);
            else alert('Selecione um texto ou clique em um campo preenchido.');
        };
        document.addEventListener('focusin', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                lastFocusedField = e.target;
                floatingBtn.style.display = 'flex';
            }
        });
        document.addEventListener('mousedown', (e) => {
            if (!e.target.closest('.vp-floating-btn') && !e.target.closest('.vp-modal')) {
                setTimeout(() => { if (!window.getSelection().toString()) {
                    if (!document.activeElement || (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) floatingBtn.style.display = 'none';
                } }, 100);
            }
        });
        GM_registerMenuCommand('⚙️ Configurações', openSettings);
    }

    init();
})();
