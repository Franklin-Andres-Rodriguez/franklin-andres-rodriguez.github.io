/**
 * ========================================
 * MÓDULO DE GESTIÓN DE PROYECTOS
 * ========================================
 * Manejo avanzado de portfolio de proyectos
 * Filtrado, búsqueda, modal y lazy loading
 */

/**
 * ========================================
 * PROYECTOS DE FRANKLIN ANDRÉS RODRÍGUEZ
 * ========================================
 * Portfolio personalizado con proyectos reales
 * Basado en: https://franklin-andres-rodriguez.github.io/mini-proyectos-web/
 */

// ========================================
// DATOS DE PROYECTOS PERSONALIZADOS
// ========================================
const PROJECTS_DATA = [
  {
    id: 1,
    title: "Mini Proyectos Web Collection",
    description: "Colección de mini proyectos web desarrollados para practicar y demostrar habilidades en desarrollo frontend.",
    longDescription: "Una colección completa de mini proyectos web que incluye diferentes ejercicios de programación, desde calculadoras interactivas hasta juegos simples, cada uno enfocado en técnicas específicas de desarrollo web moderno.",
    image: "./assets/images/projects/mini-proyectos-collection.jpg",
    technologies: ["HTML5", "CSS3", "JavaScript", "DOM Manipulation", "Local Storage"],
    category: "frontend",
    status: "completed",
    date: "2024-11-30",
    demoUrl: "https://franklin-andres-rodriguez.github.io/mini-proyectos-web/",
    githubUrl: "https://github.com/franklin-andres-rodriguez/mini-proyectos-web",
    featured: true,
    metrics: {
      performance: 92,
      accessibility: 88,
      seo: 85,
      bestPractices: 90
    }
  },
  {
    id: 2,
    title: "Calculadora Interactiva",
    description: "Calculadora web moderna con interfaz intuitiva y funcionalidades matemáticas básicas.",
    longDescription: "Calculadora desarrollada con JavaScript puro que incluye operaciones básicas, manejo de decimales, y una interfaz moderna responsive. Implementa patrones de diseño para manejo de estado y validación de entradas.",
    image: "./assets/images/projects/calculadora.jpg",
    technologies: ["HTML5", "CSS3", "JavaScript", "Grid Layout", "Event Handling"],
    category: "frontend",
    status: "completed",
    date: "2024-10-15",
    demoUrl: "https://franklin-andres-rodriguez.github.io/mini-proyectos-web/calculadora/",
    githubUrl: "https://github.com/franklin-andres-rodriguez/mini-proyectos-web/tree/main/calculadora",
    featured: false
  },
  {
    id: 3,
    title: "Juego de Memoria",
    description: "Juego interactivo de memoria que desafía la capacidad de recordar secuencias de colores.",
    longDescription: "Juego de memoria implementado con JavaScript vanilla que genera secuencias aleatorias de colores que el usuario debe recordar y reproducir. Incluye sistema de puntuación, niveles de dificultad y efectos visuales.",
    image: "./assets/images/projects/juego-memoria.jpg",
    technologies: ["HTML5", "CSS3", "JavaScript", "Animations", "Game Logic"],
    category: "frontend",
    status: "completed",
    date: "2024-09-28",
    demoUrl: "https://franklin-andres-rodriguez.github.io/mini-proyectos-web/memoria/",
    githubUrl: "https://github.com/franklin-andres-rodriguez/mini-proyectos-web/tree/main/memoria",
    featured: true
  },
  {
    id: 4,
    title: "Lista de Tareas Inteligente",
    description: "Aplicación de gestión de tareas con persistencia local y funcionalidades avanzadas.",
    longDescription: "Todo App completo con funcionalidades como agregar, editar, marcar como completadas y eliminar tareas. Utiliza Local Storage para persistencia de datos y incluye filtros por estado y búsqueda en tiempo real.",
    image: "./assets/images/projects/todo-app.jpg",
    technologies: ["HTML5", "CSS3", "JavaScript", "Local Storage", "CRUD Operations"],
    category: "frontend",
    status: "completed",
    date: "2024-09-10",
    demoUrl: "https://franklin-andres-rodriguez.github.io/mini-proyectos-web/todo/",
    githubUrl: "https://github.com/franklin-andres-rodriguez/mini-proyectos-web/tree/main/todo",
    featured: false
  },
  {
    id: 5,
    title: "Generador de Colores",
    description: "Herramienta para generar paletas de colores aleatorias con códigos hexadecimales.",
    longDescription: "Aplicación web que genera paletas de colores aleatorias y permite copiar códigos hexadecimales al portapapeles. Incluye opciones para generar diferentes tipos de esquemas de colores y vista previa en tiempo real.",
    image: "./assets/images/projects/color-generator.jpg",
    technologies: ["HTML5", "CSS3", "JavaScript", "Color Theory", "Clipboard API"],
    category: "frontend",
    status: "completed",
    date: "2024-08-22",
    demoUrl: "https://franklin-andres-rodriguez.github.io/mini-proyectos-web/colores/",
    githubUrl: "https://github.com/franklin-andres-rodriguez/mini-proyectos-web/tree/main/colores",
    featured: false
  },
  {
    id: 6,
    title: "Reloj Digital Avanzado",
    description: "Reloj digital con múltiples zonas horarias y funcionalidades de cronómetro.",
    longDescription: "Aplicación de reloj digital que muestra la hora actual con precisión, incluye funcionalidades de cronómetro, temporizador y soporte para múltiples zonas horarias. Diseño moderno con opciones de personalización visual.",
    image: "./assets/images/projects/reloj-digital.jpg",
    technologies: ["HTML5", "CSS3", "JavaScript", "Date API", "Timers"],
    category: "frontend",
    status: "completed",
    date: "2024-08-05",
    demoUrl: "https://franklin-andres-rodriguez.github.io/mini-proyectos-web/reloj/",
    githubUrl: "https://github.com/franklin-andres-rodriguez/mini-proyectos-web/tree/main/reloj",
    featured: false
  },
  {
    id: 7,
    title: "Quiz Interactivo JavaScript",
    description: "Quiz de conocimientos de JavaScript con puntuación y retroalimentación instantánea.",
    longDescription: "Aplicación de quiz interactivo sobre conceptos de JavaScript que incluye preguntas de opción múltiple, sistema de puntuación en tiempo real, retroalimentación inmediata y estadísticas finales de rendimiento.",
    image: "./assets/images/projects/js-quiz.jpg",
    technologies: ["HTML5", "CSS3", "JavaScript", "JSON", "Dynamic Content"],
    category: "frontend",
    status: "completed",
    date: "2024-07-18",
    demoUrl: "https://franklin-andres-rodriguez.github.io/mini-proyectos-web/quiz/",
    githubUrl: "https://github.com/franklin-andres-rodriguez/mini-proyectos-web/tree/main/quiz",
    featured: true
  },
  {
    id: 8,
    title: "Simulador de Clima",
    description: "Aplicación que simula diferentes condiciones climáticas con efectos visuales.",
    longDescription: "Simulador de clima interactivo que muestra diferentes condiciones meteorológicas con animaciones CSS avanzadas. Incluye efectos de lluvia, nieve, sol y tormenta con transiciones suaves y controles de usuario.",
    image: "./assets/images/projects/weather-simulator.jpg",
    technologies: ["HTML5", "CSS3", "JavaScript", "CSS Animations", "Weather API"],
    category: "frontend",
    status: "in-progress",
    date: "2024-12-01",
    demoUrl: "https://franklin-andres-rodriguez.github.io/mini-proyectos-web/clima/",
    githubUrl: "https://github.com/franklin-andres-rodriguez/mini-proyectos-web/tree/main/clima",
    featured: false
  }
];

