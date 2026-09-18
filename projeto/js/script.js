const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 30);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.classList.toggle('is-active');
  siteNav.classList.toggle('is-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});

document.querySelectorAll('.site-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('is-active');
    siteNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const responsiveHero = document.querySelector('.hero-media[data-mobile][data-desktop]');

const setHeroImage = () => {
  const imagePath = window.matchMedia('(max-width: 800px)').matches
    ? responsiveHero.dataset.mobile
    : responsiveHero.dataset.desktop;
  const image = new Image();
  image.onload = () => {
    responsiveHero.style.backgroundImage = `url("${imagePath}")`;
    responsiveHero.classList.add('has-media');
  };
  image.src = imagePath;
};

if (responsiveHero) {
  setHeroImage();
  window.matchMedia('(max-width: 800px)').addEventListener('change', setHeroImage);
}

document.querySelectorAll('.placeholder-media:not(.hero-media)').forEach((element) => {
  const match = element.dataset.label?.match(/(assets\/images\/[^·]+)/);
  if (!match) return;
  const image = new Image();
  image.onload = () => {
    element.style.backgroundImage = `url("${match[1].trim()}")`;
    element.classList.add('has-media');
  };
  image.src = match[1].trim();
});

const modal = document.querySelector('.video-modal');
const video = modal.querySelector('video');
const videoFrame = modal.querySelector('.video-frame');
const openModal = () => {
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('is-locked');
  if (video.readyState > 0) videoFrame.classList.add('has-video');
};
const closeModal = () => {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  video.pause();
  document.body.classList.remove('is-locked');
};

document.querySelector('.play-button').addEventListener('click', openModal);
document.querySelector('.modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });
video.addEventListener('loadedmetadata', () => videoFrame.classList.add('has-video'));
