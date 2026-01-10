document.addEventListener('DOMContentLoaded', function() {
  const mainImage = document.getElementById('mainImage');
  const thumbnails = document.querySelectorAll('.thumbnail');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const imageCounter = document.getElementById('image-counter');

  if (!mainImage || !thumbnails.length) return;

  let currentIndex = 0;
  const images = Array.from(thumbnails).map(thumb => ({
    src: thumb.querySelector('img').src,
    index: parseInt(thumb.dataset.index)
  }));

  function updateMainImage(index) {
    currentIndex = index;
    mainImage.src = images[index].src;
    mainImage.alt = `${listingTitle} - Image ${index + 1} of ${totalImages}`;

    // Update image counter for screen readers
    if (imageCounter) {
      imageCounter.textContent = `Image ${index + 1} of ${totalImages}`;
    }

    // Update active thumbnail
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
      thumb.setAttribute('aria-selected', i === index ? 'true' : 'false');
      thumb.setAttribute('tabindex', i === index ? '0' : '-1');
    });
  }

  // Thumbnail click handlers
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
      updateMainImage(index);
    });
  });

  // Navigation button handlers
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
      updateMainImage(newIndex);
    });

    nextBtn.addEventListener('click', () => {
      const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
      updateMainImage(newIndex);
    });
  }

  // Enhanced keyboard navigation with focus management
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && prevBtn) {
      e.preventDefault();
      prevBtn.click();
      prevBtn.focus();
    } else if (e.key === 'ArrowRight' && nextBtn) {
      e.preventDefault();
      nextBtn.click();
      nextBtn.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      updateMainImage(0);
      thumbnails[0].focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      updateMainImage(images.length - 1);
      thumbnails[thumbnails.length - 1].focus();
    }
  });

  // Thumbnail keyboard navigation
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        updateMainImage(index);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (index + 1) % thumbnails.length;
        thumbnails[nextIndex].focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = index === 0 ? thumbnails.length - 1 : index - 1;
        thumbnails[prevIndex].focus();
      }
    });
  });
});
