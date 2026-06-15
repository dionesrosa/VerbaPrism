# Guia de Melhorias - Verba Prism

Este arquivo lista os principais pontos de melhoria para o userscript `script.js` do Verba Prism.

## Status atual
- [x] Script validado com `node -c script.js`
- [x] Seleção de texto preservada com `Range.cloneRange()`
- [x] Tratamento básico de resposta da API e status HTTP
- [x] Copiar texto para área de transferência com fallback
- [x] Modal de resultados e configurações funcionando

## Melhorias a implementar

- [ ] Refatorar o código para separar melhor UI, API e lógica de seleção
- [ ] Adicionar um `backdrop` escuro ao abrir modais para melhorar a experiência visual
- [ ] Melhorar a substituição de texto em áreas complexas (conteúdo HTML, elementos `contenteditable`, rich text)
- [ ] Usar `GM_setClipboard` ou `navigator.clipboard` de forma consistente e segura
- [ ] Adicionar validação de formato da chave de API antes de salvar
- [ ] Mostrar mensagens de erro mais amigáveis dentro do modal, sem `alert()` em excesso
- [ ] Permitir configuração de prompt ou perfil de revisão (ex.: formal, conciso, criativo)
- [ ] Atualizar a lista de modelos apenas quando a chave estiver configurada e o modal de configurações aberto
- [ ] Incluir um modo de teste local que apenas formate o texto sem chamar a API
- [ ] Corrigir o uso de `document.execCommand('copy')`: preferir APIs modernas, e evitar seleção forçada ao copiar
- [ ] Adicionar um indicador visual de sucesso após a cópia do texto
- [ ] Tratar melhor casos de resposta parcial ou formato inesperado da API Groq
- [ ] Criar documentação de uso básica para o usuário final dentro do README ou no próprio modal
- [ ] Revisar o prompt do modelo para incluir exemplos e garantir que ele não instrua o modelo a gerar conteúdo fora do texto original

## Sugestões extras

- [ ] Tornar o script compatível com elementos `textarea`/`input` selecionados diretamente
- [ ] Adicionar suporte para múltiplos idiomas (português, inglês)
- [ ] Salvar configurações no `GM_setValue` com um esquema de versão para futuras atualizações
- [ ] Adicionar testes manuais ou automatizados para fluxos principais (`selecionar`, `enviar`, `receber`, `substituir`)
- [ ] Melhorar o nome das variáveis e comentários para facilitar manutenção

## Prioridade recomendada
1. Melhorar substituição consistente de texto e evitar `innerHTML` direto
2. Melhorar UX do modal e mensagens de erro
3. Refatorar estrutura do script para permitir novas funcionalidades
4. Adicionar opções de prompt/modelo flexíveis
5. Documentar uso e limitações
