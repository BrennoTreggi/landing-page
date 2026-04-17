// Função para mudar os slides do carrossel
function mudarSlide(botao, direcao) {
  const carrossel = botao.parentElement;
  const slides = carrossel.querySelectorAll(".slide");
  
  let index = 0;

  slides.forEach((img, i) => {
    if (img.classList.contains("ativo")) {
      index = i;
      img.classList.remove("ativo");
    }
  });

  index += direcao;

  if (index < 0) index = slides.length - 1;
  if (index >= slides.length) index = 0;

  slides[index].classList.add("ativo");
}

// Função para abrir o modal ao clicar na imagem
const modal = document.createElement("div");
modal.classList.add("modal");

const modalImg = document.createElement("img");
modalImg.classList.add("modal-conteudo");

modal.appendChild(modalImg);
document.body.appendChild(modal);

// Fechar o modal ao clicar no X
const fechar = document.createElement("span");
fechar.classList.add("fechar");
fechar.innerHTML = "&times;";
modal.appendChild(fechar);

fechar.addEventListener("click", () => {
  modal.style.display = "none";
});

// Fecha o modal ao clicar fora da imagem
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Adiciona o clique nas imagens do carrossel para abrir o modal
document.querySelectorAll(".slide").forEach((img) => {
  img.addEventListener("click", () => {
    modal.style.display = "block";
    modalImg.src = img.src;
  });
});