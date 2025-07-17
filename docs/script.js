// Scroll indicator
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    document.querySelector('.scroll-indicator').style.width = scrollPercent + '%';
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Intersection Observer for animations (makes sections visible)
const observerOptions = {
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Adjust the viewport bottom by -50px
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add some interactive hover effects
document.querySelectorAll('.solution-card, .team-member, .problem-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Parallax effect for floating cart
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const cart = document.querySelector('.floating-cart');
    if (cart) {
        cart.style.transform = `translateY(calc(-50% + ${scrolled * 0.5}px)) rotate(${scrolled * 0.05}deg)`;
    }
});

// Particle effect generation (optional, as you have a .particles div)
// This code will dynamically create and animate particles.
const particlesContainer = document.querySelector('.particles');
if (particlesContainer) {
    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDuration = Math.random() * 10 + 10 + 's'; // 10-20 seconds
        particle.style.animationDelay = Math.random() * 20 + 's'; // Delay animation
        particlesContainer.appendChild(particle);

        // Remove particle after animation to prevent DOM bloat
        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }

    // Create a few particles initially
    for (let i = 0; i < 50; i++) {
        createParticle();
    }

    // Periodically create new particles
    setInterval(createParticle, 500); // Create a new particle every 0.5 seconds
}