// ==UserScript==
// @name         Verba Prism
// @namespace    https://github.com/dionesrosa
// @version      0.2.0
// @description  Aprimora o texto selecionado usando a API Groq (IA).
// @author       Diones Souza
// @license      MIT
// @icon         https://cdn-icons-png.magnific.com/64/9708/9708616.png
// @homepageURL  https://github.com/dionesrosa/Verba-Prism
// @supportURL   https://github.com/dionesrosa/Verba-Prism/issues
// @updateURL    https://raw.githubusercontent.com/dionesrosa/Verba-Prism/master/script.js
// @downloadURL  https://raw.githubusercontent.com/dionesrosa/Verba-Prism/master/script.js
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

    const scriptVersion = '0.2.0';
    const scriptName = 'Verba Prism';
    const localScriptUrl = 'http://localhost:3001/script.js';
    const fetchUrl = `${localScriptUrl}?t=${Date.now()}`;

    if (window.top !== window.self) {
        console.log(`${scriptName} local loader skipped inside iframe.`);
        return;
    }

    function loadLocalScript() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: fetchUrl,
            onload(response) {
                if (response.status >= 200 && response.status < 300) {
                    try {
                        eval(response.responseText);
                        console.log(`${scriptName} carregado via load.js (${fetchUrl})`);
                    } catch (error) {
                        console.error(`Erro ao executar script ${scriptName}:`, error);
                    }
                } else {
                    console.error(`Falha ao buscar o script local ${scriptName}:`, response.status, response.statusText);
                }
            },
            onerror(error) {
                console.error(`Erro de requisição ao carregar ${scriptName} local:`, error);
            }
        });
    }

    loadLocalScript();
})();