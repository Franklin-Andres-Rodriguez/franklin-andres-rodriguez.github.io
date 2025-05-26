/**
 * ========================================
 * MÓDULO DE ANIMACIONES Y EFECTOS VISUALES
 * ========================================
 * Sistema avanzado de animaciones con optimización de performance
 * Includes: ScrollAnimations, Parallax, Particles, Typing Effects
 */

// ========================================
// CONFIGURACIÓN DE ANIMACIONES
// ========================================
const ANIMATION_CONFIG = {
  // Configuración general
  REDUCED_MOTION: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  PERFORMANCE_MODE: false, // Se activa automáticamente en dispositivos lentos
  
  // Timing functions
  EASING: {
    ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },
  
  // Duraciones (en ms)
  DURATION: {
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 800
  },
  
  // Thresholds para Intersection Observer
  THRESHOLDS: {
    scroll: [0, 0.1, 0.25, 0.5, 0.75, 1],
    parallax: [0, 0.25, 0.5, 0.75, 1]
  }
};

// ========================================
// CLASE PRINCIPAL DE ANIMACIONES
// ========================================
class AnimationManager {
  constructor() {
    this.observers = new Map();
    this.animations = new Map();
    this.rafCallbacks = new Set();
    this.isRAFRunning = false;
    this.performanceMetrics = {
      fps: 60,
      frameTime: 16.67,
      lastFrameTime: performance.now()
    };
    
    this.init();
  }
  
  /**
   * Inicialización del gestor de animaciones
   */
  async init() {
    try {
      // Detectar capacidades del dispositivo
      await this.detectPerformanceCapabilities();
      
      // Configurar sistemas de animación
      this.setupScrollAnimations();
      this.setupParallaxEffects();
      this.setupTypingEffects();
      this.setupMicroInteractions();
      this.setupParticleSystem();
      
      // Monitorear performance
      this.startPerformanceMonitoring();
      
      console.log('✅ AnimationManager inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando AnimationManager:', error);
    }
  }
  
  /**
   * Detectar capacidades de performance del dispositivo
   */
  async detectPerformanceCapabilities() {
    // Test de performance básico
    const startTime = performance.now();
    
    // Ejecutar operaciones computacionalmente intensivas
    for (let i = 0; i < 100000; i++) {
      Math.random() * Math.sin(i);
    }
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    // Activar modo performance si el dispositivo es lento
    ANIMATION_CONFIG.PERFORMANCE_MODE = executionTime > 10;
    
    // Detectar otros factores
    const hasReducedMotion = ANIMATION_CONFIG.REDUCED_MOTION;
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (hasReducedMotion || isLowEndDevice || ANIMATION_CONFIG.PERFORMANCE_MODE) {
      this.enablePerformanceMode();
    }
    
    console.log(`📊 Performance Mode: ${ANIMATION_CONFIG.PERFORMANCE_MODE ? 'Activado' : 'Desactivado'}`);
  }
  
  /**
   * Activar modo de alto rendimiento
   */
  enablePerformanceMode() {
    ANIMATION_CONFIG.PERFORMANCE_MODE = true;
    
    // Reducir complejidad de animaciones
    document.documentElement.style.setProperty('--animation-duration-multiplier', '0.5');
    document.documentElement.classList.add('performance-mode');
    
    // Desactivar efectos costosos
    this.disableExpensiveEffects();
  }
  
  /**
   * Desactivar efectos costosos
   */
  disableExpensiveEffects() {
    const expensiveElements = document.querySelectorAll('.parallax-element, .particle-system');
    expensiveElements.forEach(el => {
      el.style.transform = 'none';
      el.classList.add('performance-disabled');
    });
  }
  
