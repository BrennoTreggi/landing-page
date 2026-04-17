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
const modal = document.getElementById("modal");
const modalImg = document.getElementById("imgModal");
const fechar = document.querySelector(".fechar");

// pega TODAS as imagens do carrossel
document.querySelectorAll(".slide").forEach(img => {
  img.addEventListener("click", function(){
    modal.style.display = "block";
    modalImg.src = this.src;
  });
});

// fechar clicando no X
fechar.onclick = function(){
  modal.style.display = "none";
}

// fechar clicando fora da imagem
modal.onclick = function(e){
  if(e.target === modal){
    modal.style.display = "none";
  }
}