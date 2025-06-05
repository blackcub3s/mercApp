
//AQUEST ITEM DE LOCAL STORAGE {'BOLSA PLASTICO': 132, 'BANANA': 53, 'BRONCHALES 6L': 50, .... , 'AGUA MINERAL': 1}        
//NO ESTARÀ PLE FINS QUE LA CRIDA ASÍNCRONA A api/frequenciesProductes ESTIGUI RESOLTA. CADA 100 MILISEGONS
//ESCANEGEM EL CONTINGUT DEL LOCAL STORAGE FINS TROBAR-LO.


            

        



document.addEventListener("DOMContentLoaded", () => {

    //HEM DE FER UN SET ITNERVAL PORQUÈ DEL LOCAL STORAGE NO SABEM QUAN HI HAURAN LES DADES DINS.
    //LA VARIABLE DEL LOCAL STORAGE QUE CONSULTEM AMB getItem ((let freqProductes = localStorage.getItem("frequenciesProductes");))
    //S'HAVIA EMPLENAT AMB LA SOLICITUD A l'endpoint /api/frequenciesProductes. D'ALLI EN TREIEM
    //LES CLAUS DE freqProductes, en l'ordre en el que van (ORDRE DE MÉS A MENYS APARICIÓ) IDEAL
    //PER A MOSTRAR ELS PRODUCTES EN EL GRÀFIC: PRIMER ELS QUE TENEN MÉS OCURRÈNCIA (PER ALS QUE EL GRÀFIC TÉ SENTIT)
    //I DESPRÉS AMB EL PAGINADOR ANIREM ACCEDINT ALS QUE TENEN MENYS OCURRÈNCIA I PERMETEN, PER TANT,
    //OBSERVAR PITJOR LA TENDÈNCIA D'INCREMENT DE PREUS
    const idIntervalDashboard = setInterval(() => {
        let freqProductes = localStorage.getItem("frequenciesProductes");
        if (freqProductes !== null) {
            //QUAN JA HEM TROBAT QUE S'HA EMPLENAT ALESHORES JA PODEM PRENDRE LES DADES
            clearInterval(idIntervalDashboard);




            const tokenAcces = localStorage.getItem("AccessToken");
            const nomVariable = "POLLO ENTERO LIMPIO"; // o lo que corresponda

            fetch('http://localhost:8000/api/graficDataPreuProducte', {
                method: "POST",
                headers: {
                    'Authorization': "Bearer " + tokenAcces,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"nomProducte": nomVariable})
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('La solicitud devolvió código de error en paso3 : ' + response.status + " || Mensaje de error: " + response.statusText);
                }
                return response.json();
            })
            .then(arrDataPreu => {
                //CRIDEM A LA FUNCIÓ DE FER EL GRÀFIC

                /*
                    // LES DADES TINDRAN AQUEST ASPECTE ON x es la data i y es el preu. 
                    // Tretes una per una amb solicitud post
                    let arrDataPreu = [
                        { "x": "2022-06-01", "y": 1 },
                        { "x": "2022-08-01", "y": 3 },
                        { "x": "2026-06-01", "y": 6 }
                    ];
                */

                fesGrafic(arrDataPreu);
            })
            .catch(error => {
                console.error('Error en paso3:', error);
            });





        }
        
    }, 200);





});

function fesGrafic(arrDataPreu) {
        const ctx = document.getElementById('myChart').getContext('2d');



    const myChart = new Chart(ctx, {
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
            type: 'time', // Escala temporal
            time: {
              unit: 'month',
              tooltipFormat: 'yyyy-MM-dd',
              displayFormats: {
                month: 'yyyy-MM'
              }
            },
            title: {
              display: true,
              text: 'Fecha',
              color: 'black'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Precio (€/kg o €)',
              color: 'black'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: ['Variación del coste a lo largo del tiempo'],
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