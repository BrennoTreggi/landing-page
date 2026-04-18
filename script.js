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
        const quantidade = parseFloat(row.querySelector('.quantidade').value) || 0;
        const preco = parseFloat(row.querySelector('.preco').value) || 0;

        if (checkbox.checked && quantidade > 0) {
            total += preco * quantidade;
        }
    });

    document.getElementById('total').innerText = total.toFixed(2);
    return total;
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
