var idUsuario = Number(sessionStorage.ID_USUARIO) || 1;
var chartDesempenho = null;
var chartMapas = null;

function atualizarKpis(dados) {
  var usuario = dados.usuario;
  var resumo = dados.resumo;
  var agenteFav = dados.agenteFavorito;
  var mapas = dados.mapas || [];

  if (usuario) {
    sessionStorage.RANK_USUARIO = usuario.rank_atual;
    sessionStorage.PONTOS_USUARIO = usuario.pontos_rr;
    if (usuario.nick) {
      sessionStorage.NICK_USUARIO = usuario.nick;
      var elNick = document.getElementById("nick");
      if (elNick) {
        elNick.textContent = usuario.nick.split("#")[0];
      }
    }
    document.getElementById("drk").textContent = usuario.rank_atual;
    document.getElementById("dpt").textContent = usuario.pontos_rr + " RR";
  }

  var totalPartidas = Number(resumo.total_partidas) || 0;
  var vitorias = Number(resumo.vitorias) || 0;
  var kills = Number(resumo.total_kills) || 0;
  var mortes = Number(resumo.total_mortes) || 0;
  var assistencias = Number(resumo.total_assistencias) || 0;

  var kd = mortes > 0 ? (kills / mortes).toFixed(2).replace(".", ",") : kills.toFixed(2).replace(".", ",");
  var winRate = totalPartidas > 0 ? Math.round((vitorias / totalPartidas) * 100) : 0;

  document.getElementById("dkda").textContent = kd;
  document.getElementById("dkdaDetalhe").textContent = kills + " K / " + mortes + " D / " + assistencias + " A";
  document.getElementById("dwr").textContent = winRate + "%";
  document.getElementById("dwrDetalhe").textContent = vitorias + " vitórias em " + totalPartidas;

  var elFav = document.getElementById("dfav");
  if (agenteFav && agenteFav.agente) {
    var ag = obterAgente(agenteFav.agente);
    elFav.innerHTML = agSVG(ag.n, MCOR[ag.r]);
    document.getElementById("dfavNome").textContent = ag.n;
    document.getElementById("dfavQtd").textContent = agenteFav.partidas + (Number(agenteFav.partidas) === 1 ? " partida" : " partidas");
  } else {
    elFav.innerHTML = agSVG("Jett", MCOR.Duelista);
    document.getElementById("dfavNome").textContent = "-";
    document.getElementById("dfavQtd").textContent = "0 partidas";
  }

  if (mapas.length > 0) {
    var melhor = mapas[0];
    var pior = mapas[mapas.length - 1];

    document.getElementById("dmelhorMapa").textContent = melhor.mapa;
    document.getElementById("dmelhorMapaWr").textContent = melhor.win_rate + "% de vitórias";

    document.getElementById("dpiorMapa").textContent = pior.mapa;
    document.getElementById("dpiorMapaWr").textContent = pior.win_rate + "% de vitórias";
  }
}

function renderizarHistorico(historico) {
  var container = document.getElementById("listaHistorico");
  container.innerHTML = "";

  if (!historico || historico.length === 0) {
    container.innerHTML = '<div class="linha-historico"><span class="rotulo">Nenhuma partida registrada.</span><span></span><span></span><span></span></div>';
    return;
  }

  historico.forEach(function (p) {
    var linha = document.createElement("div");
    linha.className = "linha-historico";

    var classeTag = p.resultado === "Vitória" ? "tag vitoria" : "tag derrota";
    var placar = p.rounds_ganhos !== undefined ? " (" + p.rounds_ganhos + "x" + p.rounds_perdidos + ")" : "";

    linha.innerHTML =
      '<span class="' + classeTag + '">' + p.resultado + "</span>" +
      "<span>" + p.mapa + ", " + p.agente + placar + "</span>" +
      "<span>" + p.kills + "</span>" +
      "<span>" + p.mortes + "</span>";

    container.appendChild(linha);
  });
}

function renderizarGraficos(historico, mapas) {
  var partidasOrdenadas = (historico || []).slice().reverse();
  var labelsPartidas = partidasOrdenadas.map(function (p, idx) {
    return p.mapa + " (#" + (idx + 1) + ")";
  });
  var dadosKills = partidasOrdenadas.map(function (p) {
    return Number(p.kills);
  });
  var dadosMortes = partidasOrdenadas.map(function (p) {
    return Number(p.mortes);
  });

  var ctxDesempenho = document.getElementById("graficoDesempenho");
  if (ctxDesempenho) {
    if (chartDesempenho) {
      chartDesempenho.destroy();
    }
    chartDesempenho = new Chart(ctxDesempenho, {
      type: "line",
      data: {
        labels: labelsPartidas,
        datasets: [
          {
            label: "Kills",
            data: dadosKills,
            borderColor: "#1fc99a",
            backgroundColor: "rgba(31, 201, 154, 0.2)",
            tension: 0.3
          },
          {
            label: "Mortes",
            data: dadosMortes,
            borderColor: "#ff4655",
            backgroundColor: "rgba(255, 70, 85, 0.2)",
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: "#ffffff" }
          }
        },
        scales: {
          x: {
            ticks: { color: "#9aa6b2" },
            grid: { color: "#26323f" }
          },
          y: {
            beginAtZero: true,
            ticks: { color: "#9aa6b2" },
            grid: { color: "#26323f" }
          }
        }
      }
    });
  }

  var labelsMapas = (mapas || []).map(function (m) {
    return m.mapa;
  });
  var dadosWinRate = (mapas || []).map(function (m) {
    return Number(m.win_rate);
  });
  var coresMapas = dadosWinRate.map(function (wr) {
    if (wr >= 60) return "#1fc99a";
    if (wr >= 45) return "#f5b83d";
    return "#ff4655";
  });

  var ctxMapas = document.getElementById("graficoMapas");
  if (ctxMapas) {
    if (chartMapas) {
      chartMapas.destroy();
    }
    chartMapas = new Chart(ctxMapas, {
      type: "bar",
      data: {
        labels: labelsMapas,
        datasets: [
          {
            label: "Win rate (%)",
            data: dadosWinRate,
            backgroundColor: coresMapas
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: "#ffffff" }
          }
        },
        scales: {
          x: {
            ticks: { color: "#9aa6b2" },
            grid: { color: "#26323f" }
          },
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { color: "#9aa6b2" },
            grid: { color: "#26323f" }
          }
        }
      }
    });
  }
}

function carregarDashboard() {
  fetch("/partidas/dashboard/" + idUsuario)
    .then(function (resposta) {
      if (resposta.ok) {
        return resposta.json();
      }
      throw new Error("Falha ao buscar dados da dashboard.");
    })
    .then(function (dados) {
      atualizarKpis(dados);
      renderizarHistorico(dados.historico);
      renderizarGraficos(dados.historico, dados.mapas);
    })
    .catch(function (erro) {
      console.log(erro);
    });
}

carregarDashboard();
