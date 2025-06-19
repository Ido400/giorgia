async function loadProfileImage() {
    try {
        // Try different possible filenames for the uploaded image
        const possibleFilenames = [
            'profile.JPG', 'profile.jpg', 'profile.jpeg', 'profile.png', 'profile.webp',
            'image.jpeg', 'image.jpg', 'image.png', 'image.webp',
            'IMG.jpeg', 'IMG.jpg', 'IMG.png', 'IMG.webp',
            'photo.jpeg', 'photo.jpg', 'photo.png', 'photo.webp',
            'giorgia.jpeg', 'giorgia.jpg', 'giorgia.png', 'giorgia.webp'
        ];

        let imageLoaded = false;

        for (const filename of possibleFilenames) {
            try {
                const img = new Image();
                img.crossOrigin = 'anonymous';

                const loadPromise = new Promise((resolve, reject) => {
                    img.onload = () => resolve(filename);
                    img.onerror = () => reject();
                    img.src = filename;
                });

                await loadPromise;

                // If we get here, image loaded successfully
                document.getElementById('profileImage').innerHTML = '';
                document.getElementById('profileImage').appendChild(img);
                img.alt = 'Giorgia Valente';
                console.log('Successfully loaded profile image:', filename);
                imageLoaded = true;
                break;

            } catch (e) {
                continue; // Try next filename
            }
        }

        if (!imageLoaded) {
            // Fallback to placeholder
            document.getElementById('profileImage').innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #000; font-size: 18px;">Professional Photo</div>';
            console.log('No profile image found, showing placeholder');
        }
    } catch (error) {
        console.log('Could not load profile image:', error);
        document.getElementById('profileImage').innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #000; font-size: 18px;">Professional Photo</div>';
    }
}

