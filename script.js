const precos = {
    layout: 500,
    animacao: 200,
    video: 300,
    restauracao: 50,
    modelagem3d: 150,
    render: 100,
    diagramacao: 5,
    imagem: 80,
    cartao: 0.5,
    panfleto: 0.3,
    folder: 1,
    banner: 50
};

function calcularTotal() {
    let total = 0;

    document.querySelectorAll('.servico-row').forEach(row => {
        const checkbox = row.querySelector('.servico-checkbox');
        if (!checkbox.checked) return;

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

            case 'render':
                precoUnitario = qtd === 1 ? 200 : 150;
                break;

            case 'diagramacao':
                if (qtd >= 15 && qtd <= 20) precoUnitario = 6.5;
                else if (qtd <= 30) precoUnitario = 5.3;
                else if (qtd <= 80) precoUnitario = 4.7;
                else if (qtd <= 120) precoUnitario = 3.7;
                break;

            case 'imagem':
                precoUnitario = 30;
                break;

            case 'cartao':
                precoUnitario = 80;
                break;

            case 'panfleto':
                precoUnitario = 100;
                break;

            case 'folder':
                precoUnitario = 120;
                break;

            case 'banner':
                precoUnitario = 150;
                break;
        }

        total += qtd * precoUnitario;
    });

    document.getElementById('total').textContent = total.toFixed(2);
}

async function pagarAgora() {
    const total = calcularTotal();

    if (total <= 0) {
        alert('Selecione pelo menos um serviço e defina a quantidade.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/criar-pagamento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ valor: total })
        });

        const data = await response.json();
        if (data.link) {
            window.open(data.link, '_blank');
        } else {
            alert('Erro ao gerar pagamento. Tente novamente.');
        }
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro ao conectar com o servidor. Certifique-se de que o servidor está rodando.');
    }
}

function updateRowState(row) {
    const checkbox = row.querySelector('.servico-checkbox');
    const observacao = row.querySelector('.observacao');
    if (checkbox.checked) {
        observacao.style.display = 'block';
    } else {
        observacao.style.display = 'none';
    }
}

function setupPageNavigation() {
    const links = document.querySelectorAll('header nav a');
    const pages = document.querySelectorAll('.page');

    links.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const target = link.getAttribute('href').replace('#', '');
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(target).classList.add('active');
            links.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

function setupBudgetForm() {
    document.querySelectorAll('.servico-row').forEach(row => {
        const checkbox = row.querySelector('.servico-checkbox');
        const quantidade = row.querySelector('.quantidade');
        const preco = row.querySelector('.preco');

        updateRowState(row);

        checkbox.addEventListener('change', () => {
            updateRowState(row);
            calcularTotal();
        });

        quantidade.addEventListener('input', calcularTotal);
        preco.addEventListener('input', calcularTotal);
    });
}

function init() {
    setupPageNavigation();
    setupBudgetForm();
    calcularTotal();
}

document.addEventListener('DOMContentLoaded', init);
