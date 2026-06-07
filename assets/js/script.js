let contentData = null;
let numDisplayedCards = 4; // Nombre de cartes affichées dans horizontal

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

    // Journal - Keep as roadmap
    document.getElementById('journal-section-title').textContent = contentData.journal.title;

    // Gallery - Random photos from all folders that change
    document.getElementById('gallery-title').textContent = contentData.gallery.title;
    const bentoGrid = document.getElementById('bento-grid');

    // Get random images from all chapters
    let allImages = [];
    contentData.chapters.forEach(chapter => {
        allImages = allImages.concat(chapter.images);
    });

    // Shuffle and pick first 5
    function getRandomPhotos() {
        return allImages.sort(() => 0.5 - Math.random()).slice(0, 5);
    }

    let currentPhotos = getRandomPhotos();
    displayPhotos(bentoGrid, currentPhotos);

    // Change photos every 2 seconds with fade effect
    setInterval(() => {
        // Fade out
        const items = document.querySelectorAll('.bento-item');
        items.forEach(item => {
            item.style.opacity = '0';
        });

        // After fade out, change content and fade in
        setTimeout(() => {
            currentPhotos = getRandomPhotos();
            bentoGrid.innerHTML = '';
            displayPhotos(bentoGrid, currentPhotos);

            // Fade in new photos
            const newItems = document.querySelectorAll('.bento-item');
            newItems.forEach(item => {
                item.style.opacity = '1';
            });
        }, 400); // Half of the 0.8s transition time
    }, 2000); // Change every 2 seconds

    // BUSAN CHAPTER - Section 4
    createChapterSection('busan-section', contentData.chapters[0]);

    // Horizontal cards - Show ONLY FIRST 4 BUSAN images - Section 5
    const hContainer = document.getElementById('horizontal-container');
    const hTrack = document.getElementById('horizontal-track');
    const busanChapter = contentData.chapters[0]; // Busan
    const busanImages = busanChapter.images.slice(0, 4);

    busanImages.forEach(imgPath => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'horizontal-card';
        const bgStyle = `background-image: url('${imgPath}'); background-size: cover; background-position: center;`;
        cardDiv.innerHTML = `
            <div class="film-content">
                <div class="film-video media-placeholder" style="${bgStyle}">
                </div>
                <div class="film-caption">
                    <h3>${busanChapter.title}</h3>
                    <p>Exploring the beauty of Busan</p>
                </div>
            </div>
        `;
        hTrack.appendChild(cardDiv);
    });

    // Adjust horizontal section height based on number of images
    const numImages = busanImages.length;
    hTrack.style.width = (numImages * 100) + 'vw';
    hContainer.style.height = (numImages * 100) + 'vh';

    // FOOD CHAPTER - Section 6
    createChapterSection('food-section', contentData.chapters[1]);

    // Accordion - Show ONLY FIRST 4 Food images - Section 7
    document.getElementById('accordion-title').textContent = 'Hidden Gems & Unforgettable Experiences - Food Moments';
    const accordionContainer = document.getElementById('accordion-container');
    const foodChapter = contentData.chapters[1]; // Food
    foodChapter.images.slice(0, 4).forEach((imgPath, index) => {
        const div = document.createElement('div');
        div.className = 'accordion-item media-placeholder';
        div.style.backgroundImage = `url('${imgPath}')`;
        div.style.backgroundSize = 'cover';
        div.style.backgroundPosition = 'center';
        div.innerHTML = `
            <div class="accordion-content">
                <h3>${foodChapter.title}</h3>
                <p>Photo ${index + 1}</p>
            </div>
        `;
        accordionContainer.appendChild(div);
    });

    // SEOUL CHAPTER - Section 8
    createChapterSection('seoul-section', contentData.chapters[2]);

    // Parallax - Keep as intro to Project/BISF - Section 9
    document.getElementById('parallax-title').textContent = contentData.parallax.title;
    document.getElementById('parallax-text').textContent = contentData.parallax.text;

    // PROJECT/BISF CHAPTER - Section 10
    createChapterSection('project-section', contentData.chapters[3]);

    // CONCLUSION CHAPTER - Section 11
    const conclusionSection = document.getElementById('conclusion-section');
    const conclusion = contentData.conclusion;
    const conclusionDiv = document.createElement('section');
    conclusionDiv.className = 'polaroid-section conclusion-section';

    const conclusionTitle = document.createElement('h2');
    conclusionTitle.className = 'section-title';
    conclusionTitle.textContent = conclusion.title;

    const conclusionDesc = document.createElement('p');
    conclusionDesc.className = 'chapter-description conclusion-description';
    conclusionDesc.textContent = conclusion.description;

    const conclusionContainer = document.createElement('div');
    conclusionContainer.className = 'polaroid-container';

    conclusion.images.forEach((imgPath, imgIndex) => {
        const polaroidDiv = document.createElement('div');
        polaroidDiv.className = `polaroid p${imgIndex + 1}`;
        polaroidDiv.innerHTML = `
            <div class="media-placeholder" style="background-image: url('${imgPath}'); background-size: cover; background-position: center;"></div>
            <div class="polaroid-caption">Moments & Memories</div>
        `;
        conclusionContainer.appendChild(polaroidDiv);
    });

    conclusionDiv.appendChild(conclusionTitle);
    conclusionDiv.appendChild(conclusionDesc);
    conclusionDiv.appendChild(conclusionContainer);
    conclusionSection.appendChild(conclusionDiv);

    // Initialize scroll logic
    initializeScrollLogic();
}