async function loadGalleryImages() {
    const galleryContainer = document.getElementById('photoGallery');
    let photosLoaded = 0;
    const maxPhotos = 40;

    // Clear any existing content
    galleryContainer.innerHTML = '';
    console.log('Starting to load gallery images...');

    // Create an array to store successfully loaded images
    const loadedImages = [];

    // Try to load images with different naming patterns
    for (let i = 1; i <= maxPhotos; i++) {
        const possiblePaths = [
            // Primary gallery paths
            `gallery/${i}.jpg`,
            `gallery/${i}.jpeg`,
            `gallery/${i}.png`,
            `gallery/${i}.webp`,
            `gallery/photo${i}.jpg`,
            `gallery/photo${i}.jpeg`,
            `gallery/photo${i}.png`,
            `gallery/img${i}.jpg`,
            `gallery/image${i}.jpg`,
            // Alternative formats
            `gallery/${String(i).padStart(2, '0')}.jpg`,
            `gallery/${String(i).padStart(3, '0')}.jpg`,
            `gallery/gallery${i}.jpg`,
            // Root directory fallbacks
            `gallery${i}.jpg`,
            `photo${i}.jpg`,
            `image${i}.jpg`
        ];

        let imageLoaded = false;

        for (const imagePath of possiblePaths) {
            try {
                const img = new Image();
                img.crossOrigin = 'anonymous';

                const loadPromise = new Promise((resolve, reject) => {
                    img.onload = () => resolve(imagePath);
                    img.onerror = () => reject();
                    // Set a timeout to avoid hanging
                    setTimeout(() => reject(), 3000);
                    img.src = imagePath;
                });

                const loadedPath = await loadPromise;

                // If we get here, image loaded successfully
                loadedImages.push({
                    index: i,
                    path: loadedPath,
                    img: img
                });

                photosLoaded++;
                imageLoaded = true;
                console.log(`Loaded gallery image ${i}: ${loadedPath}`);
                break; // Found image, move to next number

            } catch (e) {
                continue; // Try next path
            }
        }

        // Stop trying if we hit too many consecutive missing photos
        if (!imageLoaded && i > 8 && photosLoaded > 0) {
            const missingCount = i - photosLoaded;
            if (missingCount >= 5) {
                console.log(`Stopped loading at photo ${i} due to consecutive missing images`);
                break;
            }
        }
    }

    // Professional journalism photo descriptions
    const photoDescriptions = {
        1: "Diplomatic Meeting Coverage",
        2: "Interview with Regional Official",
        3: "Press Conference Documentation",
        4: "Field Reporting Assignment",
        5: "Political Analysis Session",
        6: "Cultural Affairs Coverage",
        7: "International Relations Event",
        8: "Expert Interview Session",
        9: "Government Building Visit",
        10: "Historical Documentation",
        11: "Policy Discussion Coverage",
        12: "Regional Affairs Meeting",
        13: "Parliamentary Session Coverage",
        14: "International Summit Documentation",
        15: "Bilateral Talks Coverage",
        16: "Media Briefing Session",
        17: "Official State Visit",
        18: "Regional Conference Coverage",
        19: "Expert Panel Discussion",
        20: "Cultural Exchange Event"
    };

    // Create gallery items for loaded images
    if (loadedImages.length > 0) {
        loadedImages.forEach(imageData => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';

            const description = photoDescriptions[imageData.index] || `Professional Documentation ${imageData.index}`;
            galleryItem.title = description;

            const img = document.createElement('img');
            img.src = imageData.path;
            img.alt = description;
            img.onclick = () => openModal(imageData.path, description);

            // Simple loading states
            img.onload = () => galleryItem.classList.add('loaded');
            img.onerror = () => {
                galleryItem.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; text-align: center;">
                        <div>
                            <div style="font-size: 24px; margin-bottom: 8px;">📷</div>
                            <div style="font-size: 12px;">${description}</div>
                        </div>
                    </div>
                `;
            };

            galleryItem.appendChild(img);
            galleryContainer.appendChild(galleryItem);
        });

        console.log(`✓ Gallery loaded: ${photosLoaded} journalism photos`);

        // Update scroll indicator
        const indicator = document.querySelector('.scroll-indicator');
        if (indicator) {
            if (photosLoaded > 3) {
                indicator.textContent = `← Scroll to explore ${photosLoaded} photos →`;
            } else {
                indicator.textContent = `${photosLoaded} professional photos`;
            }
        }
    } else {
        // Show helpful placeholder message for professional portfolio
        const placeholderItem = document.createElement('div');
        placeholderItem.className = 'gallery-item';
        placeholderItem.innerHTML = `
            <div class="placeholder-text" style="text-align: center; padding: 30px;">
                <div style="font-size: 48px; margin-bottom: 15px; opacity: 0.6;">📸</div>
                <div style="font-size: 18px; font-weight: 500; margin-bottom: 10px;">Professional Photography Portfolio</div>
                <div style="font-size: 14px; color: #666; line-height: 1.4;">
                    Upload your journalism photos to the gallery folder<br>
                    <small style="font-size: 12px; margin-top: 8px; display: block; opacity: 0.8;">
                        Expected: gallery/1.jpg, gallery/2.jpg, etc.<br>
                        Formats: .jpg, .jpeg, .png, .webp
                    </small>
                </div>
            </div>
        `;
        galleryContainer.appendChild(placeholderItem);
        console.log('No gallery images found, showing placeholder');
    }
}

function openModal(imageSrc, description = "") {
    const modal = document.getElementById('galleryModal');
    if (modal) {
        const modalImage = document.getElementById('modalImage');
        modalImage.src = imageSrc;
        modalImage.alt = description;

        // Add description to modal if available
        let existingCaption = modal.querySelector('.modal-caption');
        if (description && description !== "Gallery Image") {
            if (!existingCaption) {
                existingCaption = document.createElement('div');
                existingCaption.className = 'modal-caption';
                existingCaption.style.cssText = `
                    position: absolute;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 12px 20px;
                    border-radius: 6px;
                    font-size: 16px;
                    text-align: center;
                    max-width: 80%;
                `;
                modal.querySelector('.modal-content').appendChild(existingCaption);
            }
            existingCaption.textContent = description;
            existingCaption.style.display = 'block';
        } else if (existingCaption) {
            existingCaption.style.display = 'none';
        }

        modal.classList.add('active');

        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('galleryModal');
    if (modal) {
        modal.classList.remove('active');

        // Re-enable body scrolling
        document.body.style.overflow = 'auto';
    }
}

// Enhanced modal controls and gallery styling
function setupModalControls() {
    const modal = document.getElementById('galleryModal');
    if (modal) {
        // Close modal when clicking outside the image
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });

        // Close modal with escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // Add gallery loading animations and improved proportions
    const style = document.createElement('style');
    style.textContent = `
        .gallery-item {
            opacity: 0.7;
            transition: opacity 0.3s ease, transform 0.3s ease;
            /* Better proportions for journalism photos */
            min-width: 320px;
            width: 320px;
            height: 240px;
            aspect-ratio: 4/3;
        }

        .gallery-item.loaded {
            opacity: 1;
        }

        .gallery-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
        }

        .gallery-item img {
            transition: transform 0.3s ease;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        }

        .gallery-item:hover img {
            transform: scale(1.02);
        }

        .gallery-scroll {
            scrollbar-width: thin;
            scrollbar-color: #000 #f8f9fa;
            padding: 15px 0;
            gap: 15px;
        }

        .modal-caption {
            animation: fadeInUp 0.3s ease;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            .gallery-item {
                min-width: 280px;
                width: 280px;
                height: 210px;
            }
        }

        @media (max-width: 480px) {
            .gallery-item {
                min-width: 250px;
                width: 250px;
                height: 190px;
            }
        }
    `;
    document.head.appendChild(style);
}

// Professional loading indicator for journalism portfolio
function showLoadingIndicator() {
    const galleryContainer = document.getElementById('photoGallery');
    galleryContainer.innerHTML = `
        <div class="gallery-item" style="justify-content: center; align-items: center; min-width: 320px;">
            <div style="text-align: center; color: #333;">
                <div style="font-size: 36px; margin-bottom: 15px; opacity: 0.7;">📰</div>
                <div style="font-size: 16px; font-weight: 500;">Loading Professional Portfolio...</div>
                <div style="font-size: 12px; margin-top: 8px; opacity: 0.6;">Searching for journalism photography</div>
            </div>
        </div>
    `;
}

// Main initialization function
async function initializePortfolio() {
    console.log('Initializing Giorgia Valente Portfolio...');

    try {
        // Setup modal controls first
        setupModalControls();

        // Show loading indicator
        showLoadingIndicator();

        // Load profile image and gallery in parallel
        await Promise.all([
            loadProfileImage(),
            loadGalleryImages()
        ]);

        console.log('Portfolio initialization complete!');

    } catch (error) {
        console.error('Error initializing portfolio:', error);
    }
}

// Load everything when the page loads
window.addEventListener('load', initializePortfolio);

// Also try when DOM content is loaded (faster)
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if not already done
    if (document.getElementById('photoGallery').innerHTML === '') {
        initializePortfolio();
    }
});

// Export functions for potential external use
window.portfolioGallery = {
    openModal,
    closeModal,
    loadGalleryImages,
    loadProfileImage
};