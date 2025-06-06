document.addEventListener("DOMContentLoaded", () => {


    const ctx = document.getElementById('miGraficoQueso').getContext('2d');
    const miGraficoQueso = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.values(categoriesTEXT),  // etiquetas en orden
            datasets: [{
                label: 'Gastos por categoría',
                data: [100, 19, 3, 5, 2, 7, 8, 4, 6, 3, 1, 2, 9],  // ejemplo de datos
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
});
