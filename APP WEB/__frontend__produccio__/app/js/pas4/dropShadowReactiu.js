document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('#tresPassos img').forEach(img => {

        // POSO DROP SHADOW EN POSAR-ME DAMUNT DE LA IMATGE (OPOSAT)
        img.addEventListener('mousemove', e => {
        
            const rect = img.getBoundingClientRect(); //Rectangle que ocupa l'icono!
            const x = e.clientX - rect.left;  // pos ratolí respecte costat esquerre icono
            const y = e.clientY - rect.top;   // pos ratolí respecte costat superior icono
            const centerX = rect.width / 2;   // centre x del rectangle que ocupa l'icono
            const centerY = rect.height / 2;  // centre y "  "  ""

            // Diferencia relativa al centro (x, y)
            const deltaX = x - centerX;
            const deltaY = y - centerY;

            // Invertimo perquè la sombra vagi en la direcció oposada
            const offsetX = -deltaX / 5;  // escala la sombra, ajusta el divisor
            const offsetY = -deltaY / 5;

            img.style.filter = `drop-shadow(${offsetX}px ${offsetY}px 2px rgba(0, 0, 0, 0.25))`;
        });

        // FAIG DESAPARÈIXER EL DROP-SHADOW QUAN SURTO DE LA IMATGE
        img.addEventListener('mouseleave', () => {
            img.style.filter = 'drop-shadow(0px 0px 0px rgba(0,0,0,0))';
        });
    });
});