# GUIA - Estado Atual e Próximos Passos

## O que foi feito

### Sessão atual
- Revisado o `PROJETO.md` comparando o roadmap com o código implementado em `script.js` (v0.5.0).
- Marcadas as funcionalidades já concluídas no roadmap (seção 4):
  - **Tradução Integrada** (`[x]`): modo "Traduzir (EN)" presente em `MODES` (script.js:46); múltiplos idiomas ainda pendentes.
  - **Resumo de Texto** (`[x]`): modo "Resumir" presente em `MODES` (script.js:47).
  - **Atalhos de Teclado básico** (`[x]`): `Alt+V` e `Escape` documentados na v2 (seção 2.1).
  - **Notificações básicas** (`[x]`): feedback visual "✓ Copiado" implementado (script.js:351); notificações nativas do navegador ainda pendentes.
- Diff avançado: existe implementação básica por palavra (`generateDiff`, script.js:372), mas comparação por caractere, lado-a-lado e histórico de versões ainda estão pendentes — mantido como `[ ]` com observação.

## Estado do Projeto

- Versão atual: **v0.5.0** (Verba Prism v3.1 - Tabs & Modes)
- Provedores suportados: Groq, OpenAI, Google Gemini
- Modos de processamento: Aprimorar, Formal, Conciso, Criativo, Roleplay, Traduzir (EN), Resumir, Corrigir

## Próximos Passos (baseados no PROJETO.md)

### Fase 1 — Curto Prazo (prioritário)
- [ ] **Gerenciador de Histórico**: interface para visualizar, pesquisar, exportar (JSON/CSV) e recuperar textos processados.
- [ ] **Mais Atalhos de Teclado**: expandir para abrir histórico, alternar tema e copiar último resultado.
- [ ] **Tema Claro Completo**: paleta `light mode` para melhor acessibilidade.
- [ ] **Notificações de Sistema**: notificações nativas do navegador para eventos importantes.

### Fase 2 — Médio Prazo
- [ ] **Custom Prompts**: usuário cria e salva modos de revisão personalizados.
- [ ] **Ajuste de Tom (Tone Slider)**: sliders de profissionalismo, entusiasmo e criatividade.
- [ ] **Estatísticas de Uso**: métricas de textos processados, modo e provedor mais usados.

### Fase 3 — Longo Prazo
- [ ] **Tradução para múltiplos idiomas**: Espanhol, Francês, Alemão, Japonês.
- [ ] **Integração com Google Docs**.
- [ ] **Sincronização via Cloud** (Firebase ou servidor próprio).
- [ ] **Diff Avançado**: comparação por caractere, visualização lado-a-lado, histórico de versões.
