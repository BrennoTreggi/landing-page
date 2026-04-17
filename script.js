const slides = document.querySelectorAll('.slide');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const close = document.querySelector('.close');

slides.forEach(slide => {
  slide.addEventListener('click', () => {
    modal.style.display = 'flex';
    modalImg.src = slide.src;
  });
});

close.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});