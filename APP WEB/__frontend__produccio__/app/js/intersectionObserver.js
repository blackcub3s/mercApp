//CODI FET PER XAT GPT QUE PERMET FER QUE APAREGUIN ELS BORDER TOPS A LES SECTIONS DE LA LANDING PAGE
//I CANVII EL COLOR AMB UN FILTER DE BLAU A VERMELL EN L'INTERVALIZER. S'HA AJUSTAT PER A FER-LO FUNCIONAR

const sectionsLanding = document.querySelectorAll('#ContenidorTrioProductes > section');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
}, { threshold: 0.2}); // 0.2 = se activa cuando 20% del elemento es visible

sectionsLanding.forEach(el => observer.observe(el));