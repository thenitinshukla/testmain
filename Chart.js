document.addEventListener("DOMContentLoaded", () => {
    // ... (Your existing code for mobile navigation, contact, etc.) ...

    fetch('metrics.json')
        .then(response => response.json())
        .then(data => {
            // Update metrics
            document.getElementById('total-citations').textContent = data.citations;
            document.getElementById('num-publications').textContent = data.publications;
            document.getElementById('h-index').textContent = data.h_index;

            // Create citation chart (histogram)
            if (data.citations_per_year) { // Check if citation data is available
                const ctx = document.getElementById('publicationsChart').getContext('2d');
                const citationYears = Object.keys(data.citations_per_year);
                const citationCounts = Object.values(data.citations_per_year);

                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: citationYears,
                        datasets: [{
                            label: 'Citations per Year',
                            data: citationCounts,
                            backgroundColor: 'rgba(54, 162, 235, 0.7)', // Slightly transparent blue
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true, // Make the chart responsive
                        maintainAspectRatio: false, // Allow custom aspect ratio
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Number of Citations'
                                },
                                ticks: {
                                    stepSize: 1, // Ensure integer ticks for citations
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Year'
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false // Hide the legend
                            },
                            title: {
                                display: true,
                                text: 'Citations per Year',
                                font: {
                                    size: 16
                                }
                            }
                        }
                    }
                });
            } else {
              console.log("citations_per_year data not found in metrics.json")
            }
        })
        .catch(error => console.error('Error fetching metrics:', error));
});
