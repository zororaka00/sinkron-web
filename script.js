document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const skillsGrid = document.getElementById('skillsGrid');

    // Load skills from local JSON file (no external fetch to clawhub.ai)
    fetch('skills.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load skills.json');
            }
            return response.json();
        })
        .then(skills => {
            // Generate skill cards dynamically
            skills.forEach(skill => {
                const card = document.createElement('div');
                card.className = 'skill-card';
                card.setAttribute('data-category', skill.category || 'other');

                card.innerHTML = `
                    <div class="card-face front">
                        <h3>${skill.name}</h3>
                        <p>${skill.short_desc}</p>
                        <div class="card-icon">${skill.icon || '🛠️'}</div>
                    </div>
                    <div class="card-face back">
                        <h3>${skill.back_title || skill.name}</h3>
                        <ul>
                            ${skill.features.map(f => `<li>${f}</li>`).join('')}
                        </ul>
                        <span class="status ${skill.status || 'available'}">
                            ${skill.status === 'available' ? 'Available' : 'Coming Soon'}
                        </span>
                        <a href="${skill.url}" target="_blank" class="skill-link">View on ClawHub</a>
                    </div>
                `;

                skillsGrid.appendChild(card);
            });

            // Attach event listeners after cards are created
            const skillCards = document.querySelectorAll('.skill-card');

            // Search functionality
            searchInput.addEventListener('input', function (e) {
                const searchTerm = e.target.value.toLowerCase();

                skillCards.forEach(card => {
                    const cardText = card.textContent.toLowerCase();
                    if (cardText.includes(searchTerm)) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeIn 0.3s ease-in';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });

            // Hover & click effects
            skillCards.forEach(card => {
                card.addEventListener('mouseenter', function () {
                    this.style.transform = 'translateZ(20px) rotateY(5deg)';
                });

                card.addEventListener('mouseleave', function () {
                    this.style.transform = '';
                });

                card.addEventListener('click', function () {
                    this.style.animation = 'pulse 0.5s ease-in-out';
                    setTimeout(() => {
                        this.style.animation = '';
                    }, 500);
                });
            });

            // Escape key reset search
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') {
                    searchInput.value = '';
                    skillCards.forEach(card => {
                        card.style.display = 'block';
                    });
                }
            });
        })
        .catch(error => {
            console.error('Error loading skills:', error);
            skillsGrid.innerHTML = '<p style="text-align:center; color:#ff6b6b; padding: 2rem;">Failed to load skills. Please check if skills.json exists in the same folder.</p>';
        });
});

// Global pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%   { transform: scale(1);   }
        50%  { transform: scale(1.05); }
        100% { transform: scale(1);   }
    }
`;
document.head.appendChild(style);