# Verba Prism

Userscript para Tampermonkey desenvolvido por Diones Souza.

[![Licença MIT](https://img.shields.io/badge/licença-MIT-green)](LICENSE)
[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-suportado-orange)](https://www.tampermonkey.net/)

[![Instalar](https://img.shields.io/badge/Instalar-Userscript-blue?style=for-the-badge&logo=Tampermonkey)](https://raw.githubusercontent.com/dionesrosa/VerbaPrism/main/dist/verba-prism.user.js)

---

## ✨ O que o script faz

O Verba Prism permite melhorar, corrigir e transformar textos selecionados em qualquer página, usando modelos de IA configurados pelo usuário.

## 🔧 Funcionalidades

- Corrige ortografia, gramática e pontuação
- Aprimora clareza e fluidez do texto
- Oferece modos como Formal, Conciso, Criativo, Resumir e Traduzir
- Permite substituir o texto diretamente na página
- Suporta múltiplos provedores de IA, como Groq, OpenAI e Gemini

## 🚀 Instalação

1. Instale a extensão [Tampermonkey](https://www.tampermonkey.net/) no navegador.
2. Instale o userscript disponível no link acima.
3. Configure sua chave de API e modelo preferido na interface.

## 🖱️ Como usar

Selecione um texto em qualquer página, clique no ícone flutuante e escolha o modo desejado. O resultado pode ser copiado ou aplicado diretamente no campo selecionado.

## 🛠️ Compilação com userscript-builder

Esta seção é destinada a desenvolvedores que quiserem gerar e publicar o userscript localmente.

O [userscript-builder](https://github.com/dionesrosa/userscript-builder) lê os metadados do arquivo [userscript.config.json](userscript.config.json), usa a entrada principal em [src/index.js](src/index.js) e gera o arquivo final com o cabeçalho do Tampermonkey automaticamente.

### Comandos mais usados

- `usb build` — gera o arquivo final em `dist/`
- `usb release patch|minor|major` — atualiza a versão e cria um release
- `usb publish` — publica o build no GitHub Releases

```bash
usb build
```

> Para quem apenas vai usar o script, o fluxo mais simples é instalar o userscript diretamente pelo link de instalação acima.

## 🧩 Estrutura do projeto

- [src/index.js](src/index.js): lógica principal do userscript
- [userscript.config.json](userscript.config.json): metadados e configuração do build

## 👤 Autor

Diones Souza

## 📜 Licença

MIT