// Datos de tus proyectos
const PROJECTS_DATA = [
  {
    id: 1,
    title: "Mini Proyectos Web Collection",
    description: "Colección de mini proyectos web desarrollados para practicar desarrollo frontend.",
    image: "https://via.placeholder.com/400x200/2563eb/ffffff?text=Mini+Proyectos+Web",
    technologies: ["HTML5", "CSS3", "JavaScript"],
    category: "frontend",
    status: "completed",
    date: "2024-11-30",
    demoUrl: "https://franklin-andres-rodriguez.github.io/mini-proyectos-web/",
    githubUrl: "https://github.com/franklin-andres-rodriguez/mini-proyectos-web"
  },
  {
    id: 2,
    title: "Calculadora Interactiva",
    description: "Calculadora web moderna con interfaz intuitiva.",
    image: "https://via.placeholder.com/400x200/10b981/ffffff?text=Calculadora",
    technologies: ["HTML5", "CSS3", "JavaScript"],
    category: "frontend",
    status: "completed",
    date: "2024-10-15",
    demoUrl: "https://franklin-andres-rodriguez.github.io/mini-proyectos-web/calculadora/",
    githubUrl: "https://github.com/franklin-andres-rodriguez/mini-proyectos-web"
  },
  {
    id: 3,
    title: "Juego de Memoria",
    description: "Juego interactivo de memoria con secuencias de colores.",
    image: "https://via.placeholder.com/400x200/f59e0b/ffffff?text=Juego+Memoria",
    technologies: ["HTML5", "CSS3", "JavaScript"],
    category: "frontend",
    status: "completed",
    date: "2024-09-28",
    demoUrl: "https://franklin-andres-rodriguez.github.io/mini-proyectos-web/memoria/",
    githubUrl: "https://github.com/franklin-andres-rodriguez/mini-proyectos-web"
  }
];

// Función simple para mostrar proyectos
function mostrarProyectos() {
  const container = document.getElementById('projects-container');
  if (!container) return;
  
  const html = PROJECTS_DATA.map(project => `
    <div class="project-card" style="background: white; margin: 20px; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
      <h3 style="color: #333; margin: 15px 0 10px 0;">${project.title}</h3>
      <p style="color: #666; margin-bottom: 15px;">${project.description}</p>
      <div style="margin-bottom: 15px;">
        ${project.technologies.map(tech => `<span style="background: #e3f2fd; color: #1976d2; padding: 4px 8px; border-radius: 12px; font-size: 12px; margin-right: 8px;">${tech}</span>`).join('')}
      </div>
      <div style="display: flex; gap: 10px;">
        <a href="${project.demoUrl}" target="_blank" style="background: #2563eb; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none;">Ver Demo</a>
        <a href="${project.githubUrl}" target="_blank" style="background: #333; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none;">GitHub</a>
      </div>
    </div>
  `).join('');
  
  container.innerHTML = html;
  console.log('✅ Proyectos cargados exitosamente');
}

// Inicializar cuando la página cargue
document.addEventListener('DOMContentLoaded', mostrarProyectos);