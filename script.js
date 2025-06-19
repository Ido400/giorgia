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

    // Now create gallery items for all loaded images
    if (loadedImages.length > 0) {
        loadedImages.forEach(imageData => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.id = `gallery${imageData.index}`;

            // Clone the image to avoid issues
            const img = document.createElement('img');
            img.src = imageData.path;
            img.alt = `Gallery Image ${imageData.index}`;
            img.onclick = () => openModal(imageData.path);

            galleryItem.appendChild(img);
            galleryContainer.appendChild(galleryItem);
        });

        console.log(`Successfully loaded ${photosLoaded} gallery images`);

        // Update scroll indicator
        const indicator = document.querySelector('.scroll-indicator');
        if (indicator && photosLoaded > 3) {
            indicator.textContent = `← Scroll to explore ${photosLoaded} photos →`;
        } else if (indicator) {
            indicator.textContent = `${photosLoaded} photos`;
        }
    } else {
        // Show helpful placeholder message
        const placeholderItem = document.createElement('div');
        placeholderItem.className = 'gallery-item';
        placeholderItem.innerHTML = `
            <div class="placeholder-text">
                Upload photos to gallery folder<br>
                <small style="font-size: 0.8em; margin-top: 5px; display: block;">
                    Expected format: gallery/1.jpg, gallery/2.jpg, etc.<br>
                    Supported: .jpg, .jpeg, .png, .webp
                </small>
            </div>
        `;
        galleryContainer.appendChild(placeholderItem);
        console.log('No gallery images found, showing placeholder');
    }
}

function openModal(imageSrc) {
    const modal = document.getElementById('galleryModal');
    if (modal) {
        const modalImage = document.getElementById('modalImage');
        modalImage.src = imageSrc;
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

// Enhanced modal controls
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
}

// Improved error handling and loading indicators
function showLoadingIndicator() {
    const galleryContainer = document.getElementById('photoGallery');
    galleryContainer.innerHTML = `
        <div class="gallery-item" style="justify-content: center; align-items: center;">
            <div style="text-align: center; color: #666;">
                <div style="margin-bottom: 10px;">📸</div>
                <div>Loading gallery...</div>
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