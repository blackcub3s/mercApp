document.addEventListener("DOMContentLoaded", () => {
    const formulari = document.getElementById("formete");
    formulari.addEventListener("submit", async (esdeveniment) => {
        esdeveniment.preventDefault();
       
        let nom = esdeveniment.target.nombre.value;
        let email = esdeveniment.target.email.value;
        let comentaris = esdeveniment.target.comentarios.value;

        console.log(nom + email + comentaris);


    }); 
});