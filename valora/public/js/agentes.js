var MA = [
  { n: "Jett", r: "Duelista" },
  { n: "Reyna", r: "Duelista" },
  { n: "Phoenix", r: "Duelista" },
  { n: "Sage", r: "Sentinela" },
  { n: "Killjoy", r: "Sentinela" },
  { n: "Omen", r: "Controlador" },
  { n: "Brimstone", r: "Controlador" },
  { n: "Sova", r: "Iniciador" }
];

var MCOR = {
  Duelista: "#FF4655",
  Sentinela: "#1FC99A",
  Controlador: "#A78BFA",
  Iniciador: "#F5B83D"
};

function agSVG(n, c) {
  var body = '<path d="M14 120 L22 94 Q60 80 98 94 L106 120 Z" fill="' + c + '" fill-opacity=".85"/>';
  var head = '<circle cx="60" cy="54" r="22" fill="#0F1923" stroke="' + c + '" stroke-width="3"/>';
  var ex = {
    Jett: '<path d="M36 46 Q62 22 88 44 Q68 40 36 46Z" fill="' + c + '"/><g stroke="' + c + '" stroke-width="3" stroke-linecap="round"><path d="M8 58 H26"/><path d="M12 70 H28"/><path d="M96 30 H114"/></g>',
    Reyna: '<path d="M40 40 Q60 6 80 40 Q60 30 40 40Z" fill="' + c + '"/><circle cx="52" cy="56" r="3.5" fill="' + c + '"/><circle cx="68" cy="56" r="3.5" fill="' + c + '"/>',
    Phoenix: '<path d="M60 8 Q74 24 66 34 Q78 30 78 44 Q60 36 42 44 Q42 30 54 34 Q46 24 60 8Z" fill="' + c + '"/>',
    Sage: '<circle cx="60" cy="30" r="8" fill="' + c + '"/><circle cx="96" cy="76" r="10" fill="none" stroke="' + c + '" stroke-width="3"/><circle cx="96" cy="76" r="3.5" fill="' + c + '"/>',
    Killjoy: '<rect x="42" y="50" width="16" height="9" fill="none" stroke="' + c + '" stroke-width="2.5"/><rect x="62" y="50" width="16" height="9" fill="none" stroke="' + c + '" stroke-width="2.5"/><circle cx="60" cy="28" r="7" fill="' + c + '"/>',
    Omen: '<path d="M34 66 Q34 14 60 12 Q86 14 86 66 Q60 54 34 66Z" fill="#0F1923" stroke="' + c + '" stroke-width="3"/><circle cx="52" cy="54" r="3" fill="' + c + '"/><circle cx="68" cy="54" r="3" fill="' + c + '"/>',
    Brimstone: '<path d="M32 38 H88 L82 24 Q60 14 38 24Z" fill="' + c + '"/><rect x="28" y="38" width="64" height="5" fill="' + c + '"/><path d="M44 70 Q60 86 76 70 Q60 76 44 70Z" fill="' + c + '"/>',
    Sova: '<rect x="38" y="42" width="44" height="6" fill="' + c + '"/><path d="M96 12 Q118 56 96 100" fill="none" stroke="' + c + '" stroke-width="4"/><line x1="96" y1="12" x2="96" y2="100" stroke="' + c + '" stroke-width="1.5"/>'
  }[n] || "";

  return '<svg viewBox="0 0 120 120" aria-hidden="true">' + body + head + ex + "</svg>";
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
