document.addEventListener("DOMContentLoaded", () => {
    // Mobile navigation handling
    const mobileToggle = document.querySelector(".mobile-toggle");
    const mobileNavPanel = document.querySelector(".mobile-nav-panel");
    const closeBtn = document.querySelector(".close-btn");

    if (mobileToggle) {
        mobileToggle.addEventListener("click", () => {
            mobileNavPanel.classList.add("active");
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            mobileNavPanel.classList.remove("active");
        });
    }

    document.addEventListener("click", (e) => {
        if (mobileNavPanel && !mobileNavPanel.contains(e.target) && mobileToggle && !mobileToggle.contains(e.target)) {
            mobileNavPanel.classList.remove("active");
        }
    });

    // Chart initialization
    let publicationsChart = null;

    // Fetch and display metrics - using proper error handling
    fetch('metrics.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Update metrics display
            if (document.getElementById('total-citations')) {
                document.getElementById('total-citations').textContent = data.citations;
            }
            if (document.getElementById('num-publications')) {
                document.getElementById('num-publications').textContent = data.publications;
            }
            if (document.getElementById('h-index')) {
                document.getElementById('h-index').textContent = data.h_index;
            }

            // Destroy existing chart if it exists
            if (publicationsChart) {
                publicationsChart.destroy();
            }

            // Create citations chart if data exists
            const chartElement = document.getElementById('publicationsChart');
            if (chartElement && data.citations_per_year && Object.keys(data.citations_per_year).length > 0) {
                const ctx = chartElement.getContext('2d');
                const citationYears = Object.keys(data.citations_per_year).sort();
                const citationCounts = citationYears.map(year => data.citations_per_year[year]);

                publicationsChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: citationYears,
                        datasets: [{
                            label: 'Citations per Year',
                            data: citationCounts,
                            backgroundColor: 'rgba(54, 162, 235, 0.7)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                            borderRadius: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Citation History',
                                font: { size: 18, weight: 'bold' },
                                padding: 20
                            },
                            legend: { display: false }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: { 
                                    display: true, 
                                    text: 'Number of Citations',
                                    font: { weight: 'bold' }
                                },
                                grid: { color: 'rgba(0,0,0,0.05)' }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Year',
                                    font: { weight: 'bold' }
                                },
                                grid: { display: false }
                            }
                        }
                    }
                });
            } else {
                console.error('Chart element not found or no citation data available');
                if (chartElement && chartElement.parentElement) {
                    chartElement.parentElement.innerHTML = 
                        '<p class="text-danger text-center">Failed to load citation data</p>';
                }
            }
        })
        .catch(error => {
            console.error('Error fetching metrics data:', error);
            
            // Provide fallback data if fetch fails
            const fallbackData = {
                "citations": "796",
                "publications": "384",
                "h_index": "15",
                "citations_per_year": {
                    "2007": 7, "2008": 19, "2009": 16, "2010": 20,
                    "2011": 23, "2012": 28, "2013": 22, "2014": 13,
                    "2015": 40, "2016": 49, "2017": 51, "2018": 60,
                    "2019": 61, "2020": 65, "2021": 51, "2022": 84,
                    "2023": 77, "2024": 100, "2025": 7
                }
            };
            
            // Update metrics with fallback data
            if (document.getElementById('total-citations')) {
                document.getElementById('total-citations').textContent = fallbackData.citations;
            }
            if (document.getElementById('num-publications')) {
                document.getElementById('num-publications').textContent = fallbackData.publications;
            }
            if (document.getElementById('h-index')) {
                document.getElementById('h-index').textContent = fallbackData.h_index;
            }
            
            // Create chart with fallback data
            const chartElement = document.getElementById('publicationsChart');
            if (chartElement) {
                const ctx = chartElement.getContext('2d');
                const citationYears = Object.keys(fallbackData.citations_per_year).sort();
                const citationCounts = citationYears.map(year => fallbackData.citations_per_year[year]);
                
                publicationsChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: citationYears,
                        datasets: [{
                            label: 'Citations per Year',
                            data: citationCounts,
                            backgroundColor: 'rgba(54, 162, 235, 0.7)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                            borderRadius: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Citation History',
                                font: { size: 18, weight: 'bold' },
                                padding: 20
                            },
                            legend: { display: false }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: { 
                                    display: true, 
                                    text: 'Number of Citations',
                                    font: { weight: 'bold' }
                                },
                                grid: { color: 'rgba(0,0,0,0.05)' }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Year',
                                    font: { weight: 'bold' }
                                },
                                grid: { display: false }
                            }
                        }
                    }
                });
            }
        });
});

function openEmailEditor(email) {
    window.location.href = `mailto:${email}`;
    setTimeout(() => {
        if (!document.hidden && !window.location.href.startsWith('mailto:')) {
            navigator.clipboard.writeText(email).then(() => {
                alert('Email copied: ' + email);
            }).catch(err => {
                console.error('Could not copy email: ', err);
            });
        }
    }, 1000);
}
