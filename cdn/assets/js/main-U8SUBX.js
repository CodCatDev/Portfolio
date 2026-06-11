const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.classList.remove('hidden');
        } else {
            entry.target.classList.remove('visible');
            entry.target.classList.add('hidden');
        }
    });
}, observerOptions);

document.querySelectorAll('[data-anim]').forEach(el => {
    observer.observe(el);
});

let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        document.querySelector('header').classList.add('scrolled');
    } else {
        document.querySelector('header').classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

function bioMusic() {
    window.open('https://github.com/CodCatDev/BioMusic', '_blank');
}

function crosshairJs() {
    window.open('https://github.com/CodCatDev/CrosshairJs', '_blank');
}

function portfolio() {
    window.open('https://github.com/CodCatDev/Portfolio', '_blank');
}

function cola149() {
    window.open('https://cola149.ru', '_blank');
}