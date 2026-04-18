
// CALCULAR TOTAL
function calcularTotal() {
    let total = 0;

    document.querySelectorAll('.servico-row').forEach(row => {
        const checkbox = row.querySelector('.servico-checkbox');
        const precoInput = row.querySelector('.preco');
        if (!checkbox.checked) {
            precoInput.value = '0.00';
            return;
        }

        const key = checkbox.dataset.key;
        const qtd = parseInt(row.querySelector('.quantidade').value) || 0;

        let precoUnitario = 0;

        switch (key) {
            case 'layout':
                precoUnitario = qtd === 1 ? 700 : 500;
                break;

            case 'animacao':
            case 'video':
                precoUnitario = qtd <= 30 ? 150 : 100;
                break;

            case 'restauracao':
                precoUnitario = qtd === 1 ? 120 : 100;
                break;

            case 'modelagem3d':
                precoUnitario = qtd === 1 ? 200 : 150;
                break;

            case 'reparo3d':
                precoUnitario = qtd === 1 ? 150 : 120;
                break;

            case 'render':
                precoUnitario = qtd === 1 ? 200 : 150;
                break;

            case 'diagramacao':
                if (qtd >= 5 && qtd <= 20) precoUnitario = 6.8;
                else if (qtd >= 21 && qtd <= 30) precoUnitario = 5.9;
                else if (qtd >= 31 && qtd <= 80) precoUnitario = 4.7;
                else if (qtd >= 81 && qtd <= 130) precoUnitario = 3.7;
                else if (qtd >= 131) precoUnitario = 2.3;
                break;

            case 'imagem':
                precoUnitario = 30;
                break;

            case 'cartao':
                precoUnitario = 80;
                break;

            case 'panfleto':
                precoUnitario = 80;
                break;

            case 'folder':
                precoUnitario = 100;
                break;

            case 'banner':
                precoUnitario = 130;
                break;
        }

        precoInput.value = precoUnitario.toFixed(2);
        total += qtd * precoUnitario;
    });

    document.getElementById('total').textContent = total.toFixed(2);
    return total;
}

// PAGAMENTO
async function pagarAgora() {
    const total = calcularTotal();

    if (total <= 0) {
        alert("Selecione pelo menos um serviço!");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/criar-pagamento", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ valor: total })
        });

        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }

        const data = await response.json();
        window.open(data.link, "_blank");
    } catch (error) {
        alert("Erro ao processar o pagamento. Verifique se o servidor está rodando.");
        console.error(error);
    }
}

// EXECUTA QUANDO CARREGA
document.addEventListener("DOMContentLoaded", () => {

    // EVENTO DE CÁLCULO PARA CHECKBOXES
    document.querySelectorAll('.servico-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', calcularTotal);
    });

    // EVENTO DE CÁLCULO PARA QUANTIDADES
    document.querySelectorAll('.quantidade').forEach(input => {
        input.addEventListener('input', calcularTotal);
    });

    // NAVEGAÇÃO SPA
    const links = document.querySelectorAll("nav a");
    const pages = document.querySelectorAll(".page");

    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            const targetId = link.getAttribute("href").replace("#", "");

            pages.forEach(page => page.classList.remove("active"));
            document.getElementById(targetId).classList.add("active");
        });
    });

});