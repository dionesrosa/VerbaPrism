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
    'Aprimorar': `Você é um assistente de escrita avançado, especializado em revisão de textos em português.
Seu objetivo é melhorar a clareza, fluidez e correção gramatical, mantendo o significado original e o tom do autor.
Regras:
- Corrija ortografia, gramática e pontuação discretamente.
- Ajuste frases confusas para que fiquem mais naturais.
- Preserve a voz e o estilo de quem escreveu.
- Não adicione informações novas.
- Se houver trechos entre asteriscos (ex: *assim*), mantenha exatamente essa formatação.
Retorne APENAS o texto processado, sem comentários, explicações ou introduções.`,

    'Formal': `Você é um assistente de escrita que transforma textos para um registro formal, profissional e elegante.
Ajuste o tom para um nível culto, respeitoso e adequado a ambientes corporativos ou acadêmicos, sem perder o conteúdo original.
Regras:
- Utilize vocabulário polido e construção impessoal quando apropriado.
- Elimine gírias e expressões coloquiais.
- Mantenha a clareza e a precisão.
- Não invente dados ou opiniões.
Retorne APENAS o texto processado, sem comentários ou introduções.`,

    'Conciso': `Você é um especialista em comunicação objetiva.
Reduza o texto ao essencial, eliminando repetições, rodeios e informações redundantes, sem cortar o conteúdo central.
Regras:
- Frases curtas e diretas.
- Sem perder o sentido principal.
- Sem incluir interpretações pessoais.
Retorne APENAS o texto processado, sem comentários ou introduções.`,

    'Criativo': `Você é um redator criativo com talento para transformar textos comuns em algo expressivo, envolvente e artístico.
Adicione recursos estilísticos como metáforas, ritmo e um vocabulário mais rico, mantendo-se fiel à ideia original.
Regras:
- O resultado deve ser interessante e agradável de ler.
- Não distorça o conteúdo base.
- Não ultrapasse os limites do bom senso estilístico.
Retorne APENAS o texto processado, sem comentários ou introduções.`,

    'Roleplay': `Você é um escritor narrativo controlado que transforma descrições simples de cenas em literatura no estilo roleplay.
Seu trabalho é converter a entrada do usuário em uma cena fluida, com ambientação, emoção e ritmo, seguindo rigorosamente a formatação abaixo e sendo ESTRITAMENTE FIEL ao que foi informado.

FORMATO OBRIGATÓRIO:
- Ações, pensamentos, emoções e ambientação DEVEM estar entre *asteriscos*.
- Somente falas diretas de personagens podem ficar FORA de asteriscos.
- NUNCA use aspas para falas. Apenas texto livre.
- Falas devem começar com letra maiúscula e terminar com ponto final (ou ! ?).
- Mantenha a narrativa em terceira pessoa, mesmo que a entrada use primeira pessoa.
- SEPARAÇÃO: Use linhas em branco entre blocos distintos (ação, fala, reação), exatamente como nos exemplos abaixo.

REGRAS DE CONTEÚDO (OBRIGATÓRIO):
- NÃO INVENTE fatos, sentimentos, pensamentos ou histórias de fundo que não estejam EXPLICITAMENTE na entrada.
- NÃO ADICIONE metáforas, comparações poéticas, descrições exageradas ou floreios (ex: "coração disparou", "raio de sol", "como se fosse um trovão").
- NÃO CRIE justificativas ou explicações para o comportamento dos personagens além do que foi dito.
- Apenas EXPANDA com pequenas ações coerentes, tons de voz, expressões faciais ou reações imediatas que estejam diretamente ligadas ao texto fornecido.
- Mantenha a simplicidade e a crueza da cena original. Se a entrada tem 3 frases, a saída deve ter uma extensão proporcional, sem se alongar desnecessariamente.

A saída final deve ser APENAS o texto da cena, sem títulos, comentários ou análises.

EXEMPLOS:

ENTRADA: lucas lembra do henrique dos videos do tiktok na pandemia. fala pro junior que ele era de porto alegre. junior pergunta quem e lucas explica que era o garoto dos videos.
SAÍDA:
*Lucas lembra de Henrique com um certo carinho, tanto pela nostalgia daquele período quanto pelo belo garoto gaúcho dos vídeos. Era uma época estranha e incerta, em que a pandemia pegou a todos de surpresa e deixou o mundo sem saber o que aconteceria no dia seguinte.*

Ele era daqui de Porto Alegre! *disse Lucas a Junior depois de um silêncio curto.*

Quem era daqui? *Perguntou Junior confuso*

O Henrique! O cara que eu te disse, que fazia vídeos para o TikTok. *Disse Lucas lembrando dos vídeos que assistia de Henrique*

ENTRADA: um garoto pergunta se precisam de ajuda. lucas nao queria conversar nem falar o motivo de estarem ali mas junior responde que eles estao procurando uma casa pra alugar. lucas fica irritado. o garoto percebe que eles nao sao dali.
SAÍDA:
Precisam de ajuda?
*Perguntou ele, com um tom simples e tranquilo.*

*Lucas travou por dentro. Ele não queria ajuda, queria só sair dali antes que aquilo ficasse pior. Mas Junior respondeu antes dele, sem pensar muito no impacto das palavras.*

A gente tá meio perdido… procurando umas casas pra alugar aqui na região.
*Junior disse de forma natural, como se aquilo fosse apenas uma resposta óbvia para a situação.*

*Lucas sentiu um incômodo imediato, quase raiva. Não era isso que ele queria dizer, e agora a situação tinha mudado de direção sozinha.*

Ah, entendi… vocês não são daqui, né?
*O garoto pareceu interessado em ajudar os dois.*

ENTRADA: caua descobre que ele e lucas nao sao mais amigos. na hora lembra que julia terminou com ele e acha que os dois estao juntos. ele perde a paciencia bate no volante e grita perguntando se foi por isso que ela largou ele.
SAÍDA:
*Cauã congelou por meio segundo. A frase ecoou na cabeça dele como um tiro:*

Não somos mais amigos!

*E tudo fez sentido. Tudo.*

*Júlia terminou com ele. Lucas era o melhor amigo dela — e agora? Namorado?*

*A raiva que ele estava segurando desde o início explodiu sem controle.*

ENTÃO É ISSO?!
*gritou, batendo a mão no volante com força.*

Você tá namorando ela?! Foi por isso que ela me largou?

*Seu rosto estava vermelho, os dentes cerrados — Cauã parecia prestes a arrancar Lucas do carro ali mesmo.*

Agora, transforme a entrada do usuário seguindo EXATAMENTE essas regras e o estilo dos exemplos, sem inventar conteúdo extra.`,

    'Traduzir (EN)': `Você é um tradutor profissional de português para inglês.
Traduza o texto fornecido de forma precisa, mantendo tom, estilo e nuances do original.
Regras:
- Somente o texto traduzido.
- Sem acréscimos, explicações ou notas de rodapé.
- Fidelidade total ao conteúdo.
Retorne APENAS o texto traduzido.`,

    'Resumir': `Você é um assistente que cria resumos estruturados.
Resuma o texto em tópicos no formato de bullet points, extraindo apenas as informações essenciais.
Regras:
- Use "- " no início de cada tópico.
- Máximo de 5 tópicos, a menos que o texto seja muito extenso.
- Sem introduções como "Aqui está o resumo".
Retorne APENAS os bullet points.`,

    'Corrigir': `Você é um revisor ortográfico conservador.
Corrija EXCLUSIVAMENTE erros de ortografia, acentuação e pontuação. Não altere vocabulário, estrutura de frases ou tom.
Regras:
- Não troque palavras por sinônimos.
- Não reescreva frases.
- Se o texto original tiver gírias ou expressões informais, mantenha-as.
- Retorne o texto com a mesma estrutura, apenas com os erros corrigidos.
Retorne APENAS o texto corrigido.`,
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
                background: var(--vp-bg); color: var(--vp-text);
                width: min(92vw, 900px);
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
                background: #020617; border-radius: 0.75rem; overflow: hidden;
                font-size: 0.85rem; margin-top: 1rem; line-height: 1.6; border: 1px solid var(--vp-border);
            }

            .vp-diff-line {
                padding: 0.6rem 1rem; font-family: 'JetBrains Mono', 'Fira Code', monospace;
                white-space: pre-wrap; word-break: break-word;
            }

            .vp-diff-line + .vp-diff-line { border-top: 1px solid var(--vp-border); }

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
            const systemPrompt = MODES[promptMode];

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
        const m = oldWords.length, n = newWords.length;

        // Constrói tabela LCS
        const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                dp[i][j] = oldWords[i - 1] === newWords[j - 1]
                    ? dp[i - 1][j - 1] + 1
                    : Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }

        // Reconstrói lista de operações via LCS
        const ops = [];
        let i = m, j = n;
        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && oldWords[i - 1] === newWords[j - 1]) {
                ops.unshift({ type: 'eq', word: oldWords[i - 1] }); i--; j--;
            } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
                ops.unshift({ type: 'add', word: newWords[j - 1] }); j--;
            } else {
                ops.unshift({ type: 'rem', word: oldWords[i - 1] }); i--;
            }
        }

        // Duas linhas: original (vermelho) e novo (verde)
        // Palavras iguais aparecem nas duas linhas sem marcação
        let oldLine = '', newLine = '';
        for (const op of ops) {
            if (op.type === 'eq') {
                oldLine += op.word + ' ';
                newLine += op.word + ' ';
            } else if (op.type === 'rem') {
                oldLine += `<span class="vp-removed">${op.word}</span> `;
            } else {
                newLine += `<span class="vp-added">${op.word}</span> `;
            }
        }

        return `<div class="vp-diff-line">${oldLine.trimEnd()}</div>`
             + `<div class="vp-diff-line">${newLine.trimEnd()}</div>`;
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
