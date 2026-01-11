// JavaScript for smooth scrolling
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('categorySlider');
    const scrollLeftBtn = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');
    const scrollAmount = 300; // Fixed scroll amount in pixels
    
    // Smooth scroll left
    scrollLeftBtn.addEventListener('click', function() {
        slider.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
    
    // Smooth scroll right
    scrollRightBtn.addEventListener('click', function() {
        slider.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
    
    // Optional: Hide buttons when at start/end
    slider.addEventListener('scroll', function() {
        // Show/hide left button based on scroll position
        if (slider.scrollLeft <= 0) {
            scrollLeftBtn.style.display = 'none';
        } else {
            scrollLeftBtn.style.display = 'flex';
        }
        
        // Show/hide right button based on scroll position
        if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth) {
            scrollRightBtn.style.display = 'none';
        } else {
            scrollRightBtn.style.display = 'flex';
        }
    });
    
    // Initialize button visibility
    scrollLeftBtn.style.display = 'none';

});