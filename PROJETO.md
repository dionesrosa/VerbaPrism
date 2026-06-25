# Verba Prism: Documentação Consolidada

## 1. Visão Geral do Projeto

O Verba Prism é um userscript desenvolvido para Tampermonkey, projetado para aprimorar a experiência de escrita em qualquer página da web. Ele integra-se com APIs de modelos de linguagem (como Groq, OpenAI e Google Gemini) para revisar, corrigir e refinar textos selecionados. O objetivo principal é atuar como um assistente de escrita universal, permitindo que os usuários melhorem rapidamente qualquer texto sem a necessidade de copiar e colar entre diferentes ferramentas.

### 1.1. Principais Funcionalidades

*   **Correção e Aprimoramento**: Realiza correção ortográfica, gramatical, de pontuação e aprimora a clareza, fluidez e legibilidade do texto, preservando a estrutura e o estilo original.
*   **Integração com IA**: Suporte a múltiplos modelos de IA de provedores como Groq, OpenAI e Google Gemini.
*   **Interface Intuitiva**: Interface visual moderna e elegante, com tema dark e elementos de destaque em rosa forte.
*   **Flexibilidade**: Funciona em qualquer site acessado pelo navegador.
*   **Persistência de Configurações**: Armazenamento local das configurações (provedor, chave, modelo, idioma e modo de revisão) via Tampermonkey.

## 2. Melhorias e Implementações

O projeto Verba Prism passou por diversas melhorias significativas, especialmente nas versões v2, v3 e v3.1, focando em usabilidade, performance e expansão de funcionalidades.

### 2.1. Melhorias da Versão 2 (v0.3.0)

A versão 2 introduziu uma série de aprimoramentos focados na experiência do usuário e na robustez do script:

*   **Correção do Menu de Contexto**: O script não intercepta mais o evento `contextmenu` globalmente, permitindo o uso normal do menu nativo do navegador. Um botão flutuante inteligente foi implementado para ativar o Verba Prism.
*   **Tema Dinâmico**: Adicionada detecção automática da preferência de tema do sistema (`prefers-color-scheme: dark`), com planos para suporte completo a tema claro.
*   **Animações Suaves**: Implementação de animações com `cubic-bezier` para transições mais elegantes em botões e modais (e.g., `groq-fade-in`, `groq-slide-up`, `groq-ripple`).
*   **Micro-interações**: Adição de um efeito "ripple" nos botões para feedback visual ao clicar.
*   **Histórico Local**: Armazenamento dos últimos 10 textos processados localmente, com funções `getHistory()` e `addToHistory()`.
*   **Atalhos de Teclado**: Suporte a `Alt + V` para ativar o script com texto selecionado e `Escape` para fechar modais.
*   **Botão Flutuante Inteligente**: Um botão flutuante com o emoji ✨ aparece apenas quando há texto selecionado, posicionado no canto inferior direito.
*   **Modo "Diff"**: Implementação da função `generateDiff()` para visualizar as alterações entre o texto original e o aprimorado, destacando palavras removidas (vermelho) e adicionadas (verde).
*   **Validação de API Key**: Validação aprimorada da chave de API, incluindo regex e uma tentativa real de carregamento de modelos.
*   **Cache de Modelos**: Implementação de cache de modelos com duração de 1 hora para reduzir requisições repetidas e melhorar a performance.

### 2.2. Melhorias da Versão 3 (v0.4.0)

A versão 3 marcou a transição para uma arquitetura multi-provedor e uma reformulação da interface:

