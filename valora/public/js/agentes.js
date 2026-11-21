var MA = [
  { n: "Jett", r: "Duelista", img: "assets/imgs/agentes/jett.png" },
  { n: "Reyna", r: "Duelista", img: "assets/imgs/agentes/reyna.png" },
  { n: "Phoenix", r: "Duelista", img: "assets/imgs/agentes/phoenix.png" },
  { n: "Sage", r: "Sentinela", img: "assets/imgs/agentes/sage.png" },
  { n: "Killjoy", r: "Sentinela", img: "assets/imgs/agentes/killjoy.png" },
  { n: "Omen", r: "Controlador", img: "assets/imgs/agentes/omen.png" },
  { n: "Brimstone", r: "Controlador", img: "assets/imgs/agentes/brimstone.png" },
  { n: "Sova", r: "Iniciador", img: "assets/imgs/agentes/sova.png" }
];

var MCOR = {
  Duelista: "#FF4655",
  Sentinela: "#1FC99A",
  Controlador: "#A78BFA",
  Iniciador: "#F5B83D"
};

function obterAgente(nome) {
  for (var i = 0; i < MA.length; i++) {
    if (MA[i].n === nome) {
      return MA[i];
    }
  }
  return MA[0];
}

function agSVG(n, c) {
  var ag = obterAgente(n);
  var corBorda = c || MCOR[ag.r] || "#FF4655";
  return '<img class="foto-agente" src="' + ag.img + '" alt="' + ag.n + '" style="border-color:' + corBorda + '">';
}

function carregarMenuUsuario() {
  var elNick = document.getElementById("nick");
  if (elNick && sessionStorage.NICK_USUARIO) {
    elNick.textContent = sessionStorage.NICK_USUARIO.split("#")[0];
  }

  var btnSair = document.getElementById("btnSair");
  if (btnSair) {
    btnSair.addEventListener("click", function () {
      sessionStorage.clear();
    });
  }
}

carregarMenuUsuario();
