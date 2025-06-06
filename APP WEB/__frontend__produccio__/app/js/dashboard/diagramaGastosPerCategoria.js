document.addEventListener("DOMContentLoaded", () =>{
    const ctx = document.getElementById('miGraficoQueso').getContext('2d');
    const miGraficoQueso = new Chart(ctx, {
        type: 'pie',  // Aquí defines que es un gráfico de sectores
        data: {
            labels: ['Rojo', 'Azul', 'Amarillo', 'Verde', 'Morado'],  // etiquetas para cada sector
            datasets: [{
                label: 'Colores favoritos',
                data: [12, 19, 3, 5, 2],  // valores para cada sector
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
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
})

