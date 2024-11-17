class GeladinhoManager {
    constructor(precoPorUnidade) {
      this.estoque = 0;
      this.vendas = 0;
      this.vendasFiado = [];
      this.totalDinheiro = 0;
      this.precoPorUnidade = precoPorUnidade;
    }
  
    adicionarGeladinhos(qtd) {
      this.estoque += qtd;
      this.atualizarResumo();
    }
  
    venderGeladinhos(qtd) {
      if (qtd > this.estoque) {
        alert("Estoque insuficiente!");
      } else {
        this.estoque -= qtd;
        this.vendas += qtd;
        this.totalDinheiro += qtd * this.precoPorUnidade;
        this.atualizarResumo();
      }
    }
  
    venderFiado(qtd, cliente) {
      if (qtd > this.estoque) {
        alert("Estoque insuficiente!");
      } else {
        this.estoque -= qtd;
        this.vendasFiado.push({ cliente, qtd });
        this.atualizarResumo();
      }
    }
  
    atualizarResumo() {
        document.getElementById("estoqueAtual").textContent = `Estoque atual: ${this.estoque}`;
        document.getElementById("totalVendasPagas").textContent = `Total vendidos (pagos): ${this.vendas}`;
        document.getElementById("totalDinheiro").textContent = `Total arrecadado: R$${this.totalDinheiro.toFixed(2)}`;
        
        // Atualizar os totais de fiado
        const totaisFiado = calcularFiadoPorCliente();
        const listaFiado = document.getElementById("totaisFiado");
        listaFiado.innerHTML = ""; // Limpar lista anterior
      
        const clientes = Object.keys(totaisFiado);
        if (clientes.length === 0) {
          listaFiado.innerHTML = "<li>Nenhum fiado registrado ainda.</li>";
        } else {
          clientes.forEach((cliente) => {
            const item = document.createElement("li");
            item.textContent = `${cliente}: ${totaisFiado[cliente]} geladinho(s)`;
            listaFiado.appendChild(item);
        });
      }
    }
  }
  
  const geladinhoManager = new GeladinhoManager(1.5);
  
  function adicionarGeladinhos() {
    const qtd = parseInt(document.getElementById("qtdGeladinhos").value);
    if (isNaN(qtd) || qtd <= 0) {
      alert("Digite uma quantidade válida!");
      return;
    }
    geladinhoManager.adicionarGeladinhos(qtd);
  }
  
  function venderGeladinhos() {
    const qtd = parseInt(document.getElementById("qtdVenda").value);
    if (isNaN(qtd) || qtd <= 0) {
      alert("Digite uma quantidade válida!");
      return;
    }
    geladinhoManager.venderGeladinhos(qtd);
  }
  
  function venderFiado() {
    const qtd = parseInt(document.getElementById("qtdFiado").value);
    const cliente = document.getElementById("nomeCliente").value.trim();
    if (isNaN(qtd) || qtd <= 0 || cliente === "") {
      alert("Preencha todos os campos corretamente!");
      return;
    }
    geladinhoManager.venderFiado(qtd, cliente);
  }
  
  function atualizarPreco() {
    const novoPreco = parseFloat(document.getElementById("precoUnidade").value);
    if (isNaN(novoPreco) || novoPreco <= 0) {
      alert("Digite um preço válido!");
      return;
    }
    geladinhoManager.precoPorUnidade = novoPreco;
    alert(`Preço atualizado para R$${novoPreco.toFixed(2)}`);
  }
  
  function calcularFiadoPorCliente() {
    const totais = {};
  
    // Agrupar vendas por cliente
    geladinhoManager.vendasFiado.forEach((venda) => {
      if (totais[venda.cliente]) {
        totais[venda.cliente] += venda.qtd;
      } else {
        totais[venda.cliente] = venda.qtd;
      }
    });
  
    return totais;
  }
  
  function salvarDados() {
    const dados = {
      estoque: geladinhoManager.estoque,
      vendas: geladinhoManager.vendas,
      vendasFiado: geladinhoManager.vendasFiado,
      totalDinheiro: geladinhoManager.totalDinheiro,
      precoPorUnidade: geladinhoManager.precoPorUnidade,
    };
    localStorage.setItem("dadosGeladinho", JSON.stringify(dados));
  }

  function carregarDados() {
    const dadosSalvos = localStorage.getItem("dadosGeladinho");
    if (dadosSalvos) {
      const dados = JSON.parse(dadosSalvos);
      geladinhoManager.estoque = dados.estoque;
      geladinhoManager.vendas = dados.vendas;
      geladinhoManager.vendasFiado = dados.vendasFiado;
      geladinhoManager.totalDinheiro = dados.totalDinheiro;
      geladinhoManager.precoPorUnidade = dados.precoPorUnidade;
    }
  }
  