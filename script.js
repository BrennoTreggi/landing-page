function trocarPagina(pagina){
  document.querySelectorAll("section").forEach(sec=>{
    sec.classList.remove("active");
  });

  document.getElementById(pagina).classList.add("active");
}

function calcular(){
  let preco = document.getElementById("servico").value;
  let qtd = document.getElementById("qtd").value;

  let total = preco * qtd;

  document.getElementById("total").innerText = "Total: R$" + total;
}

// trocar slide
function mudarSlide(botao, direcao){
  const carrossel = botao.parentElement;
  const slides = carrossel.querySelectorAll(".slide");

  let index = 0;

  slides.forEach((img, i) => {
    if(img.classList.contains("ativo")){
      index = i;
      img.classList.remove("ativo");
    }
  });

  index += direcao;

  if(index < 0) index = slides.length - 1;
  if(index >= slides.length) index = 0;

  slides[index].classList.add("ativo");
}

// EXPANDIR IMAGEM
const modal = document.createElement("div");
modal.classList.add("modal");

const modalImg = document.createElement("img");

modal.appendChild(modalImg);
document.body.appendChild(modal);

// clique nas imagens
document.querySelectorAll(".slide").forEach(img => {
  img.addEventListener("click", () => {
    modal.style.display = "flex";
    modalImg.src = img.src;
  });
});

// fechar modal
modal.addEventListener("click", () => {
  modal.style.display = "none";
});