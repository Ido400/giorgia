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

// Load the image when the page loads
window.addEventListener('load', function() {
    loadProfileImage();
});