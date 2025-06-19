async function loadProfileImage() {
    try {
        // Try different possible filenames for the uploaded image
        const possibleFilenames = [
            'profile.JPG', // Your specific file
            'profile.jpg',
            'profile.jpeg',
            'profile.png',
            'profile.webp',
            'image.jpeg',
            'image.jpg',
            'image.png',
            'image.webp',
            'IMG.jpeg',
            'IMG.jpg',
            'IMG.png',
            'IMG.webp',
            'photo.jpeg',
            'photo.jpg',
            'photo.png',
            'photo.webp',
            'giorgia.jpeg',
            'giorgia.jpg',
            'giorgia.png',
            'giorgia.webp'
        ];

        let imageLoaded = false;

        for (const filename of possibleFilenames) {
            try {
                // For GitHub Pages, try to load image directly
                const response = await fetch(filename);
                if (response.ok) {
                    const img = document.createElement('img');
                    img.src = filename;
                    img.alt = 'Giorgia Valente';
                    img.onload = function() {
                        console.log('Successfully loaded profile image:', filename);
                    };
                    img.onerror = function() {
                        console.log('Failed to load profile image:', filename);
                    };

                    document.getElementById('profileImage').innerHTML = '';
                    document.getElementById('profileImage').appendChild(img);
                    imageLoaded = true;
                    break; // Successfully loaded image
                }
            } catch (e) {
                console.log('Error trying to load profile image:', filename, e);
                continue; // Try next filename
            }
        }

        if (!imageLoaded) {
            // Fallback to placeholder if no image is found
            document.getElementById('profileImage').innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #000; font-size: 18px;">Professional Photo</div>';
            console.log('No profile image found, showing placeholder');
        }
    } catch (error) {
        console.log('Could not load profile image:', error);
        // Fallback to placeholder if image can't be loaded
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

    // Try to load up to 40 photos from various naming patterns
    for (let i = 1; i <= maxPhotos; i++) {
        const possiblePaths = [
            // Photos in gallery folder
            `gallery/${i}.jpg`,
            `gallery/${i}.jpeg`,
            `gallery/${i}.png`,
            `gallery/${i}.webp`,
            `gallery/photo${i}.jpg`,
            `gallery/photo${i}.jpeg`,
            `gallery/photo${i}.png`,
            `gallery/img${i}.jpg`,
            `gallery/image${i}.jpg`,
            `gallery/gallery${i}.jpg`,
            // Photos in root directory (fallback)
            `gallery${i}.jpg`,
            `gallery${i}.jpeg`,
            `gallery${i}.png`,
            `photo${i}.jpg`,
            `image${i}.jpg`,
            `img${i}.jpg`
        ];

        let imageLoaded = false;

        for (const imagePath of possiblePaths) {
            try {
                const response = await fetch(imagePath);
                if (response.ok) {
                    // Create gallery item
                    const galleryItem = document.createElement('div');
                    galleryItem.className = 'gallery-item';
                    galleryItem.id = `gallery${i}`;

                    // Create image element
                    const img = document.createElement('img');
                    img.src = imagePath;
                    img.alt = `Gallery Image ${i}`;
                    img.onclick = () => openModal(imagePath);

                    galleryItem.appendChild(img);
                    galleryContainer.appendChild(galleryItem);

                    photosLoaded++;
                    imageLoaded = true;
                    console.log(`Loaded gallery image ${i}: ${imagePath}`);
                    break; // Found image, move to next number
                }
            } catch (e) {
                continue; // Try next path
            }
        }

        if (!imageLoaded) {
            // Stop trying if we hit 3 consecutive missing photos (after photo 8)
            if (i > 8 && photosLoaded > 0) {
                const missingCount = i - photosLoaded;
                if (missingCount >= 3) {
                    console.log(`Stopped loading at photo ${i} due to consecutive missing images`);
                    break;
                }
            }
        }
    }

    // If no photos were loaded, show placeholder message
    if (photosLoaded === 0) {
        const placeholderItem = document.createElement('div');
        placeholderItem.className = 'gallery-item';
        placeholderItem.innerHTML = '<div class="placeholder-text">Upload photos to gallery folder<br><small>gallery/1.jpg, gallery/2.jpg, etc.</small></div>';
        galleryContainer.appendChild(placeholderItem);
        console.log('No gallery images found, showing placeholder');
    } else {
        console.log(`Successfully loaded ${photosLoaded} gallery images`);
        // Update scroll indicator
        const indicator = document.querySelector('.scroll-indicator');
        if (indicator && photosLoaded > 3) {
            indicator.textContent = `← Scroll to explore ${photosLoaded} photos →`;
        }
    }
}

function openModal(imageSrc) {
    const modal = document.getElementById('galleryModal');
    if (modal) {
        const modalImage = document.getElementById('modalImage');
        modalImage.src = imageSrc;
        modal.classList.add('active');
    }
}

function closeModal() {
    const modal = document.getElementById('galleryModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal when clicking outside the image
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('galleryModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
});

// Load images when the page loads
window.addEventListener('load', function() {
    loadProfileImage();
    loadGalleryImages();
});