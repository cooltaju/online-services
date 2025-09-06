document.addEventListener('DOMContentLoaded', () => {
    const vacanciesContainer = document.getElementById('vacancies-container');

    // This script is designed to work on the vacancies.html page
    if (vacanciesContainer) {
        fetch('vacancies.json')
            .then(response => {
                // Check if the file was found and the response is ok
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                vacanciesContainer.innerHTML = ''; // Clear the initial loading spinner

                if (data && data.length > 0) {
                    // Using Bootstrap's accordion component to display jobs
                    const accordion = document.createElement('div');
                    accordion.className = 'accordion';
                    accordion.id = 'vacanciesAccordion';

                    data.forEach((job, index) => {
                        const accordionItem = document.createElement('div');
                        accordionItem.className = 'accordion-item';

                        accordionItem.innerHTML = `
                            <h2 class="accordion-header" id="heading${index}">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                                    <strong>${job.title}</strong>
                                </button>
                            </h2>
                            <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}" data-bs-parent="#vacanciesAccordion">
                                <div class="accordion-body">
                                    <p><strong>जरूरी दस्तावेज़ (Required Documents):</strong> ${job.documents}</p>
                                    <a href="${job.link}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">अप्लाई करें</a>
                                </div>
                            </div>
                        `;
                        accordion.appendChild(accordionItem);
                    });
                    vacanciesContainer.appendChild(accordion);
                } else {
                    // If there are no jobs in the json file
                    vacanciesContainer.innerHTML = '<p class="text-center">अभी कोई नई नौकरी उपलब्ध नहीं है।</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching vacancies:', error);
                // Display a user-friendly error message
                vacanciesContainer.innerHTML = '<p class="text-center">नौकरियों की जानकारी लोड करने में कोई समस्या हुई। कृपया बाद में प्रयास करें।</p>';
            });
    }
});
