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
// @connect      127.0.0.1
// @connect      api.groq.com
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const localScriptUrl = 'http://127.0.0.1:5500/script.js';
    const fetchUrl = `${localScriptUrl}?t=${Date.now()}`;

    function loadLocalScript() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: fetchUrl,
            onload(response) {
                if (response.status >= 200 && response.status < 300) {
                    try {
                        eval(response.responseText);
                        console.log(`Verba Prism carregado via load.js (${fetchUrl})`);
                    } catch (error) {
                        console.error('Erro ao executar script Verba Prism:', error);
                        alert('Erro ao carregar o Verba Prism local. Veja o console para detalhes.');
                    }
                } else {
                    console.error('Falha ao buscar o script local:', response.status, response.statusText);
                    alert('Não foi possível carregar o Verba Prism local. Verifique se o servidor está ativo.');
                }
            },
            onerror(error) {
                console.error('Erro de requisição ao carregar Verba Prism local:', error);
                alert('Erro ao carregar o Verba Prism local. Verifique a conexão com o servidor local.');
            }
        });
    }

    loadLocalScript();
})();