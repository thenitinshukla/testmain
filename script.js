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
});


document.addEventListener("DOMContentLoaded", function() {
    fetch('metrics.json')
        .then(response => response.json())
        .then(data => {
            // Update metric values
            document.getElementById('total-citations').textContent = data.citations;
            document.getElementById('num-publications').textContent = data.publications;
            document.getElementById('h-index').textContent = data.h_index;

            // Prepare data for chart
            const years = Object.keys(data.citations_per_year);
            const citationCounts = Object.values(data.citations_per_year);

            // Create chart
            const ctx = document.getElementById('publicationsChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: years,
                    datasets: [{
                        label: 'Citations Per Year',
                        data: citationCounts,
                        borderColor: 'blue',
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 5,
                        pointBackgroundColor: 'blue'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Year'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Citations'
                            }
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error loading metrics:', error));
});
