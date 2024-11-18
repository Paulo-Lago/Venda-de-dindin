document.addEventListener('DOMContentLoaded', function() {
  // Instancia a classe GeladinhoManager após a página ser carregada
  const geladinhoManager = new GeladinhoManager(1.5);

  // Adicionando os event listeners para os botões
  document.getElementById("btnAdicionarGeladinhos").addEventListener("click", function() {
    const qtd = parseInt(document.getElementById("qtdGeladinhos").value);
    if (isNaN(qtd) || qtd <= 0) {
      alert("Digite uma quantidade válida!");
      return;
    }
    geladinhoManager.adicionarGeladinhos(qtd);
  });

  document.getElementById("btnRegistrarVenda").addEventListener("click", function() {
    const qtd = parseInt(document.getElementById("qtdVenda").value);
    if (isNaN(qtd) || qtd <= 0) {
      alert("Digite uma quantidade válida!");
      return;
    }
    geladinhoManager.venderGeladinhos(qtd);
  });

  document.getElementById("btnRegistrarFiado").addEventListener("click", function() {
    const qtd = parseInt(document.getElementById("qtdFiado").value);
    const cliente = document.getElementById("nomeCliente").value.trim();
    if (isNaN(qtd) || qtd <= 0 || cliente === "") {
      alert("Preencha todos os campos corretamente!");
      return;
    }
    geladinhoManager.venderFiado(qtd, cliente);
  });

  document.getElementById("btnAtualizarPreco").addEventListener("click", function() {
    const novoPreco = parseFloat(document.getElementById("precoUnidade").value);
    if (isNaN(novoPreco) || novoPreco <= 0) {
      alert("Digite um preço válido!");
      return;
    }
    geladinhoManager.precoPorUnidade = novoPreco;
    alert(`Preço atualizado para R$${novoPreco.toFixed(2)}`);
  });
});

class GeladinhoManager {
  constructor(precoPorUnidade) {
    this.estoque = 0;
    this.vendas = 0;
    this.vendasFiado = [];
    this.totalDinheiro = 0;
    this.precoPorUnidade = precoPorUnidade;
    this.carregarDados(); // Carrega os dados ao inicializar
    this.atualizarResumo();
  }

  adicionarGeladinhos(qtd) {
    this.estoque += qtd;
    this.atualizarResumo();
    this.salvarDados(); // Salva os dados após alterar
  }

  venderGeladinhos(qtd) {
    if (qtd > this.estoque) {
      alert("Estoque insuficiente!");
    } else {
      this.estoque -= qtd;
      this.vendas += qtd;
      this.totalDinheiro += qtd * this.precoPorUnidade;
      this.atualizarResumo();
      this.salvarDados(); // Salva os dados após alterar
    }
  }

  venderFiado(qtd, cliente) {
    if (qtd > this.estoque) {
      alert("Estoque insuficiente!");
    } else {
      this.estoque -= qtd;
      this.vendasFiado.push({ cliente, qtd });
      this.atualizarResumo();
      this.salvarDados(); // Salva os dados após alterar
    }
  }

  atualizarResumo() {
    document.getElementById("estoqueAtual").textContent = `Estoque atual: ${this.estoque}`;
    document.getElementById("totalVendasPagas").textContent = `Total vendidos (pagos): ${this.vendas}`;
    document.getElementById("totalDinheiro").textContent = `Total arrecadado: R$${this.totalDinheiro.toFixed(2)}`;

    const totaisFiado = this.calcularFiadoPorCliente();
    const listaFiado = document.getElementById("totaisFiado");
    listaFiado.innerHTML = "";

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

    document.getElementById("precoAtual").textContent = `Preço por unidade: R$${this.precoPorUnidade.toFixed(2)}`;
  }

  calcularFiadoPorCliente() {
    const totais = {};
    this.vendasFiado.forEach((venda) => {
      if (totais[venda.cliente]) {
        totais[venda.cliente] += venda.qtd;
      } else {
        totais[venda.cliente] = venda.qtd;
      }
    });
    
    return totais;
  }

  salvarDados() {
    const dados = {
      estoque: this.estoque,
      vendas: this.vendas,
      vendasFiado: this.vendasFiado,
      totalDinheiro: this.totalDinheiro,
      precoPorUnidade: this.precoPorUnidade
    };
    localStorage.setItem("dadosGeladinho", JSON.stringify(dados));
  }

  carregarDados() {
    const dados = JSON.parse(localStorage.getItem("dadosGeladinho"));
    if (dados) {
      this.estoque = dados.estoque;
      this.vendas = dados.vendas;
      this.vendasFiado = dados.vendasFiado;
      this.totalDinheiro = dados.totalDinheiro;
      this.precoPorUnidade = dados.precoPorUnidade;
    }
    this.atualizarResumo();
  }
}
