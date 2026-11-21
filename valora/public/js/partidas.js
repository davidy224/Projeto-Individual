var RANKS = [];
["Ferro", "Bronze", "Prata", "Ouro", "Platina", "Diamante", "Ascendente", "Imortal"].forEach(function (n) {
  [1, 2, 3].forEach(function (t) {
    RANKS.push(n + " " + t);
  });
});
RANKS.push("Radiante");

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

function apUpd() {
  var n = document.getElementById("a1").value;
  var r = "Duelista";

  MA.forEach(function (a) {
    if (a.n === n) {
      r = a.r;
    }
  });

  document.getElementById("apv").innerHTML = agSVG(n, MCOR[r]);
  document.getElementById("apn").textContent = n;
}

document.getElementById("a1").onchange = apUpd;
apUpd();

document.getElementById("bs").onclick = function () {
  var t = document.getElementById("ts");

  if (!document.getElementById("k1").value || !document.getElementById("d1").value) {
    t.style.color = "#ff4655";
    t.textContent = "Informe kills e mortes.";
    return;
  }

  var rv = document.getElementById("rr1").value;
  if (rv === "") {
    t.style.color = "#ff4655";
    t.textContent = "Informe os pontos ganhos ou perdidos.";
    return;
  }

  var d = Number(rv);
  var antes = document.getElementById("r2").value;
  var r = aplicarRR(antes, rrAtual, d);

  rrAtual = r.rr;
  document.getElementById("r2").value = r.rank;
  sessionStorage.RANK_USUARIO = r.rank;
  sessionStorage.PONTOS_USUARIO = rrAtual;

  var msg = "Partida salva. " + (d > 0 ? "+" : "") + d + " RR.";
  if (RANKS.indexOf(r.rank) > RANKS.indexOf(antes)) {
    msg += " Você subiu para " + r.rank + "! Pontos zerados.";
  } else if (RANKS.indexOf(r.rank) < RANKS.indexOf(antes)) {
    msg += " Você caiu para " + r.rank + ".";
  }

  t.style.color = "#1fc99a";
  t.textContent = msg;
};
