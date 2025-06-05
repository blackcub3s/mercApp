

function paginadorManual(prodInflacio) {

    const contTorcido = document.getElementById("contenedorTorcidoTop");
    const botoDreta = document.getElementById("botoDreta"); 
    const botoEsquerra = document.getElementById("botoEsquerra");


    //prodInflacio es necessita en aquest script i en paginadorInflacio.js
    //                   [prod, nreUnitats, categoria]


    
    let nreProdInflacio = prodInflacio.length;

    let i = 0; //variable per a saber on estem
    botoDreta.addEventListener('click', (esdeveniment) => {  //navego a la dreta del paginador de inflacio

        if (i < nreProdInflacio - 1) {
            ++i;                                    

            getDadesInflalyzer(esdeveniment, i, prodInflacio); //PERSISTÈNCIA --> Obtinc dades del sistema de persistència (localStorage o BBDD).
            avaluaPaginador(i, nreProdInflacio);     //VISTES --> m'asseguro que el paginador es difumina en els extrems
            colorejaContenidorTort(i, contTorcido);  //VISTES --> Poso el color pertinent (blau si es mante, verd si baixa, color rogenc si puja)
        }
    });

    //navego a l'ESQUERRA en el llistat de productes inflacionats
    botoEsquerra.addEventListener('click', esdeveniment => {   //navego a la esquerra del paginador d'inflació  

        if (i > 0) {
            --i;   

            getDadesInflalyzer(esdeveniment, i, prodInflacio); //PERSISTÈNCIA --> Obtinc dades del sistema de persistència (localStorage o BBDD).
            avaluaPaginador(i, nreProdInflacio);    //VISTES --> m'asseguro que el paginador es difumina en els extrems
            colorejaContenidorTort(i, contTorcido); //VISTES --> Poso el color pertinent (blau si es mante, verd si baixa, color rogenc si puja)
        }
    });
}





//canvio color contenidor tort
function colorejaContenidorTort(i, contenedor) {
    if (i === 0) //SI PREU PRODUCTE BAIXA
        contenedor.style.background =  getComputedStyle(document.documentElement).getPropertyValue('--colorVerdeVue'); 
    else if (i === 1) { //SI PREU PRODUCTE PUJA
        var colorAngularINI = getComputedStyle(document.documentElement).getPropertyValue('--PI_colorAngularGradienteInicio');
        var colorAngularFIN = getComputedStyle(document.documentElement).getPropertyValue('--PI_colorAngularGradienteFinal');
        contenedor.style.background = `linear-gradient(to bottom, ${colorAngularINI}, ${colorAngularFIN})`;
    } else if (i === 2) //SI PREU PRODUCTE ES MANTÉ
        contenedor.style.background =  getComputedStyle(document.documentElement).getPropertyValue('--PI_colorReact');
}

//Funcio que a cada posicio del llistat de products s'assegura que el paginador del costat respectiu
//estigui difuminat a l'extrem respectiu.
function avaluaPaginador(i, nreProductesInflacio) {
    const bEsq = document.getElementById("botoEsquerra");
    const bDre = document.getElementById("botoDreta");
    if (i == 0) {
        bEsq.setAttribute("src","img/dashboard/paginadorEsqDifuminat.png");
    } else if (i == nreProductesInflacio - 1) {
        bDre.setAttribute("src","img/dashboard/paginadorDreDifuminat.png");
    } else {
        bEsq.setAttribute("src","img/dashboard/paginadorEsq.png");
        bDre.setAttribute("src","img/dashboard/paginadorDre.png");
    }
}