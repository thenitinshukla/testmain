const ctx = document.getElementById('publicationsChart').getContext('2d');
const publicationsChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Total Citations', 'Number of Publications', 'H-index'],
        datasets: [{
            label: 'Metrics',
            data: [data.citations, data.publications, data.h_index],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
