async function pagarPix() {

    document.getElementById("pix-area").classList.remove("hidden");
    document.getElementById("boleto-area").classList.add("hidden");

    const total = calcularTotal();

    if (!total || total <= 0) {
        alert("Selecione pelo menos um serviço!");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/pagar-pix", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ valor: total })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(data);
            alert("Erro ao gerar pagamento");
            return;
        }

        document.getElementById('qrcode').src =
            "data:image/png;base64," + data.qr_code_base64;

        document.getElementById('pixCode').value = data.qr_code;

    } catch (error) {
        alert("Erro ao conectar com servidor");
        console.error(error);
    }
}

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});