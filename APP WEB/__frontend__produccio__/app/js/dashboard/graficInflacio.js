 document.addEventListener("DOMContentLoaded", () => {

    const ctx = document.getElementById('myChart').getContext('2d');

    // Datos de ejemplo con fechas en string ISO
    let arrDataPreu = [
      { x: "2022-06-01", y: 1 },
      { x: "2022-08-01", y: 3 },
      { x: "2026-06-01", y: 6 }
    ];

    const myChart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: "Evolució del preu",
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
            text: ['Inflalyzer'],
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

  });