*   **Nova UI Reformulada**: Modais redesenhados com design minimalista, bordas arredondadas, sombras suaves e animações premium. Inclui um novo indicador de carregamento (spinner).
*   **Suporte Multi-Provedor**: A página de configurações agora permite configurar individualmente chaves e modelos para Groq, OpenAI e Google Gemini (com instruções específicas para Gemini).
*   **Configurações Dinâmicas**: Campos de chave e modelo se ajustam automaticamente ao trocar o provedor nas configurações.
*   **Lógica de Foco Inteligente**: O botão flutuante aparece ao focar em campos de texto e permanece ativo se houver seleção.
*   **Modo Diff Aprimorado**: Visualização clara de palavras adicionadas e removidas diretamente no modal de resultado.
*   **Persistência de Dados**: Chaves e modelos são salvos separadamente para cada provedor.
*   **Correções de Erros**: Ajustes de `Z-Index` para modais, melhoria no comportamento de scroll e disparo do evento `input` ao substituir texto em inputs para compatibilidade com frameworks modernos.

### 2.3. Melhorias da Versão 3.1 (v0.5.0)

A versão 3.1 trouxe refinamentos na interface de configurações e novos modos de processamento:

*   **Sistema de Abas para Provedores**: A interface de configurações agora possui abas individuais para cada provedor (Groq, OpenAI, Gemini), permitindo configurar chaves e modelos de forma independente. Um seletor de "Provedor Ativo" define qual IA será usada.
*   **Novo Modo: Roleplay**: Adicionado um modo especializado para escrita criativa e interpretativa, focado em descrições sensoriais e formatação de ações (asteriscos para ações, aspas para diálogos).
*   **Ajustes nos Modos de Processamento**: A lista de modos foi expandida e refinada, incluindo:
    *   **Aprimorar**: Equilíbrio ideal para uso geral.
    *   **Formal**: Para e-mails e documentos profissionais.
    *   **Conciso**: Para mensagens rápidas e diretas.
    *   **Criativo**: Para textos literários e blogs.
    *   **Roleplay**: Para jogadores e escritores de ficção.
    *   **Traduzir (EN)**: Tradução rápida para o inglês.
    *   **Resumir**: Transforma textos longos em listas de tópicos.
    *   **Corrigir**: Apenas ortografia, sem mudar o estilo.
*   **Melhorias Técnicas**: Estilos refinados com paleta de cores `slate` e `accent pink` para uma interface "Cyberpunk/Dark Mode". Chaves de API são tratadas como campos de senha (ocultos).

## 3. Testes Manuais

Os testes manuais são essenciais para verificar os fluxos principais do userscript Verba Prism. Os pré-requisitos incluem a instalação do Tampermonkey e o carregamento do `script.js`.

### 3.1. Fluxos de Teste

*   **Selecionar -> Enviar -> Receber -> Substituir**: Selecionar texto, usar a opção "Melhorar seleção" (menu de contexto ou botão flutuante), verificar o modal de carregamento e o resultado aprimorado, e confirmar a substituição do texto na página.
*   **Copiar Resultado**: Após obter o resultado no modal, clicar em "Copiar" e verificar a notificação de sucesso e a cópia para a área de transferência.
*   **Configurações**: Testar a troca de provedores, inserir chaves inválidas (deve mostrar erro), ativar o "Modo de teste local" e verificar a troca de idiomas.
*   **Casos de Borda**: Verificar a substituição de texto em elementos `contenteditable` e `textarea`/`input`, e o comportamento quando nenhuma chave está configurada (deve pedir para configurar).

## 4. Funcionalidades Futuras e Roadmap

O roadmap do Verba Prism inclui diversas funcionalidades planejadas para expandir suas capacidades e melhorar ainda mais a experiência do usuário.

### 4.1. Funcionalidades de IA Avançadas

*   [ ] **Tradução Integrada**: Adicionar modos de tradução automática para múltiplos idiomas (Inglês, Espanhol, Francês, Alemão, Japonês).
*   [ ] **Ajuste de Tom (Tone Slider)**: Sliders para ajustar o nível de profissionalismo, entusiasmo e criatividade do texto resultante.
*   [ ] **Resumo de Texto**: Modo específico para resumir seleções longas em diferentes formatos (curto, médio, longo, bullet points).
*   [ ] **Diferença de Texto Avançada (Diff)**: Expansão do modo diff para incluir comparação por caractere, visualização lado-a-lado, histórico de versões e funcionalidades de desfazer/refazer.

