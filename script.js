document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('.nav-link');
  const langButtons = document.querySelectorAll('.lang-btn');
  let currentLang = 'es';

  // Mostrar sección inicial
  showSection('perfil', currentLang);

  // Función para mostrar una sección específica
  function showSection(baseId, lang) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    const targetId = lang === 'en' ? `${baseId}-en` : baseId;
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.add('active');
    }
  }

  // Actualizar el enlace de descarga del PDF según el idioma
  function updatePdfLink(lang) {
    const pdfLink = document.getElementById('pdfLink');
    if (lang === 'en') {
      pdfLink.href = 'CV - Miguel C. Suárez González EN.pdf';
      pdfLink.download = 'CV - Miguel C. Suárez González EN.pdf';
    } else {
      pdfLink.href = 'CV - Miguel C. Suárez González.pdf';
      pdfLink.download = 'CV - Miguel C. Suárez González.pdf';
    }
  }

  // Inicializar el enlace de PDF
  updatePdfLink(currentLang);

  // Evento: cambio de idioma
  langButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      // Quitar clase 'active' de todos los botones de idioma
      langButtons.forEach(b => b.classList.remove('active'));
      // Añadir 'active' al botón clicado
      this.classList.add('active');

      // Actualizar idioma actual
      currentLang = this.getAttribute('data-lang');

      // Actualizar enlace de PDF
      updatePdfLink(currentLang);

      // Mantener la sección activa en el nuevo idioma
      const activeSection = document.querySelector('.section.active');
      if (activeSection) {
        const baseId = activeSection.id.replace('-en', '');
        showSection(baseId, currentLang);
      }
    });
  });

  // Evento: navegación por secciones
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      // Quitar 'active' de todos los enlaces de navegación
      navLinks.forEach(l => l.classList.remove('active'));
      // Añadir 'active' al enlace clicado
      this.classList.add('active');

      // Mostrar sección correspondiente
      const baseId = this.getAttribute('data-section');
      showSection(baseId, currentLang);
    });
  });
});