// ========================================
// CLASE GESTORA DE PROYECTOS
// ========================================
class ProjectManager {
  constructor() {
    this.projects = [];
    this.filteredProjects = [];
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.sortOrder = 'date-desc';
    this.isLoading = false;
    
    this.elements = {
      container: null,
      filterButtons: null,
      searchInput: null,
      sortSelect: null,
      modal: null
    };
    
    this.observers = new Map();
    this.init();
  }
  
  /**
   * Inicialización del gestor de proyectos
   */
  async init() {
    try {
      await this.setupElements();
      this.setupEventListeners();
      await this.loadProjects();
      this.setupLazyLoading();
      this.setupProjectModals();
      
      console.log('✅ ProjectManager inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando ProjectManager:', error);
    }
  }
  
  /**
   * Configurar elementos del DOM
   */
  async setupElements() {
    this.elements.container = document.getElementById('projects-container');
    this.elements.filterButtons = document.querySelectorAll('.filter-btn');
    this.elements.searchInput = document.getElementById('project-search');
    this.elements.sortSelect = document.getElementById('project-sort');
    
    if (!this.elements.container) {
      throw new Error('Contenedor de proyectos no encontrado');
    }
    
    // Crear elementos adicionales si no existen
    if (!this.elements.searchInput) {
      this.createSearchInput();
    }
    
    if (!this.elements.sortSelect) {
      this.createSortSelect();
    }
  }
  
