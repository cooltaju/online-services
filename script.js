document.addEventListener('DOMContentLoaded', () => {
    const vacanciesContainer = document.getElementById('vacancies-container');
    const admitCardsContainer = document.getElementById('admit-cards-container');

    // Function to render job items into a given container
    function renderJobs(container, jobs, emptyMessage) {
        container.innerHTML = ''; // Clear loading spinner or previous content
        if (jobs && jobs.length > 0) {
            const accordion = document.createElement('div');
            accordion.className = 'accordion';
            accordion.id = container.id + 'Accordion'; // Unique ID for each accordion

            jobs.forEach((job, index) => {
                const accordionItem = document.createElement('div');
                accordionItem.className = 'accordion-item';

                accordionItem.innerHTML = `
                    <h2 class="accordion-header" id="heading${container.id}-${index}">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${container.id}-${index}" aria-expanded="false" aria-controls="collapse${container.id}-${index}">
                            <strong>${job.title}</strong>
                        </button>
                    </h2>
                    <div id="collapse${container.id}-${index}" class="accordion-collapse collapse" aria-labelledby="heading${container.id}-${index}" data-bs-parent="#${container.id}Accordion">
                        <div class="accordion-body">
                            <p><strong>जरूरी दस्तावेज़ (Required Documents):</strong> ${job.documents}</p>
                            <a href="${job.link}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">अप्लाई करें / देखें</a>
                        </div>
                    </div>
                `;
                accordion.appendChild(accordionItem);
            });
            container.appendChild(accordion);
        } else {
            container.innerHTML = `<p class="text-center">${emptyMessage}</p>`;
        }
    }

    // Only proceed if we are on the vacancies.html page (or a page with these containers)
    if (vacanciesContainer || admitCardsContainer) {
        fetch('vacancies.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                const jobVacancies = [];
                const admitCards = [];

                data.forEach(item => {
                    const titleLower = item.title.toLowerCase();
                    if (titleLower.includes('admit card') || titleLower.includes('admitcard') || titleLower.includes('प्रवेश पत्र') || titleLower.includes('एडमिट कार्ड')) {
                        admitCards.push(item);
                    } else {
                        jobVacancies.push(item);
                    }
                });

                // Render general job vacancies
                if (vacanciesContainer) {
                    renderJobs(vacanciesContainer, jobVacancies, 'अभी कोई नई नौकरी उपलब्ध नहीं है।');
                }

                // Render admit cards
                if (admitCardsContainer) {
                    renderJobs(admitCardsContainer, admitCards, 'अभी कोई एडमिट कार्ड उपलब्ध नहीं है।');
                }
            })
            .catch(error => {
                console.error('Error fetching vacancies:', error);
                if (vacanciesContainer) {
                    vacanciesContainer.innerHTML = '<p class="text-center">नौकरियों की जानकारी लोड करने में कोई समस्या हुई। कृपया बाद में प्रयास करें।</p>';
                }
                if (admitCardsContainer) {
                    admitCardsContainer.innerHTML = '<p class="text-center">एडमिट कार्ड की जानकारी लोड करने में कोई समस्या हुई। कृपया बाद में प्रयास करें।</p>';
                }
            });
    }
});