var RANKS = [];
["Ferro", "Bronze", "Prata", "Ouro", "Platina", "Diamante", "Ascendente", "Imortal"].forEach(function (n) {
  [1, 2, 3].forEach(function (t) {
    RANKS.push(n + " " + t);
  });
});
RANKS.push("Radiante");

var idUsuario = Number(sessionStorage.ID_USUARIO) || 1;
var rrAtual = sessionStorage.PONTOS_USUARIO !== undefined ? Number(sessionStorage.PONTOS_USUARIO) : 47;
var selectRank = document.getElementById("r2");

if (selectRank && sessionStorage.RANK_USUARIO) {
  selectRank.value = sessionStorage.RANK_USUARIO;
}

function aplicarRR(rank, rr, d) {
  var i = RANKS.indexOf(rank);
  rr = rr + d;

  if (rank !== "Radiante" && rr >= 100) {
    i = i + 1;
    rr = 0;
  } else if (rr < 0) {
    if (i > 0) {
      i = i - 1;
      rr = 75;
    } else {
      rr = 0;
    }
  }

  return { rank: RANKS[i], rr: rr };
}

function extrairRounds(textoRounds, resultado) {
  if (!textoRounds) {
    return resultado === "Vitória" ? { ganhos: 13, perdidos: 9 } : { ganhos: 9, perdidos: 13 };
  }
  var partes = textoRounds.toLowerCase().split("x");
  var g = parseInt(partes[0], 10);
  var p = partes[1] !== undefined ? parseInt(partes[1], 10) : 0;
  return {
    ganhos: isNaN(g) ? 0 : g,
    perdidos: isNaN(p) ? 0 : p
  };
}

function apUpd() {
  var n = document.getElementById("a1").value;
  var ag = obterAgente(n);

  document.getElementById("apv").innerHTML = agSVG(ag.n, MCOR[ag.r]);
  document.getElementById("apn").textContent = ag.n;
}

document.getElementById("a1").onchange = apUpd;
apUpd();

document.getElementById("bs").onclick = function () {
  var t = document.getElementById("ts");
  var mapa = document.getElementById("m1").value;
  var agente = document.getElementById("a1").value;
  var resultado = document.getElementById("r1").value;
  var textoRounds = document.getElementById("rd1").value.trim();
  var killsCampo = document.getElementById("k1").value;
  var mortesCampo = document.getElementById("d1").value;
  var assistenciasCampo = document.getElementById("as1").value;
  var dataCampo = document.getElementById("dt1").value;
  var rv = document.getElementById("rr1").value;

  if (killsCampo === "" || mortesCampo === "") {
    t.style.color = "#ff4655";
    t.textContent = "Informe kills e mortes.";
    return;
  }

  if (rv === "") {
    t.style.color = "#ff4655";
    t.textContent = "Informe os pontos ganhos ou perdidos.";
    return;
  }

  var d = Number(rv);
  var antes = document.getElementById("r2").value;
  var r = aplicarRR(antes, rrAtual, d);
  var rounds = extrairRounds(textoRounds, resultado);

  fetch("/partidas/registrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      idUsuarioServer: idUsuario,
      mapaServer: mapa,
      agenteServer: agente,
      resultadoServer: resultado,
      roundsGanhosServer: rounds.ganhos,
      roundsPerdidosServer: rounds.perdidos,
      killsServer: Number(killsCampo),
      mortesServer: Number(mortesCampo),
      assistenciasServer: Number(assistenciasCampo) || 0,
      variacaoRrServer: d,
      novoRankServer: r.rank,
      novosPontosRrServer: r.rr,
      dataPartidaServer: dataCampo || null
    })
  })
    .then(function (resposta) {
      if (!resposta.ok) {
        throw new Error("Erro ao salvar partida no banco.");
      }
      return resposta.json();
    })
    .then(function () {
      rrAtual = r.rr;
      document.getElementById("r2").value = r.rank;
      sessionStorage.RANK_USUARIO = r.rank;
      sessionStorage.PONTOS_USUARIO = rrAtual;

      var msg = "Partida salva no banco! " + (d > 0 ? "+" : "") + d + " RR.";
      if (RANKS.indexOf(r.rank) > RANKS.indexOf(antes)) {
        msg += " Você subiu para " + r.rank + "! Pontos zerados.";
      } else if (RANKS.indexOf(r.rank) < RANKS.indexOf(antes)) {
        msg += " Você caiu para " + r.rank + ".";
      }

      t.style.color = "#1fc99a";
      t.textContent = msg;
    })
    .catch(function (erro) {
      console.log(erro);
      t.style.color = "#ff4655";
      t.textContent = "Erro ao salvar partida no servidor.";
    });
};
