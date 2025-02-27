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


// This is for the contact
document.querySelector('a[href^="mailto"]').addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default behavior temporarily
        const email = 'n.shukla@cineca.it';
        
        // Try to open the mailto link
        window.location.href = `mailto:${email}`;
        
        // Set a timeout to check if the email client opened (optional fallback)
        setTimeout(() => {
            if (!document.hidden && !window.location.href.startsWith('mailto:')) {
                // If the email client didn't open (e.g., no default client), offer a fallback
                if (confirm(`Could not open your email client. Would you like to copy the email address (${email}) or open a web form?`)) {
                    // Copy email to clipboard
                    navigator.clipboard.writeText(email).then(() => {
                        alert('Email address copied to clipboard: ' + email);
                    }).catch(err => {
                        alert('Failed to copy email. Please manually copy: ' + email);
                    });
                }
            }
        }, 1000); // Check after 1 second
    });


function openEmailEditor(email) {
    // Try to open the mailto link
    window.location.href = `mailto:${email}`;
    
    // Set a timeout to check if the email client opened (1 second)
    setTimeout(() => {
        if (!document.hidden && !window.location.href.startsWith('mailto:')) {
            // If the email client didn’t open, copy the email to clipboard
            navigator.clipboard.writeText(email).then(() => {
                alert('Could not open your email app. Email address copied to clipboard: ' + email);
            }).catch(err => {
                alert('Failed to copy email. Please manually use: ' + email);
            });
        }
    }, 1000); // Check after 1 second
}


  fetch('metrics.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('total-citations').textContent = data.citations;
            document.getElementById('num-publications').textContent = data.publications;
            document.getElementById('h-index').textContent = data.h_index;
        })
        .catch(error => console.error('Error fetching metrics:', error));




