document.addEventListener("DOMContentLoaded", () => {
    fesGraficProducte("producteMesOcurrent"); //EL DE LA PRIMERA ITERACIO REQUEREIX UN SETINTERVAL PER EVITAR PROBLEMES D'ASSINCRONIA
});









//AQUEST ITEM DE LOCAL STORAGE {'BOLSA PLASTICO': 132, 'BANANA': 53, 'BRONCHALES 6L': 50, .... , 'AGUA MINERAL': 1}        
//NO ESTARÀ PLE FINS QUE LA CRIDA ASÍNCRONA A api/frequenciesProductes ESTIGUI RESOLTA. CADA 100 MILISEGONS
//ESCANEGEM EL CONTINGUT DEL LOCAL STORAGE FINS TROBAR-LO.
function fesFetch_graficDataPreuProducte(producteBuscat) {
    const tokenAcces = localStorage.getItem("AccessToken");
    fetch('http://localhost:8000/api/graficDataPreuProducte', {
        method: "POST",
        headers: {
            'Authorization': "Bearer " + tokenAcces,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"nomProducte": producteBuscat})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('La solicitud devolvió código de error en paso3 : ' + response.status + " || Mensaje de error: " + response.statusText);
        }
        return response.json();
    })
    .then(arrDataPreu => {

        // LES DADES TINDRAN AQUEST ASPECTE ON x es la data i y es el preu. 
        //let arrDataPreu = [{ "x": "2022-06-01", "y": 1 }, { "x": "2022-08-01", "y": 3 },{ "x": "2026-06-01", "y": 6 }];
        localStorage.setItem("arrDataPreu", JSON.stringify(arrDataPreu)); //AIXO ES INDISPENSABLE PER PODER TREURE EL PREU MINIM I MAXIM DINS LA CARD DE LA INFLACIÓ AIXI COM LES DATES.
        fesGrafic(arrDataPreu); // FEM EL GRAFIC JA
        //localStorage.removeItem("arrDataPreu");
       
    })
    .catch(error => {
        console.error('Error en paso3:', error);
    });
}

//FUNCIO QUE SI L IPASSEM EL NOM D'UN PRODUCTE ENS FA EL SEU GRAFIC 
// (A EXCEPCIO DE SI LI PASSEM  producteMesOcurrent. Aleshores fa un fetch del prdocute més ocurrent tenint en compte que cal afegirt
//un timeout per treure frequenciesProductes del localstorage; que s'havia rellenat d'una crida a endpoint i podria fallar si no mirem si ja esta ple.
//la resta de crides vindran del paginador.
function fesGraficProducte(nomProducte) {
    //HEM DE FER UN SET INTERVAL PORQUÈ DEL LOCAL STORAGE NO SABEM QUAN HI HAURAN LES DADES DINS.
    //LA VARIABLE DEL LOCAL STORAGE QUE CONSULTEM AMB getItem ((let freqProductes = localStorage.getItem("frequenciesProductes");))
    //S'HAVIA EMPLENAT AMB LA SOLICITUD A l'endpoint /api/frequenciesProductes. D'ALLI EN TREIEM
    //LES CLAUS DE freqProductes, en l'ordre en el que van (ORDRE DE MÉS A MENYS APARICIÓ) IDEAL
    //PER A MOSTRAR ELS PRODUCTES EN EL GRÀFIC: PRIMER ELS QUE TENEN MÉS OCURRÈNCIA (PER ALS QUE EL GRÀFIC TÉ SENTIT)
    //I DESPRÉS AMB EL PAGINADOR ANIREM ACCEDINT ALS QUE TENEN MENYS OCURRÈNCIA I PERMETEN, PER TANT,
    //OBSERVAR PITJOR LA TENDÈNCIA D'INCREMENT DE PREUS

    

    if (nomProducte == "producteMesOcurrent") { //EL PRODUCTE MES OCURRENT NO SEMPRE VE PER PARAMETRE

        const idIntervalDashboard = setInterval(() => {
            let freqProductes = localStorage.getItem("frequenciesProductes");
            if (freqProductes !== null) {
                clearInterval(idIntervalDashboard);//QUAN JA HEM TROBAT QUE S'HA EMPLENAT ALESHORES JA PODEM PRENDRE LES DADES

                //DESSERIALITZEM EL JSON QUE CONTE PARELL PRODUCTE I FREQUENCIA DE COMPRA    AIXI ---> {'BOLSA PLASTICO': 132, 'BANANA': 53, 'BRONCHALES 6L': 50, .... , 'AGUA MINERAL': 1}
                let freqProductes = JSON.parse(localStorage.getItem("frequenciesProductes"));    
                const clauProductes = Object.keys(freqProductes);   //clauProductes conté els productes ordenats de MÉS A MENYS compres
                
                
                //el producrte mes comprat es BOLSA PLASTICO i quan carreguem la pagina es el primer grafi que mostrem. ES MOLT IMPORTANT FER-L UN TRACTE ESPECIAL
                // PER AIXO HO POSEM DINS producteMesOcurrent. Es a primera carrega a la pagina i podria donar error per asincronia.
                const producteMesComprat = clauProductes[0];        
                
                fesFetch_graficDataPreuProducte(producteMesComprat);
            }
        }, 20);
    } else { //AQUEST PRODUCTES (2N PRODUCTE MES OCURRENT I SEGUENTS VINDRAN PER PARMETRE, DEL PAGINADOR.
        setTimeout(() => {
            fesFetch_graficDataPreuProducte(nomProducte);
        }, 20);
    }
 
}




let myChartInstance = null; //indispensable que estigui com a variable global.
function fesGrafic(arrDataPreu) {
    const ctx = document.getElementById('myChart').getContext('2d');

    // Si ya hay un gráfico, lo destruimos (ABSOLUTAMENT FONAMENTAL, SI NO AMB EL PAGINADOR NO FUNCIONAVA!)
    if (myChartInstance !== null) {
        myChartInstance.destroy();
    }

    // Creamos el nuevo gráfico y lo guardamos en la variable global
    myChartInstance = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: "Evolución de precio por producto",
                    data: arrDataPreu,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'red',
                    borderWidth: 2
                }
            ]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'month',
                        tooltipFormat: 'yyyy-MM-dd',
                        displayFormats: {
                            month: 'MM/yy'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Fecha (mm/aa)',
                        color: 'black'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Precio (€/kg o €/unidad)',
                        color: 'black'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: ['Variación del coste unitario a lo largo del tiempo'],
                    font: {
                        size: 30,
                        weight: 'bold'
                    },
                    padding: {
                        top: 20,
                        bottom: 20
                    },
                    color: "black"
                },
                legend: {
                    labels: {
                        color: 'black'
                    }
                }
            }
        }
    });
}