function createChapterSection(containerId, chapter) {
    const container = document.getElementById(containerId);
    const sectionDiv = document.createElement('section');
    sectionDiv.className = 'polaroid-section';

    const titleDiv = document.createElement('h2');
    titleDiv.className = 'section-title';
    titleDiv.textContent = chapter.title;

    const descDiv = document.createElement('p');
    descDiv.className = 'chapter-description';
    descDiv.textContent = chapter.description;

    const polaroidContainer = document.createElement('div');
    polaroidContainer.className = 'polaroid-container';

    chapter.images.forEach((imgPath, imgIndex) => {
        const polaroidDiv = document.createElement('div');
        polaroidDiv.className = `polaroid p${imgIndex + 1}`;
        polaroidDiv.innerHTML = `
            <div class="media-placeholder" style="background-image: url('${imgPath}'); background-size: cover; background-position: center;"></div>
            <div class="polaroid-caption">${chapter.title} - Photo ${imgIndex + 1}</div>
        `;
        polaroidContainer.appendChild(polaroidDiv);
    });

    sectionDiv.appendChild(titleDiv);
    sectionDiv.appendChild(descDiv);
    sectionDiv.appendChild(polaroidContainer);
    container.appendChild(sectionDiv);
}

function displayPhotos(container, photos) {
    contentData.gallery.items.slice(0, 5).forEach((item, index) => {
        if (index < photos.length) {
            const div = document.createElement('div');
            div.className = `bento-item ${item.class} media-placeholder`;
            div.style.backgroundImage = `url('${photos[index]}')`;
            div.style.backgroundSize = 'cover';
            div.style.backgroundPosition = 'center';
            container.appendChild(div);
        }
    });
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

        const maxTranslateX = (numDisplayedCards - 1) * 100;
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

document.addEventListener("DOMContentLoaded", () => {
    loadContent();
    initializeLightbox();
});

function initializeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');

    // Open lightbox on image click
    document.addEventListener('click', function(event) {
        const target = event.target;

        // Check if clicked element is an image
        if (target.tagName === 'IMG') {
            const src = target.src;
            if (src && !src.includes('data:')) {
                lightboxImage.src = src;
                lightbox.classList.add('active');
            }
        }

        // Check if clicked element has background-image
        if (target.classList.contains('media-placeholder') ||
            target.classList.contains('bento-item') ||
            target.classList.contains('accordion-item') ||
            target.classList.contains('polaroid')) {

            const bgImage = window.getComputedStyle(target).backgroundImage;
            if (bgImage && bgImage.includes('url')) {
                const url = bgImage.replace(/url\(['"]?([^'")]+)['"]?\)/g, '$1');
                if (url && !url.includes('data:')) {
                    lightboxImage.src = url;
                    lightbox.classList.add('active');
                }
            }
        }
    });

    // Close lightbox on close button click
    lightboxClose.addEventListener('click', function() {
        lightbox.classList.remove('active');
    });

    // Close lightbox on background click
    lightbox.addEventListener('click', function(event) {
        if (event.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });

    // Close lightbox on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            lightbox.classList.remove('active');
        }
    });
}
