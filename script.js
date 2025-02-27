document.addEventListener("DOMContentLoaded", () => {
    // Mobile navigation handling
    const mobileToggle = document.querySelector(".mobile-toggle");
    const mobileNavPanel = document.querySelector(".mobile-nav-panel");
    const closeBtn = document.querySelector(".close-btn");

    mobileToggle.addEventListener("click", () => {
        mobileNavPanel.classList.add("active");
    });

    closeBtn.addEventListener("click", () => {
        mobileNavPanel.classList.remove("active");
    });

    document.addEventListener("click", (e) => {
        if (!mobileNavPanel.contains(e.target) && !mobileToggle.contains(e.target)) {
            mobileNavPanel.classList.remove("active");
        }
    });

    // Contact handling
    document.querySelector('a[href^="mailto"]').addEventListener('click', function(e) {
        e.preventDefault();
        const email = 'n.shukla@cineca.it';
        window.location.href = `mailto:${email}`;
        setTimeout(() => {
            if (!document.hidden && !window.location.href.startsWith('mailto:')) {
                if (confirm(`Could not open your email client. Would you like to copy the email address (${email}) or open a web form?`)) {
                    navigator.clipboard.writeText(email).then(() => {
                        alert('Email address copied to clipboard: ' + email);
                    }).catch(err => {
                        alert('Failed to copy email. Please manually copy: ' + email);
                    });
                }
            }
        }, 1000);
    });

    function openEmailEditor(email) {
        window.location.href = `mailto:${email}`;
        setTimeout(() => {
            if (!document.hidden && !window.location.href.startsWith('mailto:')) {
                navigator.clipboard.writeText(email).then(() => {
                    alert('Could not open your email app. Email address copied to clipboard: ' + email);
                }).catch(err => {
                    alert('Failed to copy email. Please manually use: ' + email);
                });
            }
        }, 1000);
    }

    // Fetch and display metrics
    fetch('metrics.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('total-citations').textContent = data.citations;
            document.getElementById('num-publications').textContent = data.publications;
            document.getElementById('h-index').textContent = data.h_index;

            // Create citation chart (histogram)
            if (data.citations_per_year) {
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
                            backgroundColor: 'rgba(54, 162, 235, 0.7)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Number of Citations'
                                },
                                ticks: {
                                    stepSize: 1,
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
                                display: false
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
                console.log("citations_per_year data not found in metrics.json");
            }
        })
        .catch(error => console.error('Error fetching metrics:', error));
});
