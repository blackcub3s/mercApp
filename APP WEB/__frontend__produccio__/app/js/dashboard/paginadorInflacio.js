

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
            //colorejaContenidorTort(i, contTorcido);  //VISTES --> Poso el color pertinent (blau si es mante, verd si baixa, color rogenc si puja)
            emplenaGrafic(i); 
        }
    });

    //navego a l'ESQUERRA en el llistat de productes inflacionats
    botoEsquerra.addEventListener('click', esdeveniment => {   //navego a la esquerra del paginador d'inflació  

        if (i > 0) {
            --i;   

            getDadesInflalyzer(esdeveniment, i, prodInflacio); //PERSISTÈNCIA --> Obtinc dades del sistema de persistència (localStorage o BBDD).
            avaluaPaginador(i, nreProdInflacio);    //VISTES --> m'asseguro que el paginador es difumina en els extrems
            //colorejaContenidorTort(i, contTorcido); //VISTES --> Poso el color pertinent (blau si es mante, verd si baixa, color rogenc si puja)
            emplenaGrafic(i)
        }
    });
}

function emplenaGrafic(i) {
    let freqProductes = JSON.parse(localStorage.getItem("frequenciesProductes"));    
    const clauProductes = Object.keys(freqProductes);   //clauP
    //console.log(clauProductes[i]);
    fesGraficProducte(clauProductes[i]);
}



//canvio color contenidor tort i poso iconets de preu a la card.
function colorejaContenidorTort(i, contenedor) {
    const iconoUp = document.getElementById("contenidorUp");
    const iconoDown = document.getElementById("contenidorDown");
    if (i === -1) { //SI PREU PRODUCTE BAIXA
        contenedor.style.background =  getComputedStyle(document.documentElement).getPropertyValue('--colorVerdeVue'); 
        
        iconoDown.style.display = "block";
        iconoUp.style.display = "none";
    }
    else if (i === 1) { //SI PREU PRODUCTE PUJA
        var colorCardSuperior = getComputedStyle(document.documentElement).getPropertyValue('--PI_cardSuperior');
        var colorCardInferior = getComputedStyle(document.documentElement).getPropertyValue('--PI_cardInferior');
        
        iconoUp.style.display = "block";
        iconoDown.style.display = "none";
        
        contenedor.style.background = `linear-gradient(to bottom, ${colorCardSuperior}, ${colorCardInferior})`;
    } else if (i === 0) { //SI PREU PRODUCTE ES MANTÉ
        contenedor.style.background =  getComputedStyle(document.documentElement).getPropertyValue('--PI_colorReact');
        iconoUp.style.display = "none";
        iconoDown.style.display = "none";
    }
    else if (i === 2) { //SI NOMES HI HA UN PRODUCTE, NO PODEM DEDUIR SI PUJA O BAIXA I TAMPOC PAS QE ES MANTINGUI (PQ NO HO SABEM)
        contenedor.style.background =  getComputedStyle(document.documentElement).getPropertyValue('--PI_grisNoVariacio');
        iconoUp.style.display = "none";
        iconoDown.style.display = "none";
    }
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