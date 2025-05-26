/**
 * ========================================
 * PORTFOLIO PROFESIONAL - MAIN JAVASCRIPT
 * ========================================
 * Arquitectura modular con ES6+ y mejores prácticas
 * Autor: Tu Nombre
 * Versión: 1.0.0
 */

// ========================================
// CONFIGURACIÓN GLOBAL Y CONSTANTES
// ========================================
const CONFIG = {
  // Configuración de la aplicación
  API_BASE_URL: window.location.hostname === 'localhost' ? 
    'http://localhost:3000/api' : '/api',
  
  // Configuración de animaciones
  ANIMATION_DURATION: 300,
  SCROLL_THRESHOLD: 100,
  TYPING_SPEED: 50,
  
  // Configuración de formularios
  FORM_VALIDATION_DELAY: 300,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  
  // Configuración de UI
  MOBILE_BREAKPOINT: 768,
  TOAST_DURATION: 5000,
  DEBOUNCE_DELAY: 250,
  
  // Selectores principales
  SELECTORS: {
    header: '.header',
    navMenu: '.nav-menu',
    navToggle: '.nav-toggle',
    navLinks: '.nav-link',
    contactForm: '#contact-form',
    projectsContainer: '#projects-container',
    scrollToTop: '.scroll-to-top',
    progressBar: '.progress-bar'
  }
};

// ========================================
// CLASE PRINCIPAL DE LA APLICACIÓN
// ========================================
class PortfolioApp {
  constructor() {
    this.state = {
      isMenuOpen: false,
      currentSection: 'home',
      isScrolling: false,
      windowWidth: window.innerWidth,
      scrollPosition: 0,
      theme: localStorage.getItem('theme') || 'light'
    };
    
    this.elements = {};
    this.observers = new Map();
    this.debounceTimers = new Map();
    
    this.init();
  }
  
  /**
   * Inicialización principal de la aplicación
   */
  async init() {
    try {
      // Esperar a que el DOM esté completamente cargado
      if (document.readyState === 'loading') {
        await this.waitForDOMReady();
      }
      
      // Configurar elementos y eventos
      this.setupElements();
      this.setupEventListeners();
      this.setupIntersectionObserver();
      this.setupFormValidation();
      
      // Inicializar funcionalidades
      this.initializeUI();
      this.initializeAnimations();
      this.initializeProgressBar();
      
      // Cargar datos dinámicos
    
      
      console.log('✅ Portfolio App inicializada correctamente');
    } catch (error) {
      console.error('❌ Error inicializando la aplicación:', error);
      this.showToast('Error al cargar la aplicación', 'error');
    }
  }
  
