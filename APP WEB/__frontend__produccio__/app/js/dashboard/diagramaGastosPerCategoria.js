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
            if (diccCategoriaCuartos.hasOwnProperty(clauCategoria)) {   // per assegurar-te que és propi i no heretat
                 arrCategoriaGastos.push(diccCategoriaCuartos[clauCategoria]);
            }
        }





    

        const ctx = document.getElementById('miGraficoQueso').getContext('2d');
            const miGraficoQueso = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: Object.values(categoriesTEXT),  // etiquetas en orden
                    datasets: [{
                        label: 'Gastos por categoría',
                        data: arrCategoriaGastos, //[12, 19, 3, 5, 2, 7, 8, 4, 6, 3, 1, 2, 9],  // ejemplo de dades
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
        }
    }, 100);


    //ARA CREEM L'ESDEVENIMENT QUE PERMETRÀ 
    //ACTIVAR EL FETCH A L'ENDPOINT CORRESPONENT --> /api/gastosPerCategoria/{aaaa-mm}
    const selectFiltradorFormatge = document.getElementById('filtradorFormatge');
    
    
    selectFiltradorFormatge.addEventListener('change', (evento) => {
        const oSeleccio= selectFiltradorFormatge.selectedOptions[0];  //opcio sel·leccionada
        console.log(oSeleccio.value, oSeleccio.textContent, oSeleccio.getAttribute("gast-mensual-info"));
        //FER EL FETCH AQUI
    });




});







//PRE: dropDownFormatge: un drop down de tipus select
//     oMesosNOU: objecte que viu com a variable global amb parells claus valor dels mesos que tenen gasto
//        exemple {2025-07: 62.65, 2025-06: 93.48, 2025-05: 95.04, 2025-04: 167.97, ....
//POST: el drop down es veu emplenat d'aquesta manera:

//          <option value="2026-04" data-gastmes="323.3">abril 2026</option>
//          <option value="2026-03" data-gastmes="313.3">marzo 2026</option>
//          <option value="2026-02" data-gastmes="303.3">febrero 2026</option>
function emplenaDropDown(dropDownFormatge) {

    Object.entries(oMesosNOU).forEach(([clauMes, gastMensual]) => {
        //console.log(`${clauMes}: ${gastMensual}`);
        const optioneta = document.createElement("option");
        optioneta.setAttribute("value", clauMes);
        optioneta.setAttribute("gast-mensual-info", gastMensual); //info extar que usare mes endavant
        optioneta.innerText = ` ${aaaamm__a__mesCompletAAAA(clauMes)}`;  //poso el mes i any visible en el dropdown
        dropDownFormatge.appendChild(optioneta);
        //SEGUIR AQUI! FER FETCH!
    });
        
    
}




//PRE: un mes en format aaaa-mm.
//POST: el mes en format gener 2026, o març 2021... etc en castewlla
function aaaamm__a__mesCompletAAAA(aaaamm) {
    // Array con los meses en español
    const meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    // Separar año y mes
    const [anyo, mes] = aaaamm.split("-");

    // Obtener el mes (restamos 1 porque el array empieza en 0)
    const mesTexto = meses[parseInt(mes, 10) - 1];

    // Obtener los dos últimos dígitos del año

    // Concatenar resultado
    const mesAnyoFormateados = mesTexto + " " + anyo;

    return mesAnyoFormateados;
}






    