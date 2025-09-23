document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.nav-link');
  const langButtons = document.querySelectorAll('.lang-btn');
  const exportButton = document.getElementById('exportPdf');
  const pdfContainer = document.getElementById('pdf-export-container');

  let currentLang = 'es';

  // Mostrar sección inicial
  showSection('perfil', currentLang);

  // Cambiar idioma
  langButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Quitar active de todos
      langButtons.forEach(b => b.classList.remove('active'));
      // Poner active en el clickeado
      this.classList.add('active');

      // Cambiar idioma actual
      currentLang = this.getAttribute('data-lang');

      // Mostrar sección activa en el nuevo idioma
      const activeSection = document.querySelector('.section.active');
      if (activeSection) {
        const baseId = activeSection.id.replace('-en', '');
        showSection(baseId, currentLang);
      }
    });
  });

  // Navegación por secciones
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();

      // Quitar active de todos
      navLinks.forEach(l => l.classList.remove('active'));
      // Poner active en el clickeado
      this.classList.add('active');

      // Mostrar sección correspondiente
      const baseId = this.getAttribute('data-section');
      showSection(baseId, currentLang);
    });
  });

  // Función para mostrar sección
  function showSection(baseId, lang) {
    // Ocultar todas
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));

    // Mostrar la correcta
    const targetId = lang === 'en' ? `${baseId}-en` : baseId;
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.add('active');
    }
  }

  // Exportar a PDF
  exportButton.addEventListener('click', function() {
    // 1. Limpiar contenedor PDF
    pdfContainer.innerHTML = '';

    // 2. Clonar la sección activa (la visible)
    const activeSection = document.querySelector('.section.active');
    if (!activeSection) {
      alert("No hay sección activa para exportar.");
      return;
    }

    const clonedContent = activeSection.cloneNode(true);
    pdfContainer.appendChild(clonedContent);

    // 3. Opciones de PDF
    const opt = {
      margin:       10, // mm
      filename:     currentLang === 'en' ? 'Miguel_C_Suarez_CV_EN.pdf' : 'Miguel_C_Suarez_CV_ES.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // 4. Feedback visual
    exportButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    exportButton.disabled = true;

    // 5. Generar PDF desde el contenedor limpio
    html2pdf()
      .from(pdfContainer)
      .set(opt)
      .save()
      .then(() => {
        exportButton.innerHTML = '<i class="fas fa-file-pdf"></i>';
        exportButton.disabled = false;
      })
      .catch(err => {
        console.error("Error al generar PDF:", err);
        alert("Hubo un error al generar el PDF. Revisa la consola.");
        exportButton.innerHTML = '<i class="fas fa-file-pdf"></i>';
        exportButton.disabled = false;
      });
  });
});