  /**
   * Crear input de búsqueda si no existe
   */
  createSearchInput() {
    // Verificar si ya existe para evitar duplicados
    if (document.getElementById('project-search')) {
      this.elements.searchInput = document.getElementById('project-search');
      return;
    }
    
    const projectsSection = document.getElementById('projects');
    if (!projectsSection) {
      console.warn('Sección de proyectos no encontrada');
      return;
    }
    
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.style.cssText = `
      display: flex;
      justify-content: center;
      margin-bottom: var(--spacing-lg);
    `;
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'project-search';
    searchInput.className = 'form-input';
    searchInput.placeholder = 'Buscar proyectos...';
    searchInput.style.cssText = `
      max-width: 400px;
      width: 100%;
    `;
    
    searchContainer.appendChild(searchInput);
    
    // Estrategia de inserción DOM defensiva
    const title = projectsSection.querySelector('.section-title');
    const filtersContainer = projectsSection.querySelector('.projects-filter');
    
    try {
      if (title && filtersContainer && projectsSection.contains(filtersContainer)) {
        // Insertar entre título y filtros
        projectsSection.insertBefore(searchContainer, filtersContainer);
      } else if (title && projectsSection.contains(title)) {
        // Insertar después del título
        if (title.nextSibling) {
          projectsSection.insertBefore(searchContainer, title.nextSibling);
        } else {
          projectsSection.appendChild(searchContainer);
        }
      } else {
        // Fallback: insertar al inicio de la sección
        if (projectsSection.firstChild) {
          projectsSection.insertBefore(searchContainer, projectsSection.firstChild);
        } else {
          projectsSection.appendChild(searchContainer);
        }
      }
      
      this.elements.searchInput = searchInput;
      console.log('✅ Campo de búsqueda creado correctamente');
      
    } catch (error) {
      console.error('Error insertando campo de búsqueda:', error);
      // Fallback seguro: append al final
      projectsSection.appendChild(searchContainer);
      this.elements.searchInput = searchInput;
    }
  }
  
  /**
   * Crear selector de ordenamiento si no existe
   */
  createSortSelect() {
    // Verificar si ya existe para evitar duplicados
    if (document.getElementById('project-sort')) {
      this.elements.sortSelect = document.getElementById('project-sort');
      return;
    }
    
    const projectsSection = document.getElementById('projects');
    if (!projectsSection) {
      console.warn('Sección de proyectos no encontrada');
      return;
    }
    
    const sortContainer = document.createElement('div');
    sortContainer.className = 'sort-container';
    sortContainer.style.cssText = `
      display: flex;
      justify-content: center;
      margin-bottom: var(--spacing-lg);
    `;
    
    const sortSelect = document.createElement('select');
    sortSelect.id = 'project-sort';
    sortSelect.className = 'form-input';
    sortSelect.style.cssText = `
      max-width: 200px;
      width: 100%;
    `;
    
    sortSelect.innerHTML = `
      <option value="date-desc">Más recientes</option>
      <option value="date-asc">Más antiguos</option>
      <option value="title-asc">A - Z</option>
      <option value="title-desc">Z - A</option>
      <option value="featured">Destacados</option>
    `;
    
    sortContainer.appendChild(sortSelect);
    
    // Estrategia de inserción DOM defensiva
    try {
      const searchContainer = projectsSection.querySelector('.search-container');
      const filtersContainer = projectsSection.querySelector('.projects-filter');
      const containerElement = this.elements.container;
      
      if (searchContainer && projectsSection.contains(searchContainer)) {
        // Insertar después de la búsqueda
        if (searchContainer.nextSibling) {
          projectsSection.insertBefore(sortContainer, searchContainer.nextSibling);
        } else {
          projectsSection.appendChild(sortContainer);
        }
      } else if (filtersContainer && projectsSection.contains(filtersContainer)) {
        // Insertar después de los filtros
        if (filtersContainer.nextSibling) {
          projectsSection.insertBefore(sortContainer, filtersContainer.nextSibling);
        } else {
          projectsSection.appendChild(sortContainer);
        }
      } else if (containerElement && projectsSection.contains(containerElement)) {
        // Insertar antes del contenedor de proyectos
        projectsSection.insertBefore(sortContainer, containerElement);
      } else {
        // Fallback: append al final
        projectsSection.appendChild(sortContainer);
      }
      
      this.elements.sortSelect = sortSelect;
      console.log('✅ Selector de ordenamiento creado correctamente');
      
    } catch (error) {
      console.error('Error insertando selector de ordenamiento:', error);
      // Fallback seguro: append al final
      projectsSection.appendChild(sortContainer);
      this.elements.sortSelect = sortSelect;
    }
  }
  
