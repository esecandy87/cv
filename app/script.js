document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.sidebar a');
  const sections = document.querySelectorAll('.section');
  const exportButton = document.getElementById('exportPdf');
  const pdfContainer = document.getElementById('pdf-export-container');

  function showSection(id) {
    sections.forEach(sec => sec.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();

      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');

      const targetId = this.getAttribute('href').substring(1);
      showSection(targetId);
    });
  });

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
      filename:     'CV_TuNombre_Programador.pdf',
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

  // Mostrar sección inicial
  showSection('perfil');
});