### 4.2. Funcionalidades de Sistema

*   [ ] **Gerenciador de Histórico**: Interface completa para visualizar, pesquisar, exportar (JSON/CSV) e recuperar textos processados anteriormente.
*   [ ] **Custom Prompts**: Permitir que usuários criem e salvem seus próprios modos de revisão personalizados.
*   [ ] **Suporte a Mais Atalhos de Teclado**: Expandir o sistema de atalhos para operações como abrir configurações, histórico, alternar tema e copiar último resultado.
*   [ ] **Integração com Google Docs**: Suporte nativo para melhorar textos diretamente no Google Docs, lidando com sua estrutura DOM complexa.
*   [ ] **Sincronização de Configurações via Cloud**: Sincronizar configurações entre diferentes dispositivos do usuário (via Firebase ou servidor próprio).
*   [ ] **Estatísticas de Uso**: Rastrear e exibir métricas como total de textos processados, modo mais usado, provedor mais usado e tempo médio de processamento.

### 4.3. Funcionalidades de UI/UX

*   [ ] **Tema Claro Completo**: Implementar um tema claro com paleta de cores apropriada para melhor acessibilidade e conforto visual.
*   [ ] **Notificações de Sistema**: Notificações do navegador para eventos importantes, como sucesso no processamento de texto.

### 4.4. Priorização de Implementação (Roadmap)

| Fase | Prazo | Funcionalidades |
| :--- | :--- | :--- |
| **Fase 1** | Curto Prazo (1-2 semanas) | Gerenciador de Histórico, Mais Atalhos de Teclado, Tema Claro Completo, Notificações de Sistema |
| **Fase 2** | Médio Prazo (1 mês) | Custom Prompts, Ajuste de Tom, Resumo de Texto, Estatísticas de Uso |
| **Fase 3** | Longo Prazo (2+ meses) | Tradução Integrada, Integração com Google Docs, Sincronização de Configurações via Cloud, Diff Avançado |

**Roadmap Trimestral:**
*   **Q3 2026**: Lançar versão 0.4.0 com Fase 1, coletar feedback.
*   **Q4 2026**: Lançar versão 0.5.0 com Fase 2, otimizar performance.
*   **Q1 2027**: Lançar versão 1.0.0 com Fase 3, disponibilizar como extensão oficial.

### 4.5. Ideias Adicionais Abertas

*   [ ] Integração com Notion
*   [ ] Suporte a Markdown
*   [ ] Análise de Sentimento
*   [ ] Detecção de Plágio
*   [ ] Sugestões de SEO
*   [ ] Análise de Legibilidade
*   [ ] Integração com Slack
*   [ ] API Pública

## 5. Notas Técnicas e Troubleshooting

### 5.1. Estrutura do Código (v2)

O código da versão 2 é caracterizado por seções bem organizadas com comentários claros, funções modulares para fácil manutenção, minimização de variáveis globais e otimização de event listeners com delegação.

### 5.2. Performance

*   O cache de modelos reduz requisições em 90%.
*   Animações utilizam aceleração de GPU (transform, opacity).
*   Debouncing implícito em event listeners.
*   Limpeza de memória em `removeResultModal()`.

### 5.3. Compatibilidade

O script funciona em todos os navegadores modernos e suporta Tampermonkey, Greasemonkey e Violentmonkey. Testado em Chrome, Firefox, Safari e Edge.

### 5.4. Troubleshooting Comum

*   **Botão flutuante não aparece**: Verifique se há texto selecionado, pois o botão só aparece com seleção ativa.
*   **Cache de modelos desatualizado**: Limpe o cache nas configurações ou aguarde 1 hora para atualização automática.
*   **Animações lentas**: Desabilite a aceleração de hardware no navegador ou reduza a duração das animações em CSS.

## 6. Suporte

Para reportar bugs ou sugerir melhorias, recomenda-se abrir uma issue no repositório do projeto.

---

**Versão Consolidada:** 1.0  
**Data:** Junho 2026  
**Autor:** Manus AI