  /**
   * Configurar event listeners
   */
  setupEventListeners() {
    // Filtros de categoría
    this.elements.filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = btn.getAttribute('data-filter');
        this.setFilter(filter);
      });
    });
    
    // Búsqueda en tiempo real
    if (this.elements.searchInput) {
      this.elements.searchInput.addEventListener('input', 
        this.debounce((e) => {
          this.setSearchQuery(e.target.value);
        }, 300)
      );
    }
    
    // Ordenamiento
    if (this.elements.sortSelect) {
      this.elements.sortSelect.addEventListener('change', (e) => {
        this.setSortOrder(e.target.value);
      });
    }
  }
  
  /**
   * Cargar proyectos
   */
  async loadProjects() {
    try {
      this.setLoading(true);
      
      // Simular carga de API - reemplazar con fetch real
      await this.simulateAPICall();
      
      this.projects = PROJECTS_DATA;
      this.filteredProjects = [...this.projects];
      
      this.sortProjects();
      this.renderProjects();
      
      this.setLoading(false);
    } catch (error) {
      console.error('Error cargando proyectos:', error);
      this.showError('Error al cargar los proyectos');
      this.setLoading(false);
    }
  }
  
  /**
   * Simular llamada a API
   */
  simulateAPICall() {
    return new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
  }
  
  /**
   * Establecer filtro de categoría
   */
  setFilter(filter) {
    this.currentFilter = filter;
    this.updateFilterButtons();
    this.applyFilters();
  }
  
  /**
   * Establecer consulta de búsqueda
   */
  setSearchQuery(query) {
    this.searchQuery = query.toLowerCase().trim();
    this.applyFilters();
  }
  
  /**
   * Establecer orden de clasificación
   */
  setSortOrder(order) {
    this.sortOrder = order;
    this.sortProjects();
    this.renderProjects();
  }
  
  /**
   * Aplicar filtros y búsqueda
   */
  applyFilters() {
    this.filteredProjects = this.projects.filter(project => {
      // Filtro de categoría
      const categoryMatch = this.currentFilter === 'all' || 
                           project.category === this.currentFilter;
      
      // Filtro de búsqueda
      const searchMatch = !this.searchQuery || 
                         project.title.toLowerCase().includes(this.searchQuery) ||
                         project.description.toLowerCase().includes(this.searchQuery) ||
                         project.technologies.some(tech => 
                           tech.toLowerCase().includes(this.searchQuery)
                         );
      
      return categoryMatch && searchMatch;
    });
    
    this.sortProjects();
    this.renderProjects();
    this.updateResultsCount();
  }
  
  /**
   * Ordenar proyectos
   */
  sortProjects() {
    this.filteredProjects.sort((a, b) => {
      switch (this.sortOrder) {
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        default:
          return 0;
      }
    });
  }
  
  /**
   * Renderizar proyectos
   */
  renderProjects() {
    if (!this.elements.container) return;
    
    if (this.filteredProjects.length === 0) {
      this.showEmptyState();
      return;
    }
    
    const projectsHTML = this.filteredProjects.map(project => 
      this.createProjectCard(project)
    ).join('');
    
    this.elements.container.innerHTML = projectsHTML;
    
    // Configurar eventos para las nuevas tarjetas
    this.setupProjectCards();
    
    // Aplicar animaciones de entrada
    this.animateProjectCards();
  }
  
  /**
   * Crear tarjeta de proyecto
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
    
    return `
      <article class="project-card animate-on-scroll" data-project-id="${project.id}" data-category="${project.category}">
        ${featuredBadge}
        <div class="project-image">
          <img src="${project.image}" alt="${project.title}" loading="lazy" onerror="this.src='./assets/images/projects/placeholder.jpg'">
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
   * Configurar eventos para tarjetas de proyecto
   */
  setupProjectCards() {
    // Botones de detalles
    document.querySelectorAll('.project-details-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.project-card');
        const projectId = parseInt(card.getAttribute('data-project-id'));
        this.showProjectModal(projectId);
      });
    });
    
    // Click en toda la tarjeta para ver detalles
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Solo si no se hizo click en un enlace
        if (!e.target.closest('a, button')) {
          const projectId = parseInt(card.getAttribute('data-project-id'));
          this.showProjectModal(projectId);
        }
      });
      
      // Mejorar accesibilidad
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      
      // Navegación por teclado
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const projectId = parseInt(card.getAttribute('data-project-id'));
          this.showProjectModal(projectId);
        }
      });
    });
  }
  
  /**
   * Mostrar modal de proyecto
   */
  async showProjectModal(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return;
    
    try {
      // Crear modal si no existe
      if (!this.elements.modal) {
        this.elements.modal = this.createProjectModal();
      }
      
      // Actualizar contenido del modal
      this.updateModalContent(project);
      
      // Mostrar modal
      this.elements.modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Focus trap
      this.setupModalFocusTrap();
      
      // Analytics (opcional)
      this.trackProjectView(project.id);
      
    } catch (error) {
      console.error('Error mostrando modal:', error);
    }
  }
  
  /**
   * Crear modal de proyecto
   */
  createProjectModal() {
    const modal = document.createElement('div');
    modal.className = 'modal project-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" aria-label="Cerrar modal">✕</button>
        <div class="modal-header">
          <img class="modal-image" src="" alt="">
        </div>
        <div class="modal-body">
          <div class="modal-project-content">
            <!-- Contenido dinámico -->
          </div>
        </div>
      </div>
    `;
    
    // Event listeners del modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeProjectModal();
      }
    });
    
    modal.querySelector('.modal-close').addEventListener('click', () => {
      this.closeProjectModal();
    });
    
    // Navegación por teclado
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeProjectModal();
      }
    });
    
    document.body.appendChild(modal);
    return modal;
  }
  
  /**
   * Actualizar contenido del modal
   */
  updateModalContent(project) {
    if (!this.elements.modal) return;
    
    const modalImage = this.elements.modal.querySelector('.modal-image');
    const modalContent = this.elements.modal.querySelector('.modal-project-content');
    
    modalImage.src = project.image;
    modalImage.alt = project.title;
    
    const techTags = project.technologies.map(tech => 
      `<span class="tech-tag">${tech}</span>`
    ).join('');
    
    const metricsHTML = project.metrics ? `
      <div class="project-metrics">
        <h4>Métricas de Performance</h4>
        <div class="metrics-grid">
          <div class="metric-item">
            <span class="metric-label">Performance</span>
            <div class="metric-bar">
              <div class="metric-fill" style="width: ${project.metrics.performance}%"></div>
            </div>
            <span class="metric-value">${project.metrics.performance}%</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Accessibility</span>
            <div class="metric-bar">
              <div class="metric-fill" style="width: ${project.metrics.accessibility}%"></div>
            </div>
            <span class="metric-value">${project.metrics.accessibility}%</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">SEO</span>
            <div class="metric-bar">
              <div class="metric-fill" style="width: ${project.metrics.seo}%"></div>
            </div>
            <span class="metric-value">${project.metrics.seo}%</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Best Practices</span>
            <div class="metric-bar">
              <div class="metric-fill" style="width: ${project.metrics.bestPractices}%"></div>
            </div>
            <span class="metric-value">${project.metrics.bestPractices}%</span>
          </div>
        </div>
      </div>
    ` : '';
    
    modalContent.innerHTML = `
      <div class="modal-header-content">
        <h2 class="modal-title">${project.title}</h2>
        <div class="modal-meta">
          <span class="modal-date">${this.formatDate(project.date)}</span>
          <span class="modal-status status-${project.status}">${this.getStatusText(project.status)}</span>
        </div>
      </div>
      
      <div class="modal-description">
        <p>${project.longDescription || project.description}</p>
      </div>
      
      <div class="modal-technologies">
        <h4>Tecnologías Utilizadas</h4>
        <div class="tech-grid">
          ${techTags}
        </div>
      </div>
      
      ${metricsHTML}
      
      <div class="modal-actions">
        ${project.demoUrl ? `<a href="${project.demoUrl}" class="btn btn-primary" target="_blank" rel="noopener">Ver Demo 🚀</a>` : ''}
        ${project.githubUrl ? `<a href="${project.githubUrl}" class="btn btn-secondary" target="_blank" rel="noopener">Ver Código 💻</a>` : ''}
      </div>
    `;
  }
  
  /**
   * Cerrar modal de proyecto
   */
  closeProjectModal() {
    if (this.elements.modal) {
      this.elements.modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  /**
   * Configurar lazy loading de imágenes
   */
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy-loading');
            imageObserver.unobserve(img);
          }
        });
      });
      
      this.observers.set('images', imageObserver);
    }
  }
  
  /**
   * Utilidades
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  getStatusText(status) {
    const statusMap = {
      'completed': 'Completado',
      'in-progress': 'En Progreso',
      'planned': 'Planeado'
    };
    return statusMap[status] || 'Desconocido';
  }
  
  debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }
  
  trackProjectView(projectId) {
    // Implementar analytics si es necesario
    console.log(`📊 Proyecto ${projectId} visualizado`);
  }
}

// ========================================
// EXTENSIONES DEL PROTOTIPO PRINCIPAL
// ========================================

/**
 * Extensiones para la clase principal PortfolioApp
 */
if (typeof PortfolioApp !== 'undefined') {
  // Método para crear tarjeta de proyecto
  PortfolioApp.prototype.createProjectCard = function(project) {
    return window.projectManager?.createProjectCard(project) || '';
  };
  
  // Método para mostrar skeletons de carga
  PortfolioApp.prototype.showProjectSkeletons = function() {
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
  };
  
  // Método para mostrar error de proyectos
  PortfolioApp.prototype.showProjectError = function() {
    if (!this.elements.projectsContainer) return;
    
    this.elements.projectsContainer.innerHTML = `
      <div class="projects-error">
        <div class="error-icon">⚠️</div>
        <h3>Error al cargar proyectos</h3>
        <p>No se pudieron cargar los proyectos. Por favor, intenta más tarde.</p>
        <button class="btn btn-primary" onclick="location.reload()">Reintentar</button>
      </div>
    `;
  };
  
  // Inicializar filtros de proyecto
  PortfolioApp.prototype.initializeProjectFilters = function() {
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
  };
  
  // Filtrar proyectos
  PortfolioApp.prototype.filterProjects = function(category) {
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
  };
  
  // Configurar eventos de proyecto
  PortfolioApp.prototype.setupProjectEventListeners = function() {
    // Esta función se llamará después de renderizar los proyectos
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      // Hover effects
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  };
}

// ========================================
// INICIALIZACIÓN AUTOMÁTICA CON PROTECCIÓN
// ========================================
let projectManager;
let isInitializing = false;

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeProjectManager);
} else {
  initializeProjectManager();
}

function initializeProjectManager() {
  // Prevenir múltiples inicializaciones
  if (projectManager || isInitializing) {
    console.log('🔄 ProjectManager ya existe o está inicializándose');
    return;
  }
  
  try {
    isInitializing = true;
    projectManager = new ProjectManager();
    
    // Hacer disponible globalmente
    if (typeof window !== 'undefined') {
      window.projectManager = projectManager;
      window.PROJECTS_DATA = PROJECTS_DATA;
    }
    
    console.log('✅ ProjectManager inicializado y disponible globalmente');
  } catch (error) {
    console.error('❌ Error inicializando ProjectManager:', error);
    // Permitir reintentos después de un error
    projectManager = null;
  } finally {
    isInitializing = false;
  }
}

// ========================================
// EXPORTAR PARA MÓDULOS
// ========================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ProjectManager, PROJECTS_DATA };
}