  /**
   * Esperar a que el DOM esté completamente cargado
   */
  waitForDOMReady() {
    return new Promise(resolve => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        document.addEventListener('DOMContentLoaded', resolve);
      }
    });
  }
  
  /**
   * Configurar referencias a elementos del DOM
   */
  setupElements() {
    // Elementos principales
    this.elements.header = document.querySelector(CONFIG.SELECTORS.header);
    this.elements.navMenu = document.querySelector(CONFIG.SELECTORS.navMenu);
    this.elements.navToggle = document.querySelector(CONFIG.SELECTORS.navToggle);
    this.elements.navLinks = document.querySelectorAll(CONFIG.SELECTORS.navLinks);
    this.elements.contactForm = document.querySelector(CONFIG.SELECTORS.contactForm);
    this.elements.projectsContainer = document.querySelector(CONFIG.SELECTORS.projectsContainer);
    
    // Elementos de UI
    this.elements.scrollToTop = this.createScrollToTopButton();
    this.elements.progressBar = this.createProgressBar();
    this.elements.toastContainer = this.createToastContainer();
    
    // Validar elementos críticos
    const criticalElements = ['header', 'navMenu', 'navToggle'];
    const missingElements = criticalElements.filter(key => !this.elements[key]);
    
    if (missingElements.length > 0) {
      throw new Error(`Elementos críticos no encontrados: ${missingElements.join(', ')}`);
    }
  }
  
  /**
   * Configurar event listeners principales
   */
  setupEventListeners() {
    // Navegación móvil
    this.elements.navToggle?.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleMobileMenu();
    });
    
    // Enlaces de navegación
    this.elements.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        this.scrollToSection(targetId);
        this.closeMobileMenu();
      });
    });
    
    // Eventos de scroll con debounce
    window.addEventListener('scroll', this.debounce(() => {
      this.handleScroll();
    }, CONFIG.DEBOUNCE_DELAY));
    
    // Eventos de resize con debounce
    window.addEventListener('resize', this.debounce(() => {
      this.handleResize();
    }, CONFIG.DEBOUNCE_DELAY));
    
    // Scroll to top button
    this.elements.scrollToTop?.addEventListener('click', (e) => {
      e.preventDefault();
      this.scrollToTop();
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (this.state.isMenuOpen && 
          !this.elements.navMenu.contains(e.target) && 
          !this.elements.navToggle.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
    
    // Navegación por teclado
    document.addEventListener('keydown', (e) => {
      this.handleKeyNavigation(e);
    });
    
    // Prevenir comportamiento por defecto en enlaces anchor
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href').substring(1);
        if (targetId) {
          this.scrollToSection(targetId);
        }
      });
    });
  }
  
  /**
   * Configurar Intersection Observer para animaciones en scroll
   */
  setupIntersectionObserver() {
    // Observer para elementos animados
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          animationObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '-50px'
    });
    
    // Observer para navegación activa
    const navigationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.updateActiveNavigation(entry.target.id);
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '-100px'
    });
    
    // Aplicar observers
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      animationObserver.observe(el);
    });
    
    document.querySelectorAll('section[id]').forEach(section => {
      navigationObserver.observe(section);
    });
    
    this.observers.set('animation', animationObserver);
    this.observers.set('navigation', navigationObserver);
  }
  
  /**
   * Configurar validación de formularios
   */
  setupFormValidation() {
    if (!this.elements.contactForm) return;
    
    // Validación en tiempo real
    const inputs = this.elements.contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });
      
      input.addEventListener('input', this.debounce(() => {
        if (input.classList.contains('error')) {
          this.validateField(input);
        }
      }, CONFIG.FORM_VALIDATION_DELAY));
    });
    
    // Envío del formulario
    this.elements.contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleFormSubmit(e);
    });
  }
  
  /**
   * Inicializar elementos de UI
   */
  initializeUI() {
    // Configurar tema inicial
    document.documentElement.setAttribute('data-theme', this.state.theme);
    
    // Inicializar estado de navegación móvil
    this.elements.navToggle.setAttribute('aria-expanded', 'false');
    this.elements.navMenu.setAttribute('aria-hidden', 'true');
    
    // Configurar ARIA labels dinámicos
    this.updateAriaLabels();
    
    // Inicializar tooltips si existen
    this.initializeTooltips();
  }
  
  /**
   * Inicializar animaciones
   */
  initializeAnimations() {
    // Añadir clases de animación inicial
    document.querySelectorAll('.animate-on-scroll').forEach((el, index) => {
      el.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Inicializar efecto de escritura si existe
    const typingElements = document.querySelectorAll('[data-typing]');
    typingElements.forEach(el => {
      this.initializeTypingEffect(el);
    });
  }
  
  /**
   * Inicializar barra de progreso
   */
  initializeProgressBar() {
    if (!this.elements.progressBar) return;
    
    document.body.appendChild(this.elements.progressBar);
    this.updateProgressBar();
  }
  
  /**
   * Cargar proyectos dinámicamente
   */
  async loadProjects() {
    if (!this.elements.projectsContainer) return;
    
    try {
      // Mostrar skeleton loading
      this.showProjectSkeletons();
      
      // Cargar datos de proyectos
      const projects = await this.fetchProjects();
      
      // Renderizar proyectos
      this.renderProjects(projects);
      
      // Inicializar filtros
      this.initializeProjectFilters();
      
    } catch (error) {
      console.error('Error cargando proyectos:', error);
      this.showProjectError();
    }
  }
  
  /**
   * Mostrar skeletons de carga para proyectos
   */
  showProjectSkeletons() {
    if (!this.elements.projectsContainer) return;
    
    const skeletonHTML = Array(6).fill().map(() => `
      <div class="project-card skeleton-card">
        <div class="skeleton skeleton-image"></div>
        <div class="project-content">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="project-tech">
            <div class="skeleton skeleton-tag"></div>
            <div class="skeleton skeleton-tag"></div>
            <div class="skeleton skeleton-tag"></div>
          </div>
        </div>
      </div>
    `).join('');
    
    this.elements.projectsContainer.innerHTML = skeletonHTML;
  }
  
  /**
   * Mostrar error de carga de proyectos
   */
  showProjectError() {
    if (!this.elements.projectsContainer) return;
    
    this.elements.projectsContainer.innerHTML = `
      <div class="projects-error" style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--spacing-3xl);
        text-align: center;
        color: var(--color-text-secondary);
      ">
        <div class="error-icon" style="font-size: 3rem; margin-bottom: var(--spacing-base);">⚠️</div>
        <h3 style="margin-bottom: var(--spacing-base);">Error al cargar proyectos</h3>
        <p style="margin-bottom: var(--spacing-lg);">No se pudieron cargar los proyectos. Por favor, intenta más tarde.</p>
        <button class="btn btn-primary" onclick="location.reload()">Reintentar</button>
      </div>
    `;
  }
  
  /**
   * Obtener datos de proyectos
   */
  async fetchProjects() {
    // Simulación de carga de datos - reemplazar con API real
    return new Promise(resolve => {
      setTimeout(() => {
        // Si hay datos disponibles globalmente, usarlos
        const projectsData = window.PROJECTS_DATA || [
          {
            id: 1,
            title: "Proyecto de Ejemplo",
            description: "Este es un proyecto de ejemplo para demostrar la funcionalidad.",
            image: "./assets/images/projects/example.jpg",
            technologies: ["HTML", "CSS", "JavaScript"],
            category: "frontend",
            status: "completed",
            date: "2024-12-15",
            demoUrl: "#",
            githubUrl: "#"
          }
        ];
        resolve(projectsData);
      }, 1000);
    });
  }
  
  /**
   * Renderizar proyectos en el DOM
   */
  renderProjects(projects) {
    if (!this.elements.projectsContainer || !projects.length) {
      this.showEmptyProjectsState();
      return;
    }
    
    this.elements.projectsContainer.innerHTML = projects.map(project => 
      this.createProjectCard(project)
    ).join('');
    
    // Configurar event listeners para tarjetas de proyecto
    this.setupProjectEventListeners();
  }
  
  /**
   * Crear tarjeta HTML de proyecto
   */
  createProjectCard(project) {
    const statusClass = `project-status ${project.status}`;
    const statusText = {
      'completed': 'Completado',
      'in-progress': 'En Progreso',
      'planned': 'Planeado'
    }[project.status] || 'Desconocido';
    
    const techTags = project.technologies.map(tech => 
      `<span class="tech-tag">${tech}</span>`
    ).join('');
    
    const featuredBadge = project.featured ? 
      '<div class="featured-badge">⭐ Destacado</div>' : '';
    
    // Crear placeholder SVG en lugar de imagen externa
    const placeholderSVG = `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="16" fill="#6b7280">
          Imagen del Proyecto
        </text>
      </svg>
    `)}`;
    
    return `
      <article class="project-card animate-on-scroll" data-project-id="${project.id}" data-category="${project.category}">
        ${featuredBadge}
        <div class="project-image">
          <img src="${project.image || placeholderSVG}" 
               alt="${project.title}" 
               loading="lazy" 
               onerror="this.src='${placeholderSVG}'; this.onerror=null;">
          <div class="project-overlay">
            <div class="project-overlay-content">
              <div class="project-links">
                ${project.demoUrl ? `<a href="${project.demoUrl}" class="project-link" target="_blank" rel="noopener" aria-label="Ver demo de ${project.title}">🔗</a>` : ''}
                ${project.githubUrl ? `<a href="${project.githubUrl}" class="project-link" target="_blank" rel="noopener" aria-label="Ver código en GitHub">💻</a>` : ''}
                <button class="project-link project-details-btn" aria-label="Ver detalles de ${project.title}">ℹ️</button>
              </div>
            </div>
          </div>
        </div>
        <div class="project-content">
          <h3 class="project-title">${project.title}</h3>
          <p class="project-description">${project.description}</p>
          <div class="project-tech">
            ${techTags}
          </div>
          <div class="project-footer">
            <span class="project-date">${this.formatDate(project.date)}</span>
            <span class="${statusClass}">${statusText}</span>
          </div>
        </div>
      </article>
    `;
  }
  
  /**
   * Mostrar estado vacío de proyectos
   */
  showEmptyProjectsState() {
    if (!this.elements.projectsContainer) return;
    
    this.elements.projectsContainer.innerHTML = `
      <div class="empty-projects-state" style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--spacing-3xl);
        text-align: center;
        color: var(--color-text-secondary);
      ">
        <div class="empty-icon" style="font-size: 3rem; margin-bottom: var(--spacing-base);">📁</div>
        <h3 style="margin-bottom: var(--spacing-base);">No hay proyectos disponibles</h3>
        <p>Los proyectos se cargarán pronto. ¡Mantente atento!</p>
      </div>
    `;
  }
  
  /**
   * Inicializar filtros de proyecto
   */
  initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Actualizar botones activos
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Aplicar filtro
        const filter = btn.getAttribute('data-filter');
        this.filterProjects(filter);
      });
    });
  }
  
  /**
   * Filtrar proyectos por categoría
   */
  filterProjects(category) {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const shouldShow = category === 'all' || cardCategory === category;
      
      if (shouldShow) {
        card.classList.remove('hidden');
        card.style.display = 'flex';
      } else {
        card.classList.add('hidden');
        setTimeout(() => {
          if (card.classList.contains('hidden')) {
            card.style.display = 'none';
          }
        }, 300);
      }
    });
  }
  
  /**
   * Configurar eventos de proyecto
   */
  setupProjectEventListeners() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      // Hover effects
      card.addEventListener('mouseenter', () => {
        if (!window.ANIMATION_CONFIG?.REDUCED_MOTION) {
          card.style.transform = 'translateY(-8px) scale(1.02)';
        }
      });
      
      card.addEventListener('mouseleave', () => {
        if (!window.ANIMATION_CONFIG?.REDUCED_MOTION) {
          card.style.transform = 'translateY(0) scale(1)';
        }
      });
      
      // Click para ver detalles
      card.addEventListener('click', (e) => {
        if (!e.target.closest('a, button')) {
          const projectId = parseInt(card.getAttribute('data-project-id'));
          console.log(`Ver detalles del proyecto ${projectId}`);
          // Aquí se podría abrir un modal con más detalles
        }
      });
    });
    
    // Botones de detalles específicos
    document.querySelectorAll('.project-details-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const card = btn.closest('.project-card');
        const projectId = parseInt(card.getAttribute('data-project-id'));
        console.log(`Mostrar modal del proyecto ${projectId}`);
        // Aquí se abriría el modal de detalles
      });
    });
  }
  
  /**
   * Formatear fecha para mostrar
   */
  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString; // Devolver string original si hay error
    }
  }
  
  /**
   * Renderizar proyectos en el DOM
   */
  renderProjects(projects) {
    if (!this.elements.projectsContainer || !projects.length) return;
    
    this.elements.projectsContainer.innerHTML = projects.map(project => 
      this.createProjectCard(project)
    ).join('');
    
    // Configurar event listeners para tarjetas de proyecto
    this.setupProjectEventListeners();
  }
  
  /**
   * Manejar eventos de scroll
   */
  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    this.state.scrollPosition = scrollTop;
    
    // Actualizar header sticky
    this.updateStickyHeader(scrollTop);
    
    // Actualizar barra de progreso
    this.updateProgressBar();
    
    // Mostrar/ocultar botón scroll to top
    this.toggleScrollToTopButton(scrollTop);
    
    // Parallax effects si están habilitados
    this.handleParallaxEffects(scrollTop);
  }
  
  /**
   * Manejar eventos de resize
   */
  handleResize() {
    const newWidth = window.innerWidth;
    const wasDesktop = this.state.windowWidth >= CONFIG.MOBILE_BREAKPOINT;
    const isDesktop = newWidth >= CONFIG.MOBILE_BREAKPOINT;
    
    this.state.windowWidth = newWidth;
    
    // Cerrar menú móvil si se cambia a desktop
    if (wasDesktop !== isDesktop && isDesktop && this.state.isMenuOpen) {
      this.closeMobileMenu();
    }
    
    // Recalcular posiciones y tamaños
    this.recalculateLayout();
  }
  
  /**
   * Función debounce utility
   */
  debounce(func, delay) {
    return (...args) => {
      const key = func.name || 'anonymous';
      clearTimeout(this.debounceTimers.get(key));
      this.debounceTimers.set(key, setTimeout(() => func.apply(this, args), delay));
    };
  }
  
  /**
   * Alternar menú móvil
   */
  toggleMobileMenu() {
    this.state.isMenuOpen = !this.state.isMenuOpen;
    
    this.elements.navToggle.classList.toggle('active', this.state.isMenuOpen);
    this.elements.navMenu.classList.toggle('active', this.state.isMenuOpen);
    
    // Actualizar ARIA attributes
    this.elements.navToggle.setAttribute('aria-expanded', this.state.isMenuOpen);
    this.elements.navMenu.setAttribute('aria-hidden', !this.state.isMenuOpen);
    
    // Prevenir scroll del body cuando el menú está abierto
    document.body.style.overflow = this.state.isMenuOpen ? 'hidden' : '';
  }
  
  /**
   * Cerrar menú móvil
   */
  closeMobileMenu() {
    if (this.state.isMenuOpen) {
      this.toggleMobileMenu();
    }
  }
  
  /**
   * Scroll suave a sección
   */
  scrollToSection(targetId) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;
    
    const headerHeight = this.elements.header?.offsetHeight || 0;
    const targetPosition = targetElement.offsetTop - headerHeight - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
    
    // Actualizar estado
    this.state.currentSection = targetId;
  }
  
  /**
   * Scroll al inicio
   */
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  
  /**
   * Mostrar toast notification
   */
  showToast(message, type = 'info', duration = CONFIG.TOAST_DURATION) {
    const toast = this.createToastElement(message, type);
    this.elements.toastContainer.appendChild(toast);
    
    // Mostrar toast
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    
    // Auto-remover toast
    setTimeout(() => {
      this.removeToast(toast);
    }, duration);
    
    return toast;
  }
  
  /**
   * Validar campo de formulario individual
   */
  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const name = field.name;
    const errorElement = document.getElementById(`${name}-error`);
    
    let isValid = true;
    let errorMessage = '';
    
    // Validaciones básicas
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'Este campo es obligatorio';
    } else if (type === 'email' && value && !this.isValidEmail(value)) {
      isValid = false;
      errorMessage = 'Por favor ingresa un email válido';
    } else if (name === 'name' && value && value.length < 2) {
      isValid = false;
      errorMessage = 'El nombre debe tener al menos 2 caracteres';
    } else if (name === 'subject' && value && value.length < 5) {
      isValid = false;
      errorMessage = 'El asunto debe tener al menos 5 caracteres';
    } else if (name === 'message' && value && value.length < 10) {
      isValid = false;
      errorMessage = 'El mensaje debe tener al menos 10 caracteres';
    }
    
    // Actualizar UI
    field.classList.toggle('error', !isValid);
    
    if (errorElement) {
      errorElement.textContent = errorMessage;
      errorElement.classList.toggle('show', !isValid);
    }
    
    return isValid;
  }
  
  /**
   * Validar email con regex
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Manejar envío del formulario
   */
  async handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    
    // Validar todos los campos
    const inputs = form.querySelectorAll('input, textarea');
    let isFormValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });
    
    if (!isFormValid) {
      this.showToast('Por favor corrige los errores en el formulario', 'error');
      return;
    }
    
    // Mostrar estado de carga
    submitButton.classList.add('loading');
    
    try {
      // Enviar datos al servidor
      const response = await this.submitContactForm(formData);
      
      if (response.success) {
        this.showToast('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
        form.reset();
        this.clearFormErrors();
      } else {
        throw new Error(response.message || 'Error enviando el formulario');
      }
    } catch (error) {
      console.error('Error enviando formulario:', error);
      this.showToast('Error al enviar el mensaje. Por favor intenta más tarde.', 'error');
    } finally {
      submitButton.classList.remove('loading');
    }
  }
  
  /**
   * Enviar formulario de contacto al servidor
   */
  async submitContactForm(formData) {
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      language: navigator.language
    };
    
    const response = await fetch(`${CONFIG.API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
  
  /**
   * Limpiar errores del formulario
   */
  clearFormErrors() {
    const errorElements = document.querySelectorAll('.form-error');
    const inputElements = document.querySelectorAll('.form-input, .form-textarea');
    
    errorElements.forEach(error => {
      error.classList.remove('show');
      error.textContent = '';
    });
    
    inputElements.forEach(input => {
      input.classList.remove('error');
    });
  }
  
  /**
   * Crear elemento de toast
   */
  createToastElement(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    
    const titles = {
      success: 'Éxito',
      error: 'Error',
      warning: 'Advertencia',
      info: 'Información'
    };
    
    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-content">
        <div class="toast-title">${titles[type] || titles.info}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Cerrar notificación">×</button>
    `;
    
    // Event listener para cerrar
    const closeButton = toast.querySelector('.toast-close');
    closeButton.addEventListener('click', () => {
      this.removeToast(toast);
    });
    
    return toast;
  }
  
  /**
   * Remover toast con animación
   */
  removeToast(toast) {
    toast.classList.remove('show');
    toast.style.transform = 'translateX(100%)';
    
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 300);
  }
  
  /**
   * Crear contenedor de toast si no existe
   */
  createToastContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }
  
  /**
   * Crear botón scroll to top
   */
  createScrollToTopButton() {
    const button = document.createElement('button');
    button.className = 'scroll-to-top';
    button.innerHTML = '↑';
    button.setAttribute('aria-label', 'Volver al inicio');
    document.body.appendChild(button);
    return button;
  }
  
  /**
   * Crear barra de progreso
   */
  createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.width = '0%';
    return progressBar;
  }
  
  /**
   * Actualizar barra de progreso
   */
  updateProgressBar() {
    if (!this.elements.progressBar) return;
    
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    
    this.elements.progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
  }
  
  /**
   * Mostrar/ocultar botón scroll to top
   */
  toggleScrollToTopButton(scrollTop) {
    if (!this.elements.scrollToTop) return;
    
    const threshold = CONFIG.SCROLL_THRESHOLD;
    const isVisible = scrollTop > threshold;
    
    this.elements.scrollToTop.classList.toggle('visible', isVisible);
  }
  
  /**
   * Actualizar header sticky
   */
  updateStickyHeader(scrollTop) {
    const threshold = 100;
    this.elements.header?.classList.toggle('scrolled', scrollTop > threshold);
  }
  
  /**
   * Manejar efectos parallax
   */
  handleParallaxEffects(scrollTop) {
    if (window.ANIMATION_CONFIG?.PERFORMANCE_MODE || window.ANIMATION_CONFIG?.REDUCED_MOTION) {
      return;
    }
    
    const parallaxElements = document.querySelectorAll('.parallax-element');
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallaxSpeed) || 0.5;
      const yPos = scrollTop * speed;
      el.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
  }
  
  /**
   * Actualizar navegación activa
   */
  updateActiveNavigation(sectionId) {
    this.state.currentSection = sectionId;
    
    this.elements.navLinks.forEach(link => {
      const href = link.getAttribute('href').substring(1);
      link.classList.toggle('active', href === sectionId);
    });
  }
  
  /**
   * Recalcular layout después de resize
   */
  recalculateLayout() {
    // Recalcular posiciones de elementos
    const parallaxElements = document.querySelectorAll('.parallax-element');
    if (parallaxElements.length > 0 && window.animationManager) {
      window.animationManager.updateParallaxEffects(parallaxElements);
    }
    
    // Actualizar contenedores responsive
    this.updateResponsiveContainers();
  }
  
  /**
   * Actualizar contenedores responsive
   */
  updateResponsiveContainers() {
    const containers = document.querySelectorAll('.responsive-container');
    containers.forEach(container => {
      const breakpoint = container.dataset.breakpoint || CONFIG.MOBILE_BREAKPOINT;
      const isMobile = this.state.windowWidth < breakpoint;
      container.classList.toggle('is-mobile', isMobile);
      container.classList.toggle('is-desktop', !isMobile);
    });
  }
  
  /**
   * Manejar navegación por teclado
   */
  handleKeyNavigation(e) {
    // Cerrar menú con Escape
    if (e.key === 'Escape' && this.state.isMenuOpen) {
      this.closeMobileMenu();
    }
    
    // Navegación por flechas en elementos focalizables
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      this.handleArrowNavigation(e);
    }
    
    // Atajos de teclado
    if (e.ctrlKey || e.metaKey) {
      this.handleKeyboardShortcuts(e);
    }
  }
  
  /**
   * Manejar navegación con flechas
   */
  handleArrowNavigation(e) {
    const focusableElements = document.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
    
    if (currentIndex >= 0) {
      e.preventDefault();
      const nextIndex = e.key === 'ArrowDown' ? 
        Math.min(currentIndex + 1, focusableElements.length - 1) :
        Math.max(currentIndex - 1, 0);
      
      focusableElements[nextIndex]?.focus();
    }
  }
  
  /**
   * Manejar atajos de teclado
   */
  handleKeyboardShortcuts(e) {
    const shortcuts = {
      'KeyH': () => this.scrollToSection('home'),
      'KeyA': () => this.scrollToSection('about'),
      'KeyP': () => this.scrollToSection('projects'),
      'KeyC': () => this.scrollToSection('contact'),
      'KeyT': () => this.scrollToTop()
    };
    
    const shortcut = shortcuts[e.code];
    if (shortcut) {
      e.preventDefault();
      shortcut();
    }
  }
  
  /**
   * Actualizar labels ARIA dinámicamente
   */
  updateAriaLabels() {
    const currentTime = new Date().toLocaleTimeString('es-ES');
    document.documentElement.setAttribute('data-updated', currentTime);
    
    // Actualizar contadores ARIA
    const counters = document.querySelectorAll('[data-counter]');
    counters.forEach(counter => {
      const value = counter.textContent;
      counter.setAttribute('aria-label', `Contador: ${value}`);
    });
  }
  
  /**
   * Inicializar tooltips
   */
  initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(el => {
      el.setAttribute('title', el.dataset.tooltip);
      el.setAttribute('aria-label', el.dataset.tooltip);
    });
  }
  
  /**
   * Inicializar efecto de escritura
   */
  initializeTypingEffect(element) {
    if (window.animationManager) {
      window.animationManager.startTypingEffect(element);
    }
  }
  
  /**
   * Configurar trap de foco para modal
   */
  setupModalFocusTrap() {
    const modal = this.elements.modal;
    if (!modal) return;
    
    const focusableElements = modal.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    });
    
    // Enfocar primer elemento
    firstElement?.focus();
  }
  
  /**
   * Cleanup y destructor
   */
  destroy() {
    // Limpiar observers
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    
    // Limpiar timers
    this.debounceTimers.forEach(timer => {
      clearTimeout(timer);
    });
    
    // Restaurar estilos del body
    document.body.style.overflow = '';
    
    // Remover event listeners
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    
    console.log('📝 Portfolio App destruida correctamente');
  }
}

// ========================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ========================================

/**
 * Inicializar aplicación cuando el DOM esté listo
 */
let portfolioApp;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

function initializeApp() {
  try {
    portfolioApp = new PortfolioApp();
    
    // Hacer la instancia disponible globalmente para debugging
    if (typeof window !== 'undefined') {
      window.portfolioApp = portfolioApp;
    }
  } catch (error) {
    console.error('❌ Error crítico inicializando la aplicación:', error);
    
    // Fallback básico si falla la inicialización
    initializeFallback();
  }
}

/**
 * Funcionalidad básica si falla la inicialización principal
 */
function initializeFallback() {
  console.log('🔄 Inicializando funcionalidad básica...');
  
  // Navegación básica
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  
  // Menú móvil básico
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }
}

// ========================================
// MANEJO DE ERRORES GLOBALES
// ========================================
window.addEventListener('error', (e) => {
  console.error('Error global capturado:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Promise rechazado sin manejar:', e.reason);
});

// ========================================
// EXPORTAR PARA MÓDULOS
// ========================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PortfolioApp, CONFIG };
}