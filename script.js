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
function trocarImagem(botao, direcao){
  const card = botao.parentElement;
  const imagens = card.querySelectorAll(".carrossel img");

  let index = 0;

  imagens.forEach((img, i) => {
    if(img.classList.contains("ativa")){
      index = i;
      img.classList.remove("ativa");
    }
  });

  index += direcao;

  if(index < 0) index = imagens.length - 1;
  if(index >= imagens.length) index = 0;

  imagens[index].classList.add("ativa");
}