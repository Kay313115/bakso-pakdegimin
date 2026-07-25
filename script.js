// 1. NAVBAR BERUBAH WARNA PAS DI SCROLL
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.background = '#005f99'; // lebih pekat
    navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  } else {
    navbar.style.background = 'rgba(0, 95, 153, 0.9)'; // transparan
    navbar.style.boxShadow = 'none';
  }
});

// 2. ANIMASI MUNCUL PAS SCROLL KE SECTION
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 1s ease-out';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});