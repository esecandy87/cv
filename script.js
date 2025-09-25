document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('.nav-link');
  const langButtons = document.querySelectorAll('.lang-btn');
  const exportButton = document.getElementById('exportPdf');
  const pdfContainer = document.getElementById('pdf-export-container');

  let currentLang = 'es';
  showSection('perfil', currentLang);

  // Cambio de idioma
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      langButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLang = btn.dataset.lang;
      const active = document.querySelector('.section.active');
      const baseId = active?.id.replace('-en', '') || 'perfil';
      showSection(baseId, currentLang);
    });
  });

  // Navegación
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      showSection(link.dataset.section, currentLang);
    });
  });

  function showSection(baseId, lang) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const id = lang === 'en' ? `${baseId}-en` : baseId;
    const sec = document.getElementById(id);
    if (sec) sec.classList.add('active');
  }

  // ✅ EXPORTACIÓN CORREGIDA
  exportButton.addEventListener('click', () => {
    const active = document.querySelector('.section.active');
    if (!active) return alert('No hay contenido para exportar.');

    // Limpiar contenedor PDF
    pdfContainer.innerHTML = '';

    // Clonar y limpiar
    const clone = active.cloneNode(true);

    // Eliminar números de línea (no se renderizan bien)
    clone.querySelectorAll('.code-block').forEach(cb => {
      cb.style.paddingLeft = '0';
      cb.style.borderLeft = 'none';
      cb.style.background = 'transparent';
    });

    // Aplicar estilos inline para PDF
    clone.querySelectorAll('*').forEach(el => {
      el.style.backgroundColor = 'transparent';
      if (el.tagName === 'H2' || el.tagName === 'H3') {
        el.style.color = '#005a9e';
        el.style.borderBottom = '1px solid #007acc';
      }
      if (el.tagName === 'A') {
        el.style.color = '#007acc';
        el.style.textDecoration = 'underline';
      }
    });

    pdfContainer.appendChild(clone);

    const opt = {
      margin: 10,
      filename: currentLang === 'en' ? 'Miguel_C_Suarez_CV_EN.pdf' : 'Miguel_C_Suarez_CV_ES.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    exportButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    exportButton.disabled = true;

    html2pdf().from(pdfContainer).set(opt).save().finally(() => {
      exportButton.innerHTML = '<i class="fas fa-file-pdf"></i>';
      exportButton.disabled = false;
    });
  });
});
