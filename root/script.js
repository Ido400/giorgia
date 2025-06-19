async function loadProfileImage() {
    try {
        // Try different possible filenames for the uploaded image
        const possibleFilenames = [
            'image.jpeg', 'image.jpg', 'image.png', 'image.webp',
            'IMG.jpeg', 'IMG.jpg', 'IMG.png', 'IMG.webp',
            'photo.jpeg', 'photo.jpg', 'photo.png', 'photo.webp',
            'profile.jpeg', 'profile.jpg', 'profile.png', 'profile.webp',
            'giorgia.jpeg', 'giorgia.jpg', 'giorgia.png', 'giorgia.webp'
        ];

        let imageData = null;
        let imageType = 'image/jpeg';

        for (const filename of possibleFilenames) {
            try {
                // In a GitHub Pages environment, we'll use fetch instead of window.fs
                if (typeof window.fs !== 'undefined') {
                    imageData = await window.fs.readFile(filename);
                    if (filename.includes('.png')) imageType = 'image/png';
                    else if (filename.includes('.webp')) imageType = 'image/webp';
                    break;
                } else {
                    // For GitHub Pages, try to load image directly
                    const response = await fetch(filename);
                    if (response.ok) {
                        const img = document.createElement('img');
                        img.src = filename;
                        img.alt = 'Giorgia Valente';

                        document.getElementById('profileImage').appendChild(img);
                        return; // Successfully loaded image
                    }
                }
            } catch (e) {
                continue; // Try next filename
            }
        }

        if (imageData && typeof window.fs !== 'undefined') {
            const blob = new Blob([imageData], { type: imageType });
            const imageUrl = URL.createObjectURL(blob);

            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Giorgia Valente';

            document.getElementById('profileImage').appendChild(img);
        } else {
            // Fallback to placeholder if no image is found
            document.getElementById('profileImage').innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #000; font-size: 18px;">Professional Photo</div>';
        }
    } catch (error) {
        console.log('Could not load image:', error);
        // Fallback to placeholder if image can't be loaded
        document.getElementById('profileImage').innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #000; font-size: 18px;">Professional Photo</div>';
    }
}

// Load the image when the page loads
window.addEventListener('load', function() {
    loadProfileImage();
});