  /**
   * Configurar animaciones de scroll
   */
  setupScrollAnimations() {
    // Observer para elementos que animan al hacer scroll
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateScrollElement(entry.target, entry.intersectionRatio);
        }
      });
    }, {
      threshold: ANIMATION_CONFIG.THRESHOLDS.scroll,
      rootMargin: '-50px 0px -50px 0px'
    });
    
    // Aplicar a elementos con animación de scroll
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      scrollObserver.observe(el);
    });
    
    this.observers.set('scroll', scrollObserver);
    
    // Configurar animaciones personalizadas
    this.setupCustomScrollAnimations();
  }
  
  /**
   * Animar elemento durante scroll
   */
  animateScrollElement(element, ratio) {
    const animationType = element.dataset.animation || 'fadeInUp';
    const delay = parseFloat(element.dataset.delay) || 0;
    const duration = parseFloat(element.dataset.duration) || ANIMATION_CONFIG.DURATION.normal;
    
    setTimeout(() => {
      element.classList.add('animated');
      this.applyScrollAnimation(element, animationType, ratio);
    }, delay);
  }
  
  /**
   * Aplicar animación específica
   */
  applyScrollAnimation(element, type, ratio) {
    const animations = {
      fadeInUp: () => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      },
      fadeInLeft: () => {
        element.style.opacity = '1';
        element.style.transform = 'translateX(0)';
      },
      fadeInRight: () => {
        element.style.opacity = '1';
        element.style.transform = 'translateX(0)';
      },
      scaleIn: () => {
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
      },
      slideInUp: () => {
        element.style.transform = `translateY(${-50 * (1 - ratio)}px)`;
        element.style.opacity = ratio;
      }
    };
    
    const animation = animations[type];
    if (animation && !ANIMATION_CONFIG.REDUCED_MOTION) {
      animation();
    }
  }
  
  /**
   * Configurar efectos parallax
   */
  setupParallaxEffects() {
    if (ANIMATION_CONFIG.PERFORMANCE_MODE || ANIMATION_CONFIG.REDUCED_MOTION) {
      return; // Skip parallax en modo performance
    }
    
    const parallaxElements = document.querySelectorAll('.parallax-element');
    if (parallaxElements.length === 0) return;
    
    // Usar RAF para parallax suave
    let isScrolling = false;
    
    const handleScroll = () => {
      if (!isScrolling) {
        requestAnimationFrame(() => {
          this.updateParallaxEffects(parallaxElements);
          isScrolling = false;
        });
        isScrolling = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Inicializar posiciones
    this.updateParallaxEffects(parallaxElements);
  }
  
  /**
   * Actualizar efectos parallax
   */
  updateParallaxEffects(elements) {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrollTop;
      const elementHeight = rect.height;
      
      // Calcular si el elemento está en viewport
      if (scrollTop + windowHeight > elementTop && scrollTop < elementTop + elementHeight) {
        const speed = parseFloat(element.dataset.parallaxSpeed) || 0.5;
        const yPos = -(scrollTop - elementTop) * speed;
        
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
      }
    });
  }
  
  /**
   * Configurar efectos de escritura
   */
  setupTypingEffects() {
    const typingElements = document.querySelectorAll('[data-typing]');
    
    typingElements.forEach(element => {
      // Observer para iniciar el efecto cuando sea visible
      const typingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.startTypingEffect(entry.target);
            typingObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      typingObserver.observe(element);
    });
  }
  
  /**
   * Iniciar efecto de escritura
   */
  startTypingEffect(element) {
    const text = element.dataset.typing || element.textContent;
    const speed = parseInt(element.dataset.typingSpeed) || 50;
    const cursor = element.dataset.typingCursor !== 'false';
    
    element.textContent = '';
    
    if (cursor) {
      element.innerHTML = '<span class="typing-cursor">|</span>';
    }
    
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        const currentText = text.substring(0, i + 1);
        element.innerHTML = cursor ? 
          `${currentText}<span class="typing-cursor">|</span>` : 
          currentText;
        i++;
      } else {
        clearInterval(typeInterval);
        // Ocultar cursor después de completar
        if (cursor) {
          setTimeout(() => {
            element.innerHTML = text;
          }, 1000);
        }
      }
    }, speed);
  }
  
  /**
   * Configurar micro-interacciones
   */
  setupMicroInteractions() {
    // Botones con efecto ripple
    this.setupRippleEffect();
    
    // Cards con hover effect
    this.setupCardHoverEffects();
    
    // Links con underline animation
    this.setupLinkAnimations();
    
    // Form focus effects
    this.setupFormAnimations();
  }
  
  /**
   * Efecto ripple en botones
   */
  setupRippleEffect() {
    const buttons = document.querySelectorAll('.btn, button');
    
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        if (ANIMATION_CONFIG.REDUCED_MOTION) return;
        
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          transform: scale(0);
          animation: ripple 0.6s linear;
          left: ${x}px;
          top: ${y}px;
          width: ${size}px;
          height: ${size}px;
          pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        ripple.addEventListener('animationend', () => {
          ripple.remove();
        });
      });
    });
    
    // CSS para animación ripple
    if (!document.getElementById('ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  /**
   * Efectos hover en cards
   */
  setupCardHoverEffects() {
    const cards = document.querySelectorAll('.project-card, .skill-category');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (!ANIMATION_CONFIG.REDUCED_MOTION) {
          card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
          card.style.transform = 'translateY(-8px) scale(1.02)';
        }
      });
      
      card.addEventListener('mouseleave', () => {
        if (!ANIMATION_CONFIG.REDUCED_MOTION) {
          card.style.transform = 'translateY(0) scale(1)';
        }
      });
    });
  }
  
  /**
   * Animaciones de enlaces
   */
  setupLinkAnimations() {
    const links = document.querySelectorAll('.nav-link');
    
    links.forEach(link => {
      if (!link.querySelector('.link-underline')) {
        const underline = document.createElement('span');
        underline.className = 'link-underline';
        underline.style.cssText = `
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
          transition: width 0.3s ease;
        `;
        link.style.position = 'relative';
        link.appendChild(underline);
      }
      
      const underline = link.querySelector('.link-underline');
      
      link.addEventListener('mouseenter', () => {
        if (underline && !ANIMATION_CONFIG.REDUCED_MOTION) {
          underline.style.width = '100%';
        }
      });
      
      link.addEventListener('mouseleave', () => {
        if (underline && !ANIMATION_CONFIG.REDUCED_MOTION) {
          underline.style.width = '0%';
        }
      });
    });
  }
  
  /**
   * Animaciones de formularios
   */
  setupFormAnimations() {
    const formInputs = document.querySelectorAll('.form-input, .form-textarea');
    
    formInputs.forEach(input => {
      const parent = input.parentElement;
      
      input.addEventListener('focus', () => {
        parent.classList.add('focused');
        if (!ANIMATION_CONFIG.REDUCED_MOTION) {
          input.style.transform = 'translateY(-2px)';
        }
      });
      
      input.addEventListener('blur', () => {
        parent.classList.remove('focused');
        if (!ANIMATION_CONFIG.REDUCED_MOTION) {
          input.style.transform = 'translateY(0)';
        }
      });
    });
  }
  
  /**
   * Sistema de partículas simple
   */
  setupParticleSystem() {
    if (ANIMATION_CONFIG.PERFORMANCE_MODE || ANIMATION_CONFIG.REDUCED_MOTION) {
      return; // Skip partículas en modo performance
    }
    
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    // Crear contenedor de partículas
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
      z-index: 1;
    `;
    
    heroSection.style.position = 'relative';
    heroSection.appendChild(particleContainer);
    
    // Crear partículas
    this.createParticles(particleContainer, 20);
  }
  
  /**
   * Crear partículas animadas
   */
  createParticles(container, count) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const size = Math.random() * 4 + 2;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 2;
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, var(--color-primary) 0%, transparent 70%);
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        opacity: 0.3;
        animation: float ${duration}s ease-in-out infinite ${delay}s alternate;
      `;
      
      container.appendChild(particle);
    }
    
    // CSS para animación de partículas
    if (!document.getElementById('particle-styles')) {
      const style = document.createElement('style');
      style.id = 'particle-styles';
      style.textContent = `
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          100% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.6;
          }
        }
        
        .typing-cursor {
          animation: blink 1s infinite;
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  /**
   * Configurar animaciones personalizadas de scroll
   */
  setupCustomScrollAnimations() {
    // Contador animado
    this.setupCounterAnimation();
    
    // Progress bars animados
    this.setupProgressBarAnimation();
    
    // Stagger animations
    this.setupStaggerAnimations();
  }
  
  /**
   * Animación de contadores
   */
  setupCounterAnimation() {
    const counters = document.querySelectorAll('[data-counter]');
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
  }
  
  /**
   * Animar contador
   */
  animateCounter(element) {
    const target = parseInt(element.dataset.counter);
    const duration = parseInt(element.dataset.duration) || 2000;
    const start = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(target * easeOut);
      
      element.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = target.toLocaleString();
      }
    };
    
    requestAnimationFrame(animate);
  }
  
  /**
   * Animación de barras de progreso
   */
  setupProgressBarAnimation() {
    const progressBars = document.querySelectorAll('.progress-bar, .metric-fill');
    
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateProgressBar(entry.target);
          progressObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => {
      progressObserver.observe(bar);
    });
  }
  
  /**
   * Animar barra de progreso
   */
  animateProgressBar(element) {
    const targetWidth = element.style.width || element.dataset.progress + '%';
    element.style.width = '0%';
    element.style.transition = 'width 1.5s ease-out';
    
    requestAnimationFrame(() => {
      element.style.width = targetWidth;
    });
  }
  
  /**
   * Animaciones escalonadas
   */
  setupStaggerAnimations() {
    const staggerGroups = document.querySelectorAll('.stagger-animation');
    
    staggerGroups.forEach(group => {
      const children = group.children;
      const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateStaggerGroup(children);
            staggerObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      
      staggerObserver.observe(group);
    });
  }
  
  /**
   * Animar grupo con efecto escalonado
   */
  animateStaggerGroup(children) {
    Array.from(children).forEach((child, index) => {
      setTimeout(() => {
        child.classList.add('stagger-animated');
      }, index * 100);
    });
  }
  
  /**
   * Monitoreo de performance
   */
  startPerformanceMonitoring() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const monitor = (currentTime) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        this.performanceMetrics.fps = frameCount;
        this.performanceMetrics.frameTime = 1000 / frameCount;
        
        // Ajustar calidad si FPS es bajo
        if (this.performanceMetrics.fps < 30 && !ANIMATION_CONFIG.PERFORMANCE_MODE) {
          console.warn('⚡ FPS bajo detectado, activando modo performance');
          this.enablePerformanceMode();
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      this.performanceMetrics.lastFrameTime = currentTime;
      requestAnimationFrame(monitor);
    };
    
    requestAnimationFrame(monitor);
  }
  
  /**
   * Destructor
   */
  destroy() {
    // Desconectar observers
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    
    // Limpiar animaciones
    this.animations.clear();
    this.rafCallbacks.clear();
    
    console.log('📝 AnimationManager destruido correctamente');
  }
}

// ========================================
// UTILIDADES DE ANIMACIÓN
// ========================================
const AnimationUtils = {
  /**
   * Crear animación personalizada con RequestAnimationFrame
   */
  animate({ duration, timing, draw }) {
    const start = performance.now();
    
    return new Promise(resolve => {
      const animate = (time) => {
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;
        
        const progress = timing(timeFraction);
        draw(progress);
        
        if (timeFraction < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      
      requestAnimationFrame(animate);
    });
  },
  
  /**
   * Funciones de easing
   */
  easing: {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: t => t * t * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    bounce: t => {
      if (t < 1/2.75) return (7.5625*t*t);
      if (t < 2/2.75) return (7.5625*(t-=(1.5/2.75))*t + 0.75);
      if (t < 2.5/2.75) return (7.5625*(t-=(2.25/2.75))*t + 0.9375);
      return (7.5625*(t-=(2.625/2.75))*t + 0.984375);
    }
  },
  
  /**
   * Interpolación de valores
   */
  lerp(start, end, factor) {
    return start + (end - start) * factor;
  },
  
  /**
   * Mapear valor de un rango a otro
   */
  map(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }
};

// ========================================
// EXTENSIONES PARA LA CLASE PRINCIPAL
// ========================================
if (typeof PortfolioApp !== 'undefined') {
  // Métodos de animación para la clase principal
  PortfolioApp.prototype.createScrollToTopButton = function() {
    const button = document.createElement('button');
    button.className = 'scroll-to-top';
    button.innerHTML = '↑';
    button.setAttribute('aria-label', 'Volver al inicio');
    return button;
  };
  
  PortfolioApp.prototype.createProgressBar = function() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.width = '0%';
    return progressBar;
  };
  
  PortfolioApp.prototype.createToastContainer = function() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
  };
  
  PortfolioApp.prototype.updateProgressBar = function() {
    if (!this.elements.progressBar) return;
    
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    this.elements.progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
  };
  
  PortfolioApp.prototype.toggleScrollToTopButton = function(scrollTop) {
    if (!this.elements.scrollToTop) return;
    
    const threshold = CONFIG.SCROLL_THRESHOLD;
    const isVisible = scrollTop > threshold;
    
    this.elements.scrollToTop.classList.toggle('visible', isVisible);
  };
  
  PortfolioApp.prototype.updateStickyHeader = function(scrollTop) {
    const threshold = 100;
    this.elements.header.classList.toggle('scrolled', scrollTop > threshold);
  };
  
  PortfolioApp.prototype.handleParallaxEffects = function(scrollTop) {
    if (ANIMATION_CONFIG.PERFORMANCE_MODE || ANIMATION_CONFIG.REDUCED_MOTION) return;
    
    const parallaxElements = document.querySelectorAll('.parallax-element');
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallaxSpeed) || 0.5;
      const yPos = scrollTop * speed;
      el.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
  };
  
  PortfolioApp.prototype.initializeTypingEffect = function(element) {
    if (window.animationManager) {
      window.animationManager.startTypingEffect(element);
    }
  };
  
  PortfolioApp.prototype.updateActiveNavigation = function(sectionId) {
    this.state.currentSection = sectionId;
    
    this.elements.navLinks.forEach(link => {
      const href = link.getAttribute('href').substring(1);
      link.classList.toggle('active', href === sectionId);
    });
  };
  
  PortfolioApp.prototype.recalculateLayout = function() {
    // Recalcular posiciones después de resize
    const parallaxElements = document.querySelectorAll('.parallax-element');
    if (parallaxElements.length > 0 && window.animationManager) {
      window.animationManager.updateParallaxEffects(parallaxElements);
    }
  };
  
  PortfolioApp.prototype.handleKeyNavigation = function(e) {
    // Navegación por teclado
    if (e.key === 'Escape' && this.state.isMenuOpen) {
      this.closeMobileMenu();
    }
  };
  
  PortfolioApp.prototype.updateAriaLabels = function() {
    // Actualizar ARIA labels dinámicamente
    const currentTime = new Date().toLocaleTimeString('es-ES');
    document.documentElement.setAttribute('data-updated', currentTime);
  };
  
  PortfolioApp.prototype.initializeTooltips = function() {
    // Inicializar tooltips si existen
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(el => {
      el.setAttribute('title', el.dataset.tooltip);
    });
  };
}

// ========================================
// INICIALIZACIÓN AUTOMÁTICA
// ========================================
let animationManager;

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAnimationManager);
} else {
  initializeAnimationManager();
}

function initializeAnimationManager() {
  try {
    animationManager = new AnimationManager();
    
    // Hacer disponible globalmente
    if (typeof window !== 'undefined') {
      window.animationManager = animationManager;
      window.AnimationUtils = AnimationUtils;
      window.ANIMATION_CONFIG = ANIMATION_CONFIG;
    }
    
    console.log('✅ AnimationManager inicializado y disponible globalmente');
  } catch (error) {
    console.error('❌ Error inicializando AnimationManager:', error);
  }
}

// ========================================
// EXPORTAR PARA MÓDULOS
// ========================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AnimationManager, AnimationUtils, ANIMATION_CONFIG };
}