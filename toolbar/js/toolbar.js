/**
 * Toolbar Verba Prism
 */

const Toolbar = (() => {
  'use strict';

  // Configurações e Estado
  const CONFIG = {
    CLOSE_DELAY: 300,
    SHORTCUTS: {
      's': 'btn-selecionar',
      't': 'btn-texto',
      'd': 'btn-desenhar',
      'c': 'btn-comentar'
    }
  };

  const state = {
    isPinned: false,
    closeTimer: null,
    activeToolId: null
  };

  // Elementos Cache
  const elements = {
    pill: document.getElementById('barra-pill'),
    btnCollapse: document.getElementById('btn-colapsar'),
    menus: document.querySelectorAll('.dropdown-menu'),
    tools: document.querySelectorAll('.tool-btn[id]'),
    iconPin: document.getElementById('icone-fixar'),
    iconClose: document.getElementById('icone-fechar')
  };

  /**
   * Inicialização
   */
  function init() {
    setupEventListeners();
    setupKeyboardShortcuts();
  }

  /**
   * Gerenciamento da Pill (Toolbar)
   */
  const pillActions = {
    open() {
      if (state.closeTimer) clearTimeout(state.closeTimer);
      elements.pill.classList.add('is-open');
    },

    close() {
      if (state.isPinned) return;
      elements.pill.classList.remove('is-open');
      elements.pill.classList.remove('is-pinned');
      menuActions.closeAll();
    },

    scheduleClose() {
      if (!state.isPinned) {
        state.closeTimer = setTimeout(pillActions.close, CONFIG.CLOSE_DELAY);
      }
    },

    togglePin(forceState) {
      state.isPinned = forceState !== undefined ? forceState : !state.isPinned;
      
      if (state.isPinned) {
        elements.pill.classList.add('is-pinned');
        pillActions.open();
      } else {
        elements.pill.classList.remove('is-pinned');
        toolActions.resetAll();
        pillActions.close();
      }
      
      this.updateCollapseButton();
    },

    updateCollapseButton() {
      const { iconPin, iconClose, btnCollapse } = elements;
      
      if (state.isPinned) {
        iconPin.style.display = 'none';
        iconClose.style.display = 'block';
        btnCollapse.title = "Recolher barra";
      } else {
        iconPin.style.display = 'block';
        iconClose.style.display = 'none';
        btnCollapse.title = "Fixar barra";
      }
    }
  };

  /**
   * Gerenciamento de Ferramentas
   */
  const toolActions = {
    handleToolClick(id) {
      const btn = document.getElementById(id);
      if (!btn) return;

      // Se tiver menu, alterna
      if (id === 'btn-opcoes' || document.getElementById(`menu-${id}`)) {
        menuActions.toggle(id);
      }

      // Lógica de ativação (toggle) para ferramentas (exceto opções)
      if (id !== 'btn-opcoes') {
        const isAlreadyActive = btn.classList.contains('is-active');
        this.resetAll();

        if (!isAlreadyActive) {
          this.activate(id);
        } else {
          pillActions.togglePin(false);
        }
      }
    },

    activate(id) {
      const btn = document.getElementById(id);
      if (btn) {
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
        state.activeToolId = id;
        pillActions.togglePin(true);
      }
    },

    resetAll() {
      elements.tools.forEach(btn => {
        if (btn.id !== 'btn-opcoes') {
          btn.classList.remove('is-active');
          btn.setAttribute('aria-pressed', 'false');
        }
      });
      state.activeToolId = null;
    }
  };

  /**
   * Gerenciamento de Menus
   */
  const menuActions = {
    closeAll() {
      elements.menus.forEach(menu => menu.classList.remove('is-open'));
      elements.tools.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
    },

    toggle(buttonId) {
      const menu = document.getElementById(`menu-${buttonId}`);
      if (!menu) return;

      const isOpen = menu.classList.contains('is-open');
      this.closeAll();

      if (!isOpen) {
        this.positionMenu(menu, buttonId);
        menu.classList.add('is-open');
        document.getElementById(buttonId).setAttribute('aria-expanded', 'true');
        
        // Abrir menu fixa a barra
        pillActions.togglePin(true);
      }
    },

    positionMenu(menu, buttonId) {
      const btn = document.getElementById(buttonId);
      const rect = btn.getBoundingClientRect();
      
      // Centralização e posicionamento acima do botão
      menu.style.right = `${window.innerWidth - rect.right - (rect.width / 4)}px`;
      menu.style.bottom = `${window.innerHeight - rect.top + 10}px`;
    },

    handleAction(action) {
      const actions = {
        'atalhos': () => alert('Atalhos:\nS = Selecionar\nT = Texto\nD = Desenhar\nC = Comentar'),
        'resetar': () => {
          toolActions.resetAll();
          pillActions.togglePin(false);
        },
        'fechar': () => {
          pillActions.togglePin(false);
          elements.pill.classList.remove('is-open');
        }
      };

      if (actions[action]) {
        actions[action]();
      } else {
        console.log('Ação executada:', action);
      }
      
      this.closeAll();
    }
  };

  /**
   * Configuração de Eventos
   */
  function setupEventListeners() {
    // Eventos da Pill
    elements.pill.addEventListener('mouseenter', pillActions.open);
    elements.pill.addEventListener('mouseleave', pillActions.scheduleClose);
    elements.pill.addEventListener('click', (e) => {
      if (!e.target.closest('.tool-btn')) {
        pillActions.togglePin(true);
      }
    });

    // Botão Colapsar
    elements.btnCollapse.addEventListener('click', (e) => {
      e.stopPropagation();
      pillActions.togglePin();
    });

    // Botões de Ferramentas
    elements.tools.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toolActions.handleToolClick(btn.id);
      });
    });

    // Itens de Menu
    document.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = item.getAttribute('data-action');
        menuActions.handleAction(action);
      });
    });

    // Hover nos Menus
    elements.menus.forEach(menu => {
      menu.addEventListener('mouseenter', pillActions.open);
      menu.addEventListener('mouseleave', pillActions.scheduleClose);
    });

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
      const isClickInsideMenu = Array.from(elements.menus).some(m => m.contains(e.target));
      const isClickOnTool = e.target.closest('.tool-btn');
      
      if (!isClickInsideMenu && !isClickOnTool) {
        menuActions.closeAll();
      }
    });
  }

  /**
   * Atalhos de Teclado
   */
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      const toolId = CONFIG.SHORTCUTS[key];
      
      if (toolId) {
        toolActions.handleToolClick(toolId);
      }
    });
  }

  // Exportar API pública se necessário
  return {
    init
  };
})();

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', Toolbar.init);
