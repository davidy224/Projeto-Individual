var elRank = document.getElementById("drk");
var elPontos = document.getElementById("dpt");
var elFav = document.getElementById("dfav");

if (elRank && sessionStorage.RANK_USUARIO) {
  elRank.textContent = sessionStorage.RANK_USUARIO;
}

if (elPontos && sessionStorage.PONTOS_USUARIO !== undefined) {
  elPontos.textContent = sessionStorage.PONTOS_USUARIO + " RR";
}

if (elFav) {
  elFav.innerHTML = agSVG("Jett", MCOR.Duelista);
}

var ctxDesempenho = document.getElementById("graficoDesempenho");
if (ctxDesempenho) {
  new Chart(ctxDesempenho, {
    type: "line",
    data: {
      labels: ["Partida 1", "Partida 2", "Partida 3", "Partida 4", "Partida 5"],
      datasets: [
        {
          label: "Kills",
          data: [18, 22, 19, 15, 21],
          borderColor: "#1fc99a",
          backgroundColor: "rgba(31, 201, 154, 0.2)",
          tension: 0.3
        },
        {
          label: "Mortes",
          data: [14, 15, 10, 18, 12],
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

var ctxMapas = document.getElementById("graficoMapas");
if (ctxMapas) {
  new Chart(ctxMapas, {
    type: "bar",
    data: {
      labels: ["Ascent", "Haven", "Split", "Lotus", "Bind"],
      datasets: [
        {
          label: "Win rate (%)",
          data: [80, 65, 55, 50, 25],
          backgroundColor: ["#1fc99a", "#1fc99a", "#f5b83d", "#f5b83d", "#ff4655"]
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
