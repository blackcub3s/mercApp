let miGraficoQuesoInstance = null; // VARIABLE GLOBAL: guarda la instancia del chart

document.addEventListener("DOMContentLoaded", () => {

    const tokenAcces = localStorage.getItem("AccessToken");

    fetch('http://localhost:8000/api/gastosPerCategoria', {
        method: "GET",
        headers: {
            'Authorization': "Bearer " + tokenAcces,
            'Accept': 'application/json' 
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('La solicitud devolvió código de error : ' + response.status + " || Mensaje de error: " + response.statusText);
        }
        return response.json();
    })
    .then(diccCategoriaCuartos=> {     
        
        arrCategoriaGastos = []
        for (const clauCategoria in diccCategoriaCuartos) {
            if (diccCategoriaCuartos.hasOwnProperty(clauCategoria)) {
                 arrCategoriaGastos.push(diccCategoriaCuartos[clauCategoria]);
            }
        }

        // Destruir chart anterior si existe
        if (miGraficoQuesoInstance) {
            miGraficoQuesoInstance.destroy();
            miGraficoQuesoInstance = null;
        }

        const ctx = document.getElementById('miGraficoQueso').getContext('2d');
        miGraficoQuesoInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.values(categoriesTEXT),
                datasets: [{
                    label: 'Gastos por categoría',
                    data: arrCategoriaGastos,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(255, 159, 64, 0.7)',
                        'rgba(135, 206, 235, 0.7)',
                        'rgba(255, 192, 203, 0.7)',
                        'rgba(128, 128, 128, 0.7)',
                        'rgba(0, 0, 0, 0.7)',
                        'rgba(255, 255, 255, 0.7)',
                        'rgba(139, 69, 19, 0.7)',
                        'rgba(64, 224, 208, 0.7)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(135, 206, 235, 1)',
                        'rgba(255, 192, 203, 1)',
                        'rgba(128, 128, 128, 1)',
                        'rgba(0, 0, 0, 1)',
                        'rgba(255, 255, 255, 1)',
                        'rgba(139, 69, 19, 1)',
                        'rgba(64, 224, 208, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    title: {
                        display: false,
                        text: 'Gastos por categoría de producto'
                    }
                }
            }
        });

        //TO DO
    })
    .catch(error => {
        console.error('Error en paso3:', error);
    });


    //ARA CARREGUEM LES OPTIONS DINS EL DROP DOWN DEL PIECHART
    const temporitzadorDropDown_cheesePie = setInterval(() => {
        if (typeof oMesosNOU === "undefined") {
            console.log("encara no es pot agafar el oMesosNOU");
        } else {
            clearInterval(temporitzadorDropDown_cheesePie);
            const dropDownFormatge = document.getElementById("filtradorFormatge");
            emplenaDropDown(dropDownFormatge); 
            posaInformacio_a_h2_topGrafic_formatge(dropDownFormatge.firstElementChild.textContent, dropDownFormatge.firstElementChild.getAttribute("gast-mensual-info"));
        }
    }, 100);


    const selectFiltradorFormatge = document.getElementById('filtradorFormatge');
    
            
selectFiltradorFormatge.addEventListener("change", () => {
    const oSeleccio = selectFiltradorFormatge.selectedOptions[0];

    // ---------25-01 --------------Enero 2025 -----------140.45--------
    console.log(oSeleccio.value, oSeleccio.textContent, oSeleccio.getAttribute("gast-mensual-info"));

    //actualitzar títol
    posaInformacio_a_h2_topGrafic_formatge(oSeleccio.textContent, oSeleccio.getAttribute("gast-mensual-info"));

    fetch(`http://localhost:8000/api/gastosPerCategoria/${oSeleccio.value}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + tokenAcces,
            "Accept": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(diccCategoriaCuartos => {
        // UACTUALITZAR GRÀFIC
        miGraficoQuesoInstance.data.datasets[0].data = Object.values(diccCategoriaCuartos);
        console.log(diccCategoriaCuartos);
        console.log(Object.values(diccCategoriaCuartos))
        miGraficoQuesoInstance.update();
    })
    .catch(error => {
        console.error("Error:", error);
    });
});



    
});


//PRE: dropDownFormatge: un drop down de tipus select
//     oMesosNOU: objecte que viu com a variable global amb parells claus valor dels mesos que tenen gasto
//POST: el drop down es veu emplenat d'aquesta manera:
//          <option value="2026-04" data-gastmes="323.3">abril 2026</option>
function emplenaDropDown(dropDownFormatge) {
    
    let gastTotal = 0;
    const optionetaInicial = document.getElementById("opcioSenseFiltre");
    optionetaInicial.setAttribute("value", "");
    

    Object.entries(oMesosNOU).forEach(([clauMes, gastMensual]) => {
        const optioneta = document.createElement("option");
        optioneta.setAttribute("value", clauMes);
        optioneta.setAttribute("gast-mensual-info", gastMensual);
        optioneta.innerText = ` ${aaaamm__a__mesCompletAAAA(clauMes)}`;
        dropDownFormatge.appendChild(optioneta);

        gastTotal = gastTotal + gastMensual; //acumulo el gast mes a mes
    });

    //relleno la opcio inicial per tal de poder mostrar el gast global al llarg de tots els mesos.
    optionetaInicial.setAttribute("gast-mensual-info", gastTotal.toFixed(2));
}


//PRE: un mes en format aaaa-mm.
//POST: el mes en format gener 2026, o març 2021... etc en castellà
function aaaamm__a__mesCompletAAAA(aaaamm) {
    const meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    const [anyo, mes] = aaaamm.split("-");
    const mesTexto = meses[parseInt(mes, 10) - 1];
    const mesAnyoFormateados = mesTexto + " " + anyo;
    return mesAnyoFormateados;
}

//PRE: mes --> strgnn format "Octubre 2025"
//     gastMes --> quantitat amb gasto "333.45" o el que sigui.
//
function posaInformacio_a_h2_topGrafic_formatge(mes, gastMes) {
    const h2SpanDATAMES = document.querySelector("#gastoTotalPeriodeTemporal span:first-child");
    const h2SpanGASTMES = document.querySelector("#gastoTotalPeriodeTemporal span:nth-child(2)");
    
    h2SpanDATAMES.innerHTML = "("+mes.trim()+"):";
    h2SpanGASTMES.innerHTML = " "+gastMes+ " €";
}