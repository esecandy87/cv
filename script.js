document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('.nav-link');
  const langButtons = document.querySelectorAll('.lang-btn');
  const exportButton = document.getElementById('exportPdf');
  const pdfContainer = document.getElementById('pdf-export-container');

  let currentLang = 'es';

  // Mostrar sección inicial
  showSection('perfil', currentLang);

  // Cambiar idioma
  langButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      langButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentLang = this.getAttribute('data-lang');
      const activeSection = document.querySelector('.section.active');
      if (activeSection) {
        const baseId = activeSection.id.replace('-en', '');
        showSection(baseId, currentLang);
      }
    });
  });

  // Navegación
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      const baseId = this.getAttribute('data-section');
      showSection(baseId, currentLang);
    });
  });

  function showSection(baseId, lang) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    const targetId = lang === 'en' ? `${baseId}-en` : baseId;
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.add('active');
    }
  }

  // ✅ EXPORTAR A PDF — CORREGIDO
  exportButton.addEventListener('click', function () {
    const activeSection = document.querySelector('.section.active');
    if (!activeSection) {
      alert('No hay contenido para exportar.');
      return;
    }

    // Limpiar contenedor
    pdfContainer.innerHTML = '';

    // Clonar contenido
    const clone = activeSection.cloneNode(true);

    // Crear un wrapper con estilos inline para PDF
    const wrapper = document.createElement('div');
    wrapper.style.fontFamily = 'Arial, sans-serif';
    wrapper.style.padding = '20mm';
    wrapper.style.color = '#000';
    wrapper.style.lineHeight = '1.6';
    wrapper.style.maxWidth = '210mm';
    wrapper.style.margin = '0 auto';

    // Eliminar números de línea (pseudo-elementos no se renderizan en PDF)
    const codeBlocks = clone.querySelectorAll('.code-block');
    codeBlocks.forEach(cb => {
      cb.style.paddingLeft = '0';
      cb.style.borderLeft = 'none';
      cb.style.position = 'relative';
      // Eliminar pseudo-elementos visualmente (no se pueden clonar)
      const cleanBlock = document.createElement('div');
      cleanBlock.innerHTML = cb.innerHTML;
      cb.parentNode.replaceChild(cleanBlock, cb);
    });

    // Estilizar encabezados y enlaces
    const headings = clone.querySelectorAll('h2, h3');
    headings.forEach(h => {
      h.style.color = '#005a9e';
      h.style.borderBottom = '1px solid #007acc';
      h.style.paddingBottom = '4px';
    });

    const links = clone.querySelectorAll('a');
    links.forEach(a => {
      a.style.color = '#007acc';
      a.style.textDecoration = 'underline';
    });

    wrapper.appendChild(clone);
    pdfContainer.appendChild(wrapper);

    const opt = {
      margin: 10,
      filename: currentLang === 'en' ? 'Miguel_C_Suarez_CV_EN.pdf' : 'Miguel_C_Suarez_CV_ES.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        // Forzar renderizado de fondo blanco
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    exportButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    exportButton.disabled = true;

    html2pdf()
      .from(pdfContainer)
      .set(opt)
      .save()
      .then(() => {
        exportButton.innerHTML = '<i class="fas fa-file-pdf"></i>';
        exportButton.disabled = false;
      })
      .catch(err => {
        console.error('Error PDF:', err);
        alert('Error al generar PDF. Abre la consola para más detalles.');
        exportButton.innerHTML = '<i class="fas fa-file-pdf"></i>';
        exportButton.disabled = false;
      });
  });
});
