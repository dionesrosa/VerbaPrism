# ✨ Verba Prism

**Userscript para Tampermonkey** que transforma a maneira como você escreve na web. Com um clique, revise, corrija e aprimore qualquer texto selecionado diretamente na página, usando a potência da inteligência artificial via API da Groq (ou OpenAI / Gemini).

[![Licença MIT](https://img.shields.io/badge/licença-MIT-green)](LICENSE)
[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-suportado-orange)](https://www.tampermonkey.net/)

---

## 📖 Sobre o projeto

O Verba Prism atua como um **assistente de escrita universal**. Basta selecionar um trecho de texto em qualquer site, clicar no ícone flutuante que aparece ao lado (ou usar `Ctrl+Shift+L`), e o script envia o conteúdo para um modelo de IA configurado por você. Em segundos, uma janela elegante exibe o resultado — com opções para **copiar** ou **substituir o texto original** no próprio campo da página.

As configurações (provedor, chave de API, modelo e modo de revisão preferido) são armazenadas localmente pelo Tampermonkey, prontas para a próxima utilização.

---

## ✨ Principais funcionalidades

- **Correção ortográfica, gramatical e de pontuação** – eliminando erros de digitação e deslizes.
- **Aprimoramento de clareza, fluidez e legibilidade** – frases mais naturais e bem construídas.
- **Preservação da estrutura e do estilo original** – sem descaracterizar a voz do autor.
- **Modos variados**: Formal, Conciso, Criativo, Resumir, Traduzir (EN), Corrigir apenas ortografia, e até um modo **Roleplay** para narrativas interativas.
- **Integração com múltiplos provedores**:
  - **Groq** (recomendado, gratuito e rápido)
  - **OpenAI** (GPT-4o, GPT-4.1, etc.)
  - **Gemini** (Google)
- **Substituição direta na página** – funciona em campos de texto comuns, textareas e até editores ricos (contenteditable, como Google Docs e Character.AI).
- **Interface visual elegante** – tema dark com detalhes em rosa vibrante, clean e moderna.
- **Funcionamento universal** – qualquer site acessado pelo navegador, sem restrições.
- **Atalho de teclado** `Ctrl+Shift+L` (ou `Cmd+Shift+L` no Mac) para abrir o editor a qualquer momento.
- **Armazenamento local seguro** das chaves e preferências via `GM_setValue`.

---

## 🚀 Instalação

1. Instale a extensão [Tampermonkey](https://www.tampermonkey.net/) no seu navegador.
2. Acesse o script diretamente pelo link:
   - **[script.js](https://raw.githubusercontent.com/dionesrosa/VerbaPrism/master/script.js)**
3. O Tampermonkey abrirá automaticamente a janela de instalação. Clique em **Instalar**.
4. Obtenha uma chave de API gratuita em [console.groq.com/keys](https://console.groq.com/keys) (ou configure OpenAI/Gemini).
5. Navegue até qualquer página, selecione um texto e veja o ícone ✦ aparecer.

---

## 🖱️ Como usar

- **Selecione** um texto em qualquer página (ou clique dentro de uma caixa de texto preenchida).
- Um ícone roxo com uma estrela surgirá próximo à seleção.
- **Clique no ícone** (ou pressione `Ctrl+Shift+L`).
- Escolha o modo de processamento desejado (ex.: Aprimorar, Traduzir).
- Clique em **Processar** e aguarde o resultado.
- Use **Copiar** para levar o texto para outro lugar ou **Substituir na página** para aplicar diretamente no campo original.
- O diff visual mostra exatamente o que mudou.

---

## ⚙️ Configuração inicial

Clique em **Configurações** dentro do editor:

- Selecione o provedor (Groq, OpenAI ou Gemini).
- Insira sua chave de API.
- Escolha o modelo (ex.: `llama-3.3-70b-versatile`, `gpt-4o-mini`).
- Defina o modo padrão que será usado ao abrir o editor.
- Salve — as preferências ficarão guardadas localmente.

---

## 🛠️ Tecnologias

- **Posicionamento dinâmico do botão flutuante** com base na seleção ou no campo ativo.
- **Substituição inteligente** que respeita frameworks modernos (React, Vue) usando o setter nativo de `value`.
- **Algoritmo de diff** (LCS) para comparação visual palavra a palavra.
- **Throttle e listeners otimizados** para desempenho.
- **Suporte a conexões externas** via `GM_xmlhttpRequest`.
- Interface construída inteiramente com CSS customizado e tema escuro.

---

## 🤝 Contribuindo

Contribuições são super bem-vindas! Abra uma [issue](https://github.com/dionesrosa/VerbaPrism/issues) ou envie um pull request com melhorias, novos modos de IA ou correções.

---

## 📜 Licença

MIT. Consulte o arquivo [LICENSE](LICENSE).

---

## 📬 Contato

- **Autor:** Diones Souza
- **GitHub:** [@dionesrosa](https://github.com/dionesrosa)
- **Suporte:** [Issues no repositório](https://github.com/dionesrosa/VerbaPrism/issues)