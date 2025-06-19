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
                        console.log('Successfully loaded:', filename);
                    };
                    img.onerror = function() {
                        console.log('Failed to load:', filename);
                    };

                    document.getElementById('profileImage').innerHTML = '';
                    document.getElementById('profileImage').appendChild(img);
                    imageLoaded = true;
                    break; // Successfully loaded image
                }
            } catch (e) {
                console.log('Error trying to load:', filename, e);
                continue; // Try next filename
            }
        }

        if (!imageLoaded) {
            // Fallback to placeholder if no image is found
            document.getElementById('profileImage').innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #000; font-size: 18px;">Professional Photo</div>';
            console.log('No image found, showing placeholder');
        }
    } catch (error) {
        console.log('Could not load image:', error);
        // Fallback to placeholder if image can't be loaded
        document.getElementById('profileImage').innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #000; font-size: 18px;">Professional Photo</div>';
    }
}

async function loadGalleryImages() {
    // Gallery image filenames to try
    const galleryFiles = [
        { id: 'gallery1', files: ['gallery1.jpg', 'gallery1.jpeg', 'gallery1.png', 'field1.jpg', 'reporting1.jpg'] },
        { id: 'gallery2', files: ['gallery2.jpg', 'gallery2.jpeg', 'gallery2.png', 'interview1.jpg', 'meeting1.jpg'] },
        { id: 'gallery3', files: ['gallery3.jpg', 'gallery3.jpeg', 'gallery3.png', 'event1.jpg', 'press1.jpg'] },
        { id: 'gallery4', files: ['gallery4.jpg', 'gallery4.jpeg', 'gallery4.png', 'behind1.jpg', 'work1.jpg'] },
        { id: 'gallery5', files: ['gallery5.jpg', 'gallery5.jpeg', 'gallery5.png', 'location1.jpg', 'site1.jpg'] },
        { id: 'gallery6', files: ['gallery6.jpg', 'gallery6.jpeg', 'gallery6.png', 'press2.jpg', 'journalism1.jpg'] },
        { id: 'gallery7', files: ['gallery7.jpg', 'gallery7.jpeg', 'gallery7.png', 'equipment1.jpg', 'camera1.jpg'] },
        { id: 'gallery8', files: ['gallery8.jpg', 'gallery8.jpeg', 'gallery8.png', 'team1.jpg', 'group1.jpg'] }
    ];

    for (const item of galleryFiles) {
        for (const filename of item.files) {
            try {
                const response = await fetch(filename);
                if (response.ok) {
                    const galleryItem = document.getElementById(item.id);
                    const img = document.createElement('img');
                    img.src = filename;
                    img.alt = `Gallery Image ${item.id}`;
                    img.onclick = () => openModal(filename);

                    galleryItem.innerHTML = '';
                    galleryItem.appendChild(img);
                    break; // Found image, move to next gallery item
                }
            } catch (e) {
                continue; // Try next filename
            }
        }
    }
}

function openModal(imageSrc) {
    const modal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = imageSrc;
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('galleryModal');
    modal.classList.remove('active');
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