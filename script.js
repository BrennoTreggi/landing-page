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