// ==UserScript==
// @name         Verba Prism
// @namespace    https://github.com/dionesrosa
// @version      0.6.4
// @description  Aprimora texto com IA em qualquer site. Selecione um texto e melhore com um clique.
// @author       Diones Souza
// @icon         data:image/png;base64,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
// @homepageURL  https://github.com/dionesrosa/VerbaPrism
// @supportURL   https://github.com/dionesrosa/VerbaPrism/issues
// @updateURL    https://raw.githubusercontent.com/dionesrosa/VerbaPrism/main/dist/verba-prism.user.js
// @downloadURL  https://raw.githubusercontent.com/dionesrosa/VerbaPrism/main/dist/verba-prism.user.js
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @connect      api.groq.com
// @connect      api.openai.com
// @connect      generativelanguage.googleapis.com
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    if (window.top !== window.self) return;
    
    // ============================================
    // CONSTANTES
    // ============================================
    const MODAL_Z = 2147483647;
    
    const PROVIDERS = {
        groq:   { name: 'Groq',          apiUrl: 'https://api.groq.com/openai/v1/chat/completions',                              defaultModel: 'llama-3.3-70b-versatile' },
        openai: { name: 'OpenAI',         apiUrl: 'https://api.openai.com/v1/chat/completions',                                   defaultModel: 'gpt-4o-mini' },
        gemini: { name: 'Gemini',         apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent', defaultModel: 'gemini-1.5-flash' },
    };
    
    const GROQ_MODELS   = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'llama-3.1-70b-versatile', 'mixtral-8x7b-32768', 'gemma2-9b-it'];
    const OPENAI_MODELS = ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1-mini', 'gpt-4.1'];
    const GEMINI_MODELS = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash'];
    
    // ============================================
    // MODOS DE PROCESSAMENTO
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
    
    // ============================================
    // ESTADO GLOBAL
    // ============================================
    let currentProvider  = GM_getValue('provider', 'groq');
    let apiKeys          = GM_getValue('apiKeys', { groq: '', openai: '', gemini: '' });
    let selectedModels   = GM_getValue('selectedModels', { groq: 'llama-3.3-70b-versatile', openai: 'gpt-4o-mini', gemini: 'gemini-1.5-flash' });
    let promptMode       = GM_getValue('promptMode', 'Aprimorar');
    
    // Captura de seleção — atualizada continuamente
    let lastSelection   = { text: '', range: null, element: null };
    // Snapshot congelado no momento em que o modal é aberto — usado para substituição
    let frozenSelection = { text: '', range: null, element: null };
    
    // ============================================
    // ESTILOS
    // ============================================
    function injectStyles() {
        if (document.getElementById('vp-styles')) return;
        const css = `
        :root {
            --vp-bg: #0d0a10;
            --vp-bg2: #16111c;
            --vp-surface: #1c1626;
            --vp-border: #2a2233;
            --vp-text: #f3eef7;
            --vp-muted: #a89bb5;
            --vp-pink: #ff2d87;
            --vp-pink-soft: rgba(255,45,135,0.15);
            --vp-shadow: 0 20px 60px rgba(255,45,135,0.25), 0 8px 24px rgba(0,0,0,0.5);
        }
    
        /* ── Toolbar Pill ── */
        .vp-toolbar-wrapper {
            position: fixed;
            bottom: 14px;
            right: 0;
            z-index: ${MODAL_Z - 1};
            user-select: none;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .vp-pill {
            background: rgba(0,0,0,0.55);
            backdrop-filter: blur(14px) saturate(1.4) brightness(1.1);
            -webkit-backdrop-filter: blur(14px) saturate(1.4) brightness(1.1);
            border-radius: 20px 0 0 20px;
            box-shadow:
                0 4px 4px -2px rgba(0,0,0,0.06),
                0 0 0 0.5px rgba(0,0,0,0.75),
                inset 0 0.5px 0 rgba(255,255,255,0.13),
                inset 0 -0.5px 0 rgba(255,255,255,0.05),
                inset 0 0 0 0.5px rgba(255,255,255,0.17);
            height: 42px;
            width: 42px;
            overflow: hidden;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            position: relative;
            transition: width 280ms cubic-bezier(.4,0,.2,1),
                        border-radius 280ms cubic-bezier(.4,0,.2,1);
            cursor: pointer;
        }
        .vp-pill::before {
            content: '';
            pointer-events: none;
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%);
        }
        .vp-pill.is-open {
            width: max-content;
            cursor: default;
        }
        .vp-pill-icon-closed {
            position: absolute;
            right: 0; top: 0;
            width: 42px; height: 42px;
            display: flex; align-items: center; justify-content: center;
            pointer-events: none;
            transition: opacity 150ms;
            color: var(--vp-pink);
        }
        .vp-pill.is-open .vp-pill-icon-closed { opacity: 0; }
        .vp-pill-content {
            display: flex;
            align-items: center;
            padding: 5px;
            gap: 2px;
            opacity: 0;
            pointer-events: none;
            transition: opacity 150ms ease 80ms;
            white-space: nowrap;
            min-width: max-content;
        }
        .vp-pill.is-open .vp-pill-content {
            opacity: 1;
            pointer-events: auto;
        }
        .vp-tbtn {
            flex-shrink: 0;
            display: flex; align-items: center; justify-content: center;
            width: 32px; height: 32px;
            border-radius: 50%;
            border: none; background: transparent;
            cursor: pointer; color: #fff;
            outline: none;
            transition: background 150ms, transform 100ms, color 150ms;
            position: relative;
        }
        .vp-tbtn:hover { background: rgba(255,255,255,0.12); }
        .vp-tbtn.is-active { background: rgba(255,45,135,0.35); color: var(--vp-pink); }
        .vp-tbtn:active { transform: scale(0.93); }
        .vp-tbtn:focus-visible { box-shadow: 0 0 0 2px var(--vp-pink) inset; }
        .vp-tbtn svg { width: 19px; height: 19px; pointer-events: none; flex-shrink: 0; }
        .vp-tbtn-primary { color: var(--vp-pink); }
        .vp-tbtn-primary:hover { background: rgba(255,45,135,0.2); }
        .vp-pill-sep {
            width: 1px; height: 22px;
            background: rgba(255,255,255,0.16);
            flex-shrink: 0; margin: 0 2px;
        }
        /* Dropdown da toolbar */
        .vp-tbmenu {
            position: fixed;
            flex-direction: column;
            background: rgba(16,12,22,0.97);
            backdrop-filter: blur(16px);
            border: 0.5px solid rgba(255,255,255,0.15);
            border-radius: 12px;
            padding: 4px;
            min-width: 190px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.55);
            z-index: ${MODAL_Z};
            display: none;
        }
        .vp-tbmenu.is-open { display: flex; }
        .vp-tbmenu::after {
            content: '';
            position: absolute;
            bottom: -6px; right: 14px;
            width: 12px; height: 12px;
            background: rgba(16,12,22,0.97);
            border-right: 0.5px solid rgba(255,255,255,0.15);
            border-bottom: 0.5px solid rgba(255,255,255,0.15);
            transform: rotate(45deg);
            z-index: -1;
        }
        .vp-tbmenu-item {
            background: none; border: none;
            color: rgba(255,255,255,0.88);
            font-size: 13px; padding: 8px 12px;
            border-radius: 8px; cursor: pointer;
            text-align: left;
            transition: background 120ms;
            font-family: inherit;
            display: flex; align-items: center; gap: 10px;
            width: 100%;
        }
        .vp-tbmenu-item:hover { background: rgba(255,255,255,0.10); color: #fff; }
        .vp-tbmenu-sep {
            height: 1px;
            background: rgba(255,255,255,0.10);
            margin: 3px 8px;
        }
        /* Badge de modo */
        .vp-mode-badge {
            font-size: 10px; font-weight: 700;
            color: var(--vp-pink); letter-spacing: .3px;
            line-height: 1; padding: 0 2px;
            max-width: 52px; overflow: hidden;
            text-overflow: ellipsis; white-space: nowrap;
        }
    
        /* Overlay */
        .vp-overlay {
            position: fixed; inset: 0; z-index: ${MODAL_Z};
            background: rgba(8,5,12,0.75); backdrop-filter: blur(6px);
            display: flex; align-items: center; justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: var(--vp-text);
        }
    
        /* Modal */
        .vp-modal {
            width: min(680px, 92vw); max-height: 88vh;
            background: linear-gradient(180deg, var(--vp-bg2), var(--vp-bg));
            border: 1px solid var(--vp-border); border-radius: 16px;
            box-shadow: var(--vp-shadow);
            display: flex; flex-direction: column; overflow: hidden;
        }
    
        /* Header */
        .vp-header {
            display: flex; align-items: center; gap: 10px; flex-shrink: 0;
            padding: 14px 18px; border-bottom: 1px solid var(--vp-border);
            background: linear-gradient(90deg, rgba(255,45,135,0.12), transparent);
        }
        .vp-logo {
            width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0;
            background: linear-gradient(135deg, var(--vp-pink), #7a1346);
            display: flex; align-items: center; justify-content: center;
            color: #fff; font-weight: 800; font-size: 13px;
        }
        .vp-title { font-size: 15px; font-weight: 700; letter-spacing: .2px; }
        .vp-title span { color: var(--vp-pink); }
        .vp-sub { color: var(--vp-muted); font-size: 12px; margin-left: auto; }
        .vp-close {
            margin-left: 12px; cursor: pointer; color: var(--vp-muted);
            background: transparent; border: 0; font-size: 20px; line-height: 1;
            padding: 0;
        }
        .vp-close:hover { color: var(--vp-pink); }
    
        /* Body */
        .vp-body { padding: 16px 18px; overflow-y: auto; flex: 1; min-height: 0; }
        .vp-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }
        .vp-field { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 140px; }
        .vp-label { font-size: 11px; color: var(--vp-muted); text-transform: uppercase; letter-spacing: .8px; }
    
        /* Inputs */
        .vp-input, .vp-select, .vp-textarea {
            background: var(--vp-surface); color: var(--vp-text);
            border: 1px solid var(--vp-border); border-radius: 8px;
            padding: 9px 11px; font-size: 13px; outline: none; width: 100%;
            transition: border-color .15s, box-shadow .15s; font-family: inherit;
            box-sizing: border-box;
        }
        .vp-input:focus, .vp-select:focus, .vp-textarea:focus {
            border-color: var(--vp-pink); box-shadow: 0 0 0 3px var(--vp-pink-soft);
        }
        .vp-textarea { min-height: 130px; max-height: 260px; resize: vertical; line-height: 1.6; }
        .vp-textarea.result { background: #120e18; border-color: rgba(255,45,135,0.35); }
    
        /* Actions bar */
        .vp-actions {
            display: flex; gap: 8px; padding: 14px 18px; flex-wrap: wrap; flex-shrink: 0;
            border-top: 1px solid var(--vp-border); background: var(--vp-bg2);
        }
        .vp-spacer { flex: 1; }
    
        /* Buttons */
        .vp-btn {
            border: 1px solid var(--vp-border); background: var(--vp-surface);
            color: var(--vp-text); padding: 9px 14px; border-radius: 8px; cursor: pointer;
            font-size: 13px; font-weight: 600; transition: all .15s; font-family: inherit;
        }
        .vp-btn:hover { border-color: var(--vp-pink); color: var(--vp-pink); }
        .vp-btn.primary {
            background: linear-gradient(135deg, var(--vp-pink), #b71d62);
            border-color: transparent; color: #fff;
        }
        .vp-btn.primary:hover { filter: brightness(1.1); color: #fff; }
        .vp-btn:disabled { opacity: .5; cursor: not-allowed; }
    
        /* Tabs */
        .vp-tabs {
            display: flex; gap: 4px; background: var(--vp-surface); padding: 4px;
            border-radius: 10px; border: 1px solid var(--vp-border); margin-bottom: 14px;
        }
        .vp-tab {
            flex: 1; text-align: center; padding: 7px 10px; border-radius: 7px;
            cursor: pointer; font-size: 12px; color: var(--vp-muted); font-weight: 600;
            transition: all .15s;
        }
        .vp-tab.active { background: linear-gradient(135deg, var(--vp-pink), #b71d62); color: #fff; }
    
        /* Provider tabs (settings) */
        .vp-provider-tabs {
            display: flex; gap: 4px; margin-bottom: 16px;
        }
        .vp-provider-tab {
            flex: 1; text-align: center; padding: 8px; border-radius: 8px; cursor: pointer;
            font-size: 12px; font-weight: 700; color: var(--vp-muted);
            border: 1px solid var(--vp-border); background: var(--vp-surface);
            transition: all .15s; text-transform: uppercase; letter-spacing: .5px;
        }
        .vp-provider-tab.active { border-color: var(--vp-pink); color: var(--vp-pink); background: var(--vp-pink-soft); }
    
        /* Toast */
        .vp-toast {
            position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
            background: var(--vp-surface); border: 1px solid var(--vp-pink);
            color: var(--vp-text); padding: 10px 16px; border-radius: 10px;
            box-shadow: var(--vp-shadow); z-index: ${MODAL_Z}; font-size: 13px;
            font-family: system-ui, sans-serif; white-space: nowrap;
        }
    
        /* Loader */
        .vp-loader {
            width: 14px; height: 14px; border-radius: 50%;
            border: 2px solid rgba(255,255,255,0.25); border-top-color: #fff;
            display: inline-block; animation: vp-spin .8s linear infinite;
            vertical-align: -2px; margin-right: 6px;
        }
        @keyframes vp-spin { to { transform: rotate(360deg); } }
    
        /* Diff */
        .vp-diff-box {
            background: #0a0712; border-radius: 8px; overflow: hidden;
            font-size: 12px; margin-top: 12px; line-height: 1.6;
            border: 1px solid var(--vp-border);
        }
        .vp-diff-line {
            padding: 8px 12px; font-family: 'JetBrains Mono', 'Fira Code', monospace;
            white-space: pre-wrap; word-break: break-word;
        }
        .vp-diff-line + .vp-diff-line { border-top: 1px solid var(--vp-border); }
        .vp-removed { color: #ef4444; text-decoration: line-through; background: rgba(239,68,68,0.15); padding: 0 2px; border-radius: 2px; }
        .vp-added  { color: #10b981; background: rgba(16,185,129,0.15); padding: 0 2px; border-radius: 2px; font-weight: 600; }
    
        hr.vp-sep { border: 0; border-top: 1px solid var(--vp-border); margin: 14px 0; }
        `;
        const s = document.createElement('style');
        s.id = 'vp-styles';
        s.textContent = css;
        document.documentElement.appendChild(s);
    }
    
    // ============================================
    // HELPERS DE DOM
    // ============================================
    function el(tag, attrs = {}, ...children) {
        const e = document.createElement(tag);
        for (const [k, v] of Object.entries(attrs)) {
            if (k === 'class') e.className = v;
            else if (k === 'style') e.setAttribute('style', v);
            else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
            else e.setAttribute(k, v);
        }
        for (const c of children) {
            if (c == null) continue;
            e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
        }
        return e;
    }
    
    function toast(msg) {
        document.querySelectorAll('.vp-toast').forEach(t => t.remove());
        const t = document.createElement('div');
        t.className = 'vp-toast';
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 2400);
    }
    
    function closeOverlay() {
        document.querySelectorAll('.vp-overlay').forEach(n => n.remove());
    }
    
    function makeOverlay(modalEl) {
        const overlay = el('div', { class: 'vp-overlay' });
        overlay.appendChild(modalEl);
        overlay.addEventListener('click', e => { if (e.target === overlay) closeOverlay(); });
        document.body.appendChild(overlay);
        return overlay;
    }
    
    function makeHeader(subtitle) {
        return el('div', { class: 'vp-header' },
            el('div', { class: 'vp-logo' }, 'V'),
            el('div', { class: 'vp-title' }, 'Verba ', el('span', {}, 'Prism')),
            el('div', { class: 'vp-sub' }, subtitle),
            el('button', { class: 'vp-close', onclick: closeOverlay }, '×'),
        );
    }
    
    // ============================================
    // CAPTURA DE SELEÇÃO (contínua)
    // ============================================
    function captureSelection() {
        const sel = window.getSelection();
        if (sel && sel.toString().trim().length > 0) {
            lastSelection.text = sel.toString();
            try { lastSelection.range = sel.getRangeAt(0).cloneRange(); } catch (e) { lastSelection.range = null; }
            lastSelection.element = null;
        } else {
            const ae = document.activeElement;
            if (!ae || ae.closest('.vp-overlay')) return;
            // Textarea / input nativo
            if (ae.tagName === 'TEXTAREA' || (ae.tagName === 'INPUT' && /^(text|search|url|email|password|tel|number)$/i.test(ae.type || 'text'))) {
                const start = ae.selectionStart, end = ae.selectionEnd;
                if (start !== end) {
                    lastSelection.text = ae.value.substring(start, end);
                    lastSelection.element = { node: ae, start, end };
                    lastSelection.range = null;
                    return;
                }
                if (ae.value.trim()) {
                    lastSelection.text = ae.value;
                    lastSelection.element = { node: ae, start: 0, end: ae.value.length };
                    lastSelection.range = null;
                    return;
                }
            }
            // contenteditable
            if (ae.isContentEditable || ae.getAttribute('contenteditable') !== null) {
                const text = ae.innerText.trim();
                if (text) {
                    lastSelection.text = text;
                    lastSelection.element = { node: ae, start: 0, end: text.length, contenteditable: true };
                    lastSelection.range = null;
                    return;
                }
            }
        }
    }
    
    document.addEventListener('selectionchange', captureSelection, true);
    document.addEventListener('mouseup',         captureSelection, true);
    document.addEventListener('keyup',           captureSelection, true);
    document.addEventListener('focusin',         captureSelection, true);
    
    // ============================================
    // SUBSTITUIÇÃO DE TEXTO
    // ============================================
    function replaceSelection(newText) {
        if (frozenSelection.element) {
            const { node, contenteditable } = frozenSelection.element;
    
            // contenteditable (ex: character.ai, Google Docs)
            if (contenteditable) {
                node.focus();
                const range = document.createRange();
                range.selectNodeContents(node);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                sel.deleteFromDocument();
                // Insere o texto como nó de texto dentro do elemento
                const textNode = document.createTextNode(newText);
                range.insertNode(textNode);
                // Move o cursor para o final
                range.setStartAfter(textNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                node.dispatchEvent(new Event('input', { bubbles: true }));
                return true;
            }
    
            // textarea / input nativo
            const { start, end } = frozenSelection.element;
            const newValue = node.value.substring(0, start) + newText + node.value.substring(end);
    
            // Usa o setter nativo do React para que o estado interno seja atualizado
            const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set
                                || Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,    'value')?.set;
            if (nativeSetter) {
                nativeSetter.call(node, newValue);
            } else {
                node.value = newValue;
            }
    
            node.dispatchEvent(new Event('input',  { bubbles: true }));
            node.dispatchEvent(new Event('change', { bubbles: true }));
            try { node.focus(); node.setSelectionRange(start, start + newText.length); } catch (e) {}
            return true;
        }
        if (frozenSelection.range) {
            try {
                const r = frozenSelection.range;
                r.deleteContents();
                r.insertNode(document.createTextNode(newText));
                return true;
            } catch (e) { return false; }
        }
        return false;
    }
    
    // ============================================
    // LÓGICA DE API
    // ============================================
    function request(method, url, headers, data) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({ method, url, headers, data, onload: resolve, onerror: reject, ontimeout: reject });
        });
    }
    
    async function callAI(text, onResult) {
        const provider = PROVIDERS[currentProvider];
        const key = apiKeys[currentProvider];
        const model = selectedModels[currentProvider];
    
        if (!key) {
            toast('Configure sua chave de API primeiro.');
            openSettings();
            return;
        }
    
        try {
            let responseText = '';
            const systemPrompt = MODES[promptMode];
    
            if (currentProvider === 'gemini') {
                const url = provider.apiUrl.replace('{model}', model) + `?key=${key}`;
                const payload = { contents: [{ parts: [{ text: `${systemPrompt}\n\nTexto: ${text}` }] }], generationConfig: { temperature: 0.7 } };
                const res  = await request('POST', url, { 'Content-Type': 'application/json' }, JSON.stringify(payload));
                const data = JSON.parse(res.responseText);
                if (data.error) throw new Error(data.error.message);
                responseText = data.candidates[0].content.parts[0].text;
            } else {
                const payload = { model, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: text }], temperature: 0.7 };
                const res  = await request('POST', provider.apiUrl, { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` }, JSON.stringify(payload));
                const data = JSON.parse(res.responseText);
                if (data.error) throw new Error(data.error.message);
                responseText = data.choices[0].message.content;
            }
    
            onResult(responseText.trim());
        } catch (err) {
            toast(`Erro: ${err.message || 'Falha na conexão'}`);
            throw err;
        }
    }
    
    // ============================================
    // DIFF
    // ============================================
    function generateDiff(oldText, newText) {
        const oldWords = oldText.split(/\s+/);
        const newWords = newText.split(/\s+/);
        const m = oldWords.length, n = newWords.length;
        const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
        for (let i = 1; i <= m; i++)
            for (let j = 1; j <= n; j++)
                dp[i][j] = oldWords[i-1] === newWords[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);
        const ops = [];
        let i = m, j = n;
        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && oldWords[i-1] === newWords[j-1]) { ops.unshift({ type: 'eq',  word: oldWords[i-1] }); i--; j--; }
            else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) { ops.unshift({ type: 'add', word: newWords[j-1] }); j--; }
            else { ops.unshift({ type: 'rem', word: oldWords[i-1] }); i--; }
        }
        let oldLine = '', newLine = '';
        for (const op of ops) {
            if      (op.type === 'eq')  { oldLine += op.word + ' '; newLine += op.word + ' '; }
            else if (op.type === 'rem') { oldLine += `<span class="vp-removed">${op.word}</span> `; }
            else                        { newLine += `<span class="vp-added">${op.word}</span> `; }
        }
        return `<div class="vp-diff-line">${oldLine.trimEnd()}</div><div class="vp-diff-line">${newLine.trimEnd()}</div>`;
    }
    
    // ============================================
    // MODAL DE RESULTADO
    // ============================================
    function openResult(originalText, resultText) {
        injectStyles();
        closeOverlay();
    
        const modeKeys = Object.keys(MODES);
        const tabs = el('div', { class: 'vp-tabs' });
        const tabEls = {};
        let activeMode = promptMode;
    
        modeKeys.forEach(m => {
            const t = el('div', { class: 'vp-tab' + (m === activeMode ? ' active' : '') }, m);
            t.addEventListener('click', () => {
                activeMode = m;
                promptMode = m;
                updateModeBadge();
                Object.values(tabEls).forEach(x => x.classList.remove('active'));
                t.classList.add('active');
            });
            tabEls[m] = t;
            tabs.appendChild(t);
        });
    
        const inputArea  = el('textarea', { class: 'vp-textarea',         placeholder: 'Texto original…' });
        const resultArea = el('textarea', { class: 'vp-textarea result',  placeholder: 'Resultado aparecerá aqui…', readonly: 'true' });
        inputArea.value  = originalText || '';
        resultArea.value = resultText   || '';
    
        const diffBox = el('div', { class: 'vp-diff-box' });
        diffBox.style.display = 'none';
        if (originalText && resultText) {
            diffBox.innerHTML = generateDiff(originalText, resultText);
            diffBox.style.display = 'block';
        }
    
        const processBtn = el('button', { class: 'vp-btn primary' }, 'Processar');
        const copyBtn    = el('button', { class: 'vp-btn' }, 'Copiar');
        const replaceBtn = el('button', { class: 'vp-btn' }, 'Substituir na página');
        const settingsBtn = el('button', { class: 'vp-btn', onclick: openSettings }, '⚙ Configurações');
    
        copyBtn.disabled    = !resultText;
        replaceBtn.disabled = !resultText;
    
        processBtn.addEventListener('click', async () => {
            const text = inputArea.value.trim();
            if (!text) return toast('Digite ou selecione um texto.');
            processBtn.disabled = true;
            processBtn.innerHTML = '<span class="vp-loader"></span> Processando…';
            resultArea.value = '';
            diffBox.style.display = 'none';
            try {
                await callAI(text, out => {
                    resultArea.value = out;
                    copyBtn.disabled    = false;
                    replaceBtn.disabled = false;
                    if (text) {
                        diffBox.innerHTML = generateDiff(text, out);
                        diffBox.style.display = 'block';
                    }
                });
            } catch (e) { /* toast já exibido */ } finally {
                processBtn.disabled = false;
                processBtn.textContent = 'Processar';
            }
        });
    
        copyBtn.addEventListener('click', () => {
            const v = resultArea.value;
            if (!v) return;
            try { GM_setClipboard(v); } catch (e) { navigator.clipboard?.writeText(v); }
            toast('Copiado ✓');
        });
    
        replaceBtn.addEventListener('click', () => {
            const v = resultArea.value;
            if (!v) return;
            const ok = replaceSelection(v);
            if (ok) { toast('Texto substituído ✓'); closeOverlay(); }
            else    { toast('Não foi possível substituir. Use Copiar.'); }
        });
    
        const modal = el('div', { class: 'vp-modal' });
        modal.append(
            makeHeader(`${currentProvider} · ${selectedModels[currentProvider]}`),
            el('div', { class: 'vp-body' },
                tabs,
                el('div', { class: 'vp-label', style: 'margin-bottom:6px;' }, 'Texto original'),
                inputArea,
                el('div', { class: 'vp-label', style: 'margin:14px 0 6px;' }, 'Resultado'),
                resultArea,
                diffBox,
            ),
            el('div', { class: 'vp-actions' },
                settingsBtn,
                el('div', { class: 'vp-spacer' }),
                copyBtn,
                replaceBtn,
                processBtn,
            ),
        );
        makeOverlay(modal);
    
        if (inputArea.value.trim() && !resultText) {
            setTimeout(() => processBtn.click(), 150);
        }
    }
    
    // ============================================
    // MODAL DE CONFIGURAÇÕES
    // ============================================
    function openSettings() {
        injectStyles();
        closeOverlay();
    
        let activeTab = currentProvider;
    
        // --- Abas de provedor ---
        const providerTabsEl = el('div', { class: 'vp-provider-tabs' });
        const providerTabEls = {};
        const tabContents = {};
    
        ['groq', 'openai', 'gemini'].forEach(p => {
            const t = el('div', { class: 'vp-provider-tab' + (p === activeTab ? ' active' : '') }, PROVIDERS[p].name);
            t.addEventListener('click', () => {
                activeTab = p;
                Object.values(providerTabEls).forEach(x => x.classList.remove('active'));
                t.classList.add('active');
                Object.values(tabContents).forEach(x => x.style.display = 'none');
                tabContents[p].style.display = 'block';
            });
            providerTabEls[p] = t;
            providerTabsEl.appendChild(t);
        });
    
        // Conteúdo de cada aba de provedor
        const modelLists = { groq: GROQ_MODELS, openai: OPENAI_MODELS, gemini: GEMINI_MODELS };
    
        ['groq', 'openai', 'gemini'].forEach(p => {
            const keyInput = el('input', { class: 'vp-input', type: 'password', placeholder: 'Chave de API…', value: apiKeys[p] || '' });
            keyInput.addEventListener('input', e => { apiKeys[p] = e.target.value; });
    
            const modelInput = el('input', { class: 'vp-input', type: 'text', placeholder: PROVIDERS[p].defaultModel, value: selectedModels[p] || PROVIDERS[p].defaultModel });
            modelInput.addEventListener('input', e => { selectedModels[p] = e.target.value; });
    
            const modelList = el('select', { class: 'vp-select', style: 'margin-top:6px;' });
            modelLists[p].forEach(m => {
                const o = el('option', { value: m }, m);
                if (m === (selectedModels[p] || PROVIDERS[p].defaultModel)) o.selected = true;
                modelList.appendChild(o);
            });
            el('option', { value: '' }, 'Personalizado…');
            modelList.addEventListener('change', e => {
                if (e.target.value) { modelInput.value = e.target.value; selectedModels[p] = e.target.value; }
            });
    
            const div = el('div', {},
                el('div', { class: 'vp-field', style: 'margin-bottom:12px;' },
                    el('div', { class: 'vp-label' }, 'Chave de API'),
                    keyInput,
                ),
                el('div', { class: 'vp-field' },
                    el('div', { class: 'vp-label' }, 'Modelo'),
                    modelList,
                    modelInput,
                ),
            );
            div.style.display = p === activeTab ? 'block' : 'none';
            tabContents[p] = div;
        });
    
        // Provedor ativo
        const activeSel = el('select', { class: 'vp-select' });
        ['groq', 'openai', 'gemini'].forEach(p => {
            const o = el('option', { value: p }, PROVIDERS[p].name + (p === 'groq' ? ' (Recomendado)' : ''));
            if (p === currentProvider) o.selected = true;
            activeSel.appendChild(o);
        });
    
        // Modo padrão
        const modeSel = el('select', { class: 'vp-select' });
        Object.keys(MODES).forEach(m => {
            const o = el('option', { value: m }, m);
            if (m === promptMode) o.selected = true;
            modeSel.appendChild(o);
        });
    
        const modal = el('div', { class: 'vp-modal' });
        modal.append(
            makeHeader('Configurações'),
            el('div', { class: 'vp-body' },
                providerTabsEl,
                tabContents['groq'],
                tabContents['openai'],
                tabContents['gemini'],
                el('hr', { class: 'vp-sep' }),
                el('div', { class: 'vp-row' },
                    el('div', { class: 'vp-field' },
                        el('div', { class: 'vp-label' }, 'Provedor ativo'),
                        activeSel,
                    ),
                    el('div', { class: 'vp-field' },
                        el('div', { class: 'vp-label' }, 'Modo padrão'),
                        modeSel,
                    ),
                ),
                el('div', { style: 'margin-top:12px; font-size:12px; color:var(--vp-muted); line-height:1.5;' },
                    'Chave Groq gratuita em ', el('b', {}, 'console.groq.com/keys'), '. Configurações salvas localmente pelo Tampermonkey.',
                ),
            ),
            el('div', { class: 'vp-actions' },
                el('div', { class: 'vp-spacer' }),
                el('button', { class: 'vp-btn', onclick: closeOverlay }, 'Cancelar'),
                el('button', { class: 'vp-btn primary', onclick: () => {
                    currentProvider = activeSel.value;
                    promptMode      = modeSel.value;
                    GM_setValue('provider',       currentProvider);
                    GM_setValue('apiKeys',        apiKeys);
                    GM_setValue('selectedModels', selectedModels);
                    GM_setValue('promptMode',     promptMode);
                    updateModeBadge();
                    closeOverlay();
                    toast('Configurações salvas ✓');
                } }, 'Salvar'),
            ),
        );
        makeOverlay(modal);
    }
    
    // ============================================
    // TOOLBAR PILL
    // ============================================
    
    function isEditableInput(el) {
        if (!el) return false;
        if (el.tagName === 'TEXTAREA') return true;
        if (el.tagName === 'INPUT' && /^(text|search|url|email|password|tel|number)$/i.test(el.type || 'text')) return true;
        if (el.isContentEditable || el.getAttribute('contenteditable') === 'true' || el.getAttribute('contenteditable') === '') return true;
        return false;
    }
    
    let tbState = { isPinned: false, closeTimer: null, pill: null, menu: null, modeBadge: null };
    
    function freezeAndOpenEditor() {
        frozenSelection = { text: lastSelection.text, range: lastSelection.range, element: lastSelection.element };
        const text = frozenSelection.text || window.getSelection()?.toString() || '';
        openResult(text, '');
    }
    
    function tbOpenPill() {
        if (tbState.closeTimer) { clearTimeout(tbState.closeTimer); tbState.closeTimer = null; }
        tbState.pill.classList.add('is-open');
    }
    
    function tbClosePill() {
        if (tbState.isPinned) return;
        tbState.pill.classList.remove('is-open', 'is-pinned');
        tbCloseMenu();
    }
    
    function tbScheduleClose() {
        if (!tbState.isPinned)
            tbState.closeTimer = setTimeout(tbClosePill, 300);
    }
    
    function tbTogglePin(force) {
        tbState.isPinned = force !== undefined ? force : !tbState.isPinned;
        const pinBtn  = document.getElementById('vp-tbtn-pin');
        const iconPin = document.getElementById('vp-icon-pin');
        const iconX   = document.getElementById('vp-icon-close');
        if (tbState.isPinned) {
            tbState.pill.classList.add('is-pinned');
            pinBtn.classList.add('is-active');
            iconPin.style.display = 'none';
            iconX.style.display   = 'block';
            pinBtn.title = 'Recolher barra';
            tbOpenPill();
        } else {
            tbState.pill.classList.remove('is-pinned');
            pinBtn.classList.remove('is-active');
            iconPin.style.display = 'block';
            iconX.style.display   = 'none';
            pinBtn.title = 'Fixar barra';
            tbClosePill();
        }
    }
    
    function tbCloseMenu() {
        if (tbState.menu) tbState.menu.classList.remove('is-open');
    }
    
    function tbToggleMenu() {
        if (!tbState.menu) return;
        const isOpen = tbState.menu.classList.contains('is-open');
        tbCloseMenu();
        if (!isOpen) {
            const optBtn = document.getElementById('vp-tbtn-opts');
            const rect   = optBtn.getBoundingClientRect();
            tbState.menu.style.right  = `${window.innerWidth - rect.right - rect.width / 4}px`;
            tbState.menu.style.bottom = `${window.innerHeight - rect.top + 8}px`;
            tbState.menu.classList.add('is-open');
            tbTogglePin(true);
        }
    }
    
    function updateModeBadge() {
        if (tbState.modeBadge) tbState.modeBadge.textContent = promptMode;
    }
    
    function buildToolbar() {
        injectStyles();
        if (document.getElementById('vp-toolbar-wrapper')) return;
    
        // ── Dropdown menu ──
        const menu = document.createElement('div');
        menu.id = 'vp-tbmenu';
        menu.className = 'vp-tbmenu';
        const menuItems = [
            { icon: '✨', label: 'Aprimorar seleção', action: () => { tbCloseMenu(); freezeAndOpenEditor(); } },
            { icon: '⚙', label: 'Configurações',      action: () => { tbCloseMenu(); openSettings(); } },
            { sep: true },
            { icon: '↺', label: 'Resetar fixação',    action: () => { tbCloseMenu(); tbTogglePin(false); } },
            { icon: '✕', label: 'Fechar barra',        action: () => { tbCloseMenu(); tbTogglePin(false); tbState.pill.classList.remove('is-open'); } },
        ];
        menuItems.forEach(item => {
            if (item.sep) {
                const sep = document.createElement('div');
                sep.className = 'vp-tbmenu-sep';
                menu.appendChild(sep);
                return;
            }
            const btn = document.createElement('button');
            btn.className = 'vp-tbmenu-item';
            btn.innerHTML = `<span>${item.icon}</span>${item.label}`;
            btn.addEventListener('click', e => { e.stopPropagation(); item.action(); });
            menu.appendChild(btn);
        });
        document.documentElement.appendChild(menu);
        tbState.menu = menu;
    
        // ── Wrapper ──
        const wrapper = document.createElement('div');
        wrapper.id = 'vp-toolbar-wrapper';
        wrapper.className = 'vp-toolbar-wrapper';
    
        // ── Pill ──
        const pill = document.createElement('div');
        pill.className = 'vp-pill';
        pill.title = 'Verba Prism';
        tbState.pill = pill;
    
        // ── Ícone fechado (diamante) ──
        const iconClosed = document.createElement('div');
        iconClosed.className = 'vp-pill-icon-closed';
        iconClosed.innerHTML = `<svg viewBox="0 0 422.324 422.324" fill="currentColor" width="20" height="20" aria-hidden="true"><path d="M420.657,139.528L350.385,23.729c-2.102-3.46-5.855-5.567-9.907-5.567H81.848c-4.044,0-7.795,2.107-9.901,5.567L1.675,139.528c-0.06,0.112-0.071,0.229-0.134,0.331c-0.47,0.839-0.851,1.737-1.103,2.684c-0.037,0.153-0.096,0.293-0.128,0.433C0.118,143.805,0,144.655,0,145.547c0,0.167,0.039,0.326,0.053,0.493c0.01,0.246,0.043,0.471,0.065,0.711c0.101,0.919,0.299,1.822,0.593,2.673c0.052,0.134,0.08,0.281,0.129,0.411c0.394,0.984,0.936,1.882,1.57,2.706c0.066,0.09,0.096,0.196,0.156,0.278l199.501,246.938l0.09,0.108c0.049,0.061,0.112,0.093,0.161,0.143c0.539,0.646,1.16,1.226,1.838,1.752c0.033,0.01,0.056,0.056,0.091,0.086c0.091,0.068,0.173,0.11,0.269,0.165c0.936,0.656,1.956,1.248,3.116,1.608c0.872,0.274,1.754,0.34,2.626,0.396c0.304,0.032,0.582,0.146,0.885,0.146c0.007,0,0.007,0,0.011,0l0,0l0,0c0.068,0,0.124-0.033,0.187-0.033c1.018-0.02,2.004-0.179,2.956-0.459c0.124-0.032,0.252-0.022,0.381-0.069c0.013,0,0.022,0,0.032-0.014c0.015,0,0.015-0.01,0.036-0.01c0.265-0.11,0.517-0.229,0.777-0.346c0.311-0.115,0.612-0.246,0.908-0.388c0.36-0.187,0.7-0.416,1.032-0.645c0.224-0.139,0.453-0.275,0.667-0.434c0.111-0.083,0.225-0.135,0.331-0.229c0.514-0.438,0.984-0.909,1.423-1.413c0.076-0.104,0.196-0.164,0.275-0.276l0.099-0.101l199.49-246.943C422.818,149.022,423.172,143.709,420.657,139.528z M236.141,41.32l37.049,92.635H149.141l37.052-92.635H236.141z M88.37,41.32h72.876l-37.052,92.635H32.146L88.37,41.32z M35.823,157.118h87.76l57.654,179.991L35.823,157.118z M211.163,354.618l-63.262-197.5h126.521L211.163,354.618z M241.096,337.118l57.644-180h87.758L241.096,337.118z M298.133,133.96L261.08,41.325h72.876l56.22,92.635H298.133z"/></svg>`;
        pill.appendChild(iconClosed);
    
        // ── Conteúdo expandido ──
        const content = document.createElement('nav');
        content.className = 'vp-pill-content';
        content.setAttribute('aria-label', 'Verba Prism');
    
        // Botão principal — aprimorar texto
        const btnMain = document.createElement('button');
        btnMain.className = 'vp-tbtn vp-tbtn-primary';
        btnMain.title = 'Aprimorar texto selecionado (Ctrl+Shift+L)';
        btnMain.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2 L14.5 9 L22 12 L14.5 15 L12 22 L9.5 15 L2 12 L9.5 9 Z"/></svg>`;
        btnMain.addEventListener('mousedown', e => {
            e.preventDefault(); e.stopPropagation();
            frozenSelection = { text: lastSelection.text, range: lastSelection.range, element: lastSelection.element };
        });
        btnMain.addEventListener('click', e => { e.stopPropagation(); freezeAndOpenEditor(); });
    
        // Badge do modo atual
        const modeBadge = document.createElement('div');
        modeBadge.className = 'vp-mode-badge';
        modeBadge.title = 'Modo ativo — clique para configurar';
        modeBadge.textContent = promptMode;
        modeBadge.style.cursor = 'pointer';
        modeBadge.addEventListener('click', e => { e.stopPropagation(); openSettings(); });
        tbState.modeBadge = modeBadge;
    
        // Separador
        const sep1 = document.createElement('div');
        sep1.className = 'vp-pill-sep';
    
        // Botão configurações
        const btnSettings = document.createElement('button');
        btnSettings.className = 'vp-tbtn';
        btnSettings.title = 'Configurações';
        btnSettings.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 8.5A3.5 3.5 0 1 0 12 15.5A3.5 3.5 0 0 0 12 8.5ZM10 12A2 2 0 1 1 14 12A2 2 0 0 1 10 12ZM13.447 3.106a1.5 1.5 0 0 0-2.894 0l-.25.965a.75.75 0 0 1-.981.51l-.924-.374a1.5 1.5 0 0 0-1.895 1.895l.374.924a.75.75 0 0 1-.51.981l-.965.25a1.5 1.5 0 0 0 0 2.894l.965.25a.75.75 0 0 1 .51.981l-.374.924a1.5 1.5 0 0 0 1.895 1.895l.924-.374a.75.75 0 0 1 .981.51l.25.965a1.5 1.5 0 0 0 2.894 0l.25-.965a.75.75 0 0 1 .981-.51l.924.374a1.5 1.5 0 0 0 1.895-1.895l-.374-.924a.75.75 0 0 1 .51-.981l.965-.25a1.5 1.5 0 0 0 0-2.894l-.965-.25a.75.75 0 0 1-.51-.981l.374-.924a1.5 1.5 0 0 0-1.895-1.895l-.924.374a.75.75 0 0 1-.981-.51l-.25-.965Z"/></svg>`;
        btnSettings.addEventListener('click', e => { e.stopPropagation(); openSettings(); });
    
        // Botão opções (três pontos)
        const btnOpts = document.createElement('button');
        btnOpts.className = 'vp-tbtn';
        btnOpts.id = 'vp-tbtn-opts';
        btnOpts.title = 'Mais opções';
        btnOpts.setAttribute('aria-haspopup', 'true');
        btnOpts.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.75 12C6.75 12.9665 5.9665 13.75 5 13.75C4.0335 13.75 3.25 12.9665 3.25 12C3.25 11.0335 4.0335 10.25 5 10.25C5.9665 10.25 6.75 11.0335 6.75 12ZM13.75 12C13.75 12.9665 12.9665 13.75 12 13.75C11.0335 13.75 10.25 12.9665 10.25 12C10.25 11.0335 11.0335 10.25 12 10.25C12.9665 10.25 13.75 11.0335 13.75 12ZM20.75 12C20.75 12.9665 19.9665 13.75 19 13.75C18.0335 13.75 17.25 12.9665 17.25 12C17.25 11.0335 18.0335 10.25 19 10.25C19.9665 10.25 20.75 11.0335 20.75 12Z"/></svg>`;
        btnOpts.addEventListener('click', e => { e.stopPropagation(); tbToggleMenu(); });
    
        // Separador
        const sep2 = document.createElement('div');
        sep2.className = 'vp-pill-sep';
    
        // Botão fixar/fechar
        const btnPin = document.createElement('button');
        btnPin.className = 'vp-tbtn';
        btnPin.id = 'vp-tbtn-pin';
        btnPin.title = 'Fixar barra';
        btnPin.style.marginLeft = '-2px';
        btnPin.innerHTML = `
            <svg id="vp-icon-pin" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.37 11.04l3.59 3.59c0.56,0.55 0.86,1.3 0.86,2.08 0,0.79 -0.3,1.53 -0.86,2.09l-0.17 0.17 -7.77 -7.76 0.18 -0.17c1.11,-1.12 3.06,-1.12 4.17,0l0 0zm3.56 -4.05l4.08 4.08 -2.99 2.99c-0.08,-0.09 -0.14,-0.18 -0.23,-0.27l-3.58 -3.59c-0.05,-0.05 -0.11,-0.09 -0.16,-0.13l-0.02 -0.01c-0.03,-0.03 -0.07,-0.05 -0.1,-0.08l3 -2.99 0 0zm1.07 -3.19l6.2 6.2 -0.88 0.87c-0.23,0.23 -0.61,0.23 -0.84,0l-0.21 -0.21c0,0 0,-0.01 0,-0.01 -0.01,0 -0.01,0 -0.01,0l-4.91 -4.91c0,0 0,0 0,-0.01 0,0 -0.01,0 -0.01,0l-0.21 -0.21c-0.23,-0.23 -0.23,-0.61 0,-0.84l0.87 -0.88zm0 -1.67l-1.71 1.72c-0.62,0.62 -0.65,1.57 -0.16,2.26l-3.11 3.11c-0.04,0.04 -0.06,0.1 -0.09,0.14 -1.51,-0.62 -3.38,-0.35 -4.57,0.84l-1.01 1.01 4.3 4.3 -5.34 5.35c-0.23,0.23 -0.23,0.6 0,0.83 0.11,0.12 0.26,0.17 0.41,0.17 0.16,0 0.31,-0.05 0.42,-0.17l5.35 -5.34 4.3 4.29 1 -1c0.78,-0.78 1.21,-1.82 1.21,-2.93 0,-0.57 -0.12,-1.13 -0.34,-1.64 0.03,-0.02 0.06,-0.03 0.08,-0.06l3.15 -3.14c0.3,0.22 0.65,0.36 1.01,0.36 0.45,0 0.91,-0.18 1.25,-0.52l1.72 -1.71 -7.87 -7.87z"/></svg>
            <svg id="vp-icon-close" viewBox="0 0 24 24" fill="currentColor" style="display:none;" aria-hidden="true"><path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/></svg>`;
        btnPin.addEventListener('click', e => { e.stopPropagation(); tbTogglePin(); });
    
        content.append(btnMain, modeBadge, sep1, btnSettings, btnOpts, sep2, btnPin);
        pill.append(iconClosed, content);
    
        // Hover para abrir/fechar
        pill.addEventListener('mouseenter', tbOpenPill);
        pill.addEventListener('mouseleave', tbScheduleClose);
        menu.addEventListener('mouseenter', tbOpenPill);
        menu.addEventListener('mouseleave', tbScheduleClose);
    
        wrapper.appendChild(pill);
        document.documentElement.appendChild(wrapper);
    
        // Fechar menu ao clicar fora
        document.addEventListener('click', e => {
            if (!menu.contains(e.target) && !btnOpts.contains(e.target)) tbCloseMenu();
        }, true);
    }
    
    // Inicializa a toolbar assim que o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildToolbar);
    } else {
        buildToolbar();
    }
    
    // ============================================
    // ATALHO DE TECLADO: Ctrl+Shift+L
    // ============================================
    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'L' || e.key === 'l')) {
            e.preventDefault();
            frozenSelection = {
                text:    lastSelection.text,
                range:   lastSelection.range,
                element: lastSelection.element,
            };
            const text = frozenSelection.text || window.getSelection()?.toString() || '';
            openResult(text, '');
        }
    }, true);
    
    // ============================================
    // MENU TAMPERMONKEY
    // ============================================
    try {
        GM_registerMenuCommand('Abrir editor',   () => openResult(lastSelection.text || '', ''));
        GM_registerMenuCommand('Configurações',  openSettings);
    } catch (e) {}
    
    
})();