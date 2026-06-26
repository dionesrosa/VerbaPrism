# GUIA — Verba Prism

## O que foi feito

### Sessão atual

**fix: corrigir substituição de texto na textarea usando frozenSelection**

- Identificado o bug raiz: ao abrir o modal, o foco mudava para os elementos do overlay, disparando `captureSelection` e zerando `lastSelection.element`. Com isso, `replaceSelection` caía no bloco `range` e inseria o texto acima da textarea em vez de substituir o valor dela.
- Adicionada a variável `frozenSelection` que congela um snapshot de `lastSelection` no exato momento em que `openResult` é chamado (antes de o modal roubar o foco).
- `replaceSelection` agora consulta `frozenSelection` em vez de `lastSelection`, garantindo que o alvo de substituição seja sempre o campo original.
- Mantido o setter nativo de `HTMLTextAreaElement.prototype` para compatibilidade com React e outros frameworks que ignoram atribuição direta de `node.value`.

---

## Próximos passos (baseados em PROJETO.md)

### Fase 1 — Curto Prazo
- [ ] Gerenciador de Histórico (visualizar, pesquisar, exportar JSON/CSV)
- [ ] Mais atalhos de teclado (histórico, alternar tema, copiar último resultado)
- [ ] Tema claro completo (paleta apropriada, acessibilidade)
- [ ] Notificações nativas do navegador

### Fase 2 — Médio Prazo
- [ ] Custom Prompts (modos de revisão personalizados pelo usuário)
- [ ] Ajuste de Tom (sliders de profissionalismo, entusiasmo, criatividade)
- [ ] Estatísticas de uso (textos processados, modo mais usado, tempo médio)

### Fase 3 — Longo Prazo
- [ ] Diff avançado (por caractere, lado a lado, histórico de versões, desfazer/refazer)
- [ ] Integração com Google Docs
- [ ] Sincronização de configurações via Cloud

---

## Observações técnicas

- O script é um userscript Tampermonkey — verificação de runtime só é possível carregando no navegador; não há suite de testes automatizados.
- O padrão `frozenSelection` deve ser replicado em qualquer futuro ponto de entrada que abra o modal (menu Tampermonkey, atalhos de teclado adicionais, etc.).
- O aviso de LF→CRLF do Git é inofensivo; o arquivo funciona normalmente no Tampermonkey.
