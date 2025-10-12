const slides = document.querySelectorAll('.producto-slide');
let current = 0;

function nextSlide() {
    // quitar la clase active del slide actual
    slides[current].classList.remove('active');

    // pasar al siguiente slide
    current = (current + 1) % slides.length;

    // añadir la clase active al nuevo slide
    slides[current].classList.add('active');

    // mover el contenedor para centrar el slide activo
    const sliderContainer = document.querySelector('.slider-container');
    const slideWidth = slides[current].offsetWidth;
    const gap = 16; // si tu gap es 2rem, ajusta en px según tu fuente
    sliderContainer.style.transform = `translateX(-${current * (slideWidth + gap)}px)`;
}

// cambiar de slide cada 3 segundos
setInterval(nextSlide, 3000);