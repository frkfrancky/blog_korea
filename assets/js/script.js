let contentData = null;

async function loadContent() {
    try {
        const response = await fetch('content.json');
        contentData = await response.json();
        populateContent();
    } catch (error) {
        console.error('Erreur lors du chargement du contenu:', error);
    }
}

function populateContent() {
    if (!contentData) return;

    // Hero
    document.getElementById('hero-title').textContent = contentData.hero.title;
    document.getElementById('hero-subtitle').textContent = contentData.hero.subtitle;

    // Journal
    document.getElementById('journal-section-title').textContent = contentData.journal.title;

    // Gallery
    document.getElementById('gallery-title').textContent = contentData.gallery.title;
    const bentoGrid = document.getElementById('bento-grid');
    contentData.gallery.items.forEach(item => {
        const div = document.createElement('div');
        div.className = `bento-item ${item.class} media-placeholder`;
        if (item.img) {
            div.style.backgroundImage = `url('${item.img}')`;
            div.style.backgroundSize = 'cover';
            div.style.backgroundPosition = 'center';
        } else {
            div.style.background = item.gradient;
        }
        div.textContent = item.text;
        bentoGrid.appendChild(div);
    });

    // Horizontal cards
    const hTrack = document.getElementById('horizontal-track');
    contentData.horizontal.cards.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'horizontal-card';
        const bgStyle = card.img ? `background-image: url('${card.img}'); background-size: cover; background-position: center;` : `background: ${card.bgColor};`;
        cardDiv.innerHTML = `
            <div class="film-content">
                <div class="film-video media-placeholder" style="${bgStyle}">
                    ▶ ${card.video}
                </div>
                <div class="film-caption">
                    <h3>${card.title}</h3>
                    <p>${card.desc}</p>
                </div>
            </div>
        `;
        hTrack.appendChild(cardDiv);
    });

    // Accordion
    document.getElementById('accordion-title').textContent = contentData.accordion.title;
    const accordionContainer = document.getElementById('accordion-container');
    contentData.accordion.items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'accordion-item media-placeholder';
        if (item.img) {
            // Lazy load background images
            div.style.backgroundImage = `url('${item.img}')`;
            div.style.backgroundSize = 'cover';
            div.style.backgroundPosition = 'center';
            div.style.backgroundAttachment = 'fixed';
        } else {
            div.style.background = item.gradient;
        }
        div.innerHTML = `
            <div class="accordion-content">
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
            </div>
        `;
        accordionContainer.appendChild(div);
    });

    // Parallax
    document.getElementById('parallax-title').textContent = contentData.parallax.title;
    document.getElementById('parallax-text').textContent = contentData.parallax.text;

    // Polaroids
    document.getElementById('polaroid-title').textContent = contentData.polaroids.title;
    const polaroidContainer = document.getElementById('polaroid-container');
    contentData.polaroids.photos.forEach(photo => {
        const div = document.createElement('div');
        div.className = `polaroid ${photo.id}`;
        const bgStyle = photo.img ? `background-image: url('${photo.img}'); background-size: cover; background-position: center;` : `background: ${photo.bgColor};`;
        div.innerHTML = `
            <div class="media-placeholder" style="${bgStyle}"></div>
            <div class="polaroid-caption">${photo.caption}</div>
        `;
        polaroidContainer.appendChild(div);
    });

    // Footer
    document.getElementById('footer-title').textContent = contentData.footer.title;
    document.getElementById('footer-copyright').textContent = contentData.footer.copyright;

    // Initialize scroll logic after content is loaded
    initializeScrollLogic();
}

function initializeScrollLogic() {
    const stickyJournal = document.getElementById("sticky-journal");
    const planeIcon = document.getElementById("plane-icon");
    const progressPoints = document.querySelectorAll(".progress-point");

    const journalCard = document.getElementById("journal-card");
    const journalImg = document.getElementById("journal-img");
    const journalTitle = document.getElementById("journal-title");
    const journalDesc = document.getElementById("journal-desc");

    const voyageData = contentData.journal.stages;
    let currentStep = -1;

    const hContainer = document.getElementById("horizontal-container");
    const hTrack = document.getElementById("horizontal-track");
    let ticking = false;

    function onScroll() {
        const journalRect = stickyJournal.getBoundingClientRect();
        const journalScrollable = journalRect.height - window.innerHeight;
        let journalProgress = 0;

        if (journalScrollable > 0) {
            journalProgress = -journalRect.top / journalScrollable;
        }
        journalProgress = Math.max(0, Math.min(1, journalProgress || 0));

        planeIcon.style.left = `calc(${journalProgress * 100}% - ${journalProgress * 40}px)`;

        let step = Math.min(3, Math.max(0, Math.floor(journalProgress / 0.33)));

        if (step !== currentStep && voyageData[step]) {
            journalCard.style.opacity = 0;
            journalCard.style.transform = "translateY(20px)";

            setTimeout(() => {
                journalTitle.textContent = voyageData[step].title;
                journalDesc.textContent = voyageData[step].desc;
                if (voyageData[step].img) {
                    journalImg.style.backgroundImage = `url('${voyageData[step].img}')`;
                    journalImg.style.backgroundSize = 'cover';
                    journalImg.style.backgroundPosition = 'center';
                    journalImg.textContent = '';
                } else {
                    journalImg.style.background = voyageData[step].color;
                    journalImg.textContent = voyageData[step].img;
                }

                journalCard.style.opacity = 1;
                journalCard.style.transform = "translateY(0)";
            }, 300);

            currentStep = step;
        }

        progressPoints.forEach((point, index) => {
            const pointPos = index * 0.33;
            if (journalProgress >= pointPos - 0.05) {
                point.classList.add('active');
            } else {
                point.classList.remove('active');
            }
        });

        const hRect = hContainer.getBoundingClientRect();
        const hScrollable = hRect.height - window.innerHeight;
        let hProgress = 0;

        if (hRect.top <= 0 && hRect.bottom >= window.innerHeight) {
            hProgress = -hRect.top / hScrollable;
        } else if (hRect.bottom < window.innerHeight) {
            hProgress = 1;
        }

        hProgress = Math.max(0, Math.min(1, hProgress || 0));

        const maxTranslateX = (contentData.horizontal.cards.length - 1) * 100;
        hTrack.style.transform = `translateX(-${hProgress * maxTranslateX}vw)`;

        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });

    onScroll();
}

document.addEventListener("DOMContentLoaded", loadContent);
