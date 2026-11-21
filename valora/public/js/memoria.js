var idUsuario = Number(sessionStorage.ID_USUARIO) || 1;
var mc = [];
var mo = [];
var mm = 0;
var mp = 0;
var mlock = false;
var mbest = 0;

function carregarMelhorPartidaBanco() {
  fetch("/memoria/estatisticas/" + idUsuario)
    .then(function (resposta) {
      if (resposta.ok) {
        return resposta.json();
      }
      throw new Error("Falha ao carregar recorde do banco.");
    })
    .then(function (dados) {
      if (dados && dados.melhor_partida) {
        mbest = Number(dados.melhor_partida);
        document.getElementById("mbs").textContent = mbest;
      }
    })
    .catch(function (erro) {
      console.log(erro);
    });
}

function salvarPartidaMemoriaBanco(jogadas) {
  fetch("/memoria/registrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      idUsuarioServer: idUsuario,
      jogadasServer: jogadas
    })
  })
    .then(function (resposta) {
      if (resposta.ok) {
        return resposta.json();
      }
      throw new Error("Falha ao registrar partida da memória.");
    })
    .then(function (dados) {
      if (dados && dados.melhor_partida) {
        mbest = Number(dados.melhor_partida);
        document.getElementById("mbs").textContent = mbest;
      }
    })
    .catch(function (erro) {
      console.log(erro);
    });
}

function mdraw() {
  var g = document.getElementById("mgrid");
  g.innerHTML = "";

  mc.forEach(function (c, i) {
    var b = document.createElement("button");

    if (c.o || c.d) {
      var col = MCOR[c.a.r];
      b.className = "carta-memoria frente";
      b.style.borderTop = "4px solid " + col;
      if (c.d) {
        b.style.boxShadow = "0 0 0 2px " + col;
      }

      var n = document.createElement("span");
      n.className = "nome-agente";
      n.textContent = c.a.n;

      var r = document.createElement("span");
      r.className = "funcao-agente";
      r.style.color = col;
      r.textContent = c.a.r;

      b.appendChild(n);
      b.appendChild(r);
      b.insertAdjacentHTML("afterbegin", agSVG(c.a.n, col));
      b.setAttribute("aria-label", c.a.n + ", " + c.a.r);
    } else {
      b.className = "carta-memoria verso";
      b.setAttribute("aria-label", "Carta virada");
      b.innerHTML = '<svg viewBox="0 0 64 64" width="44%" aria-hidden="true"><polygon points="8,12 24,12 32,38 40,12 56,12 38,54 26,54" fill="#FF4655"/></svg>';
    }

    b.onclick = function () {
      mflip(i);
    };
    g.appendChild(b);
  });

  document.getElementById("mmv").textContent = mm;
  document.getElementById("mpr").textContent = mp + "/8";
  document.getElementById("mbs").textContent = mbest || "-";
}

function mnew() {
  var d = [];
  MA.forEach(function (a) {
    d.push({ a: a, o: false, d: false });
    d.push({ a: a, o: false, d: false });
  });

  for (var i = d.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = d[i];
    d[i] = d[j];
    d[j] = t;
  }

  mc = d;
  mo = [];
  mm = 0;
  mp = 0;
  mlock = false;

  var m = document.getElementById("mmsg");
  m.style.color = "#9aa6b2";
  m.textContent = "Encontre os pares de agentes.";
  mdraw();
}

function mflip(i) {
  var c = mc[i];
  if (mlock || c.o || c.d) {
    return;
  }

  c.o = true;
  mo.push(i);

  if (mo.length === 2) {
    mm++;
    var a = mc[mo[0]];
    var b = mc[mo[1]];

    if (a.a.n === b.a.n) {
      a.d = true;
      b.d = true;
      a.o = false;
      b.o = false;
      mo = [];
      mp++;

      if (mp === 8) {
        var novo = !mbest || mm < mbest;
        if (novo) {
          mbest = mm;
        }
        salvarPartidaMemoriaBanco(mm);
        var m = document.getElementById("mmsg");
        m.style.color = "#1fc99a";
        m.textContent = "Vitória! Todos os pares em " + mm + " jogadas." + (novo ? " Nova melhor partida salva!" : " Partida salva!");
      }
    } else {
      mlock = true;
      mdraw();
      setTimeout(function () {
        a.o = false;
        b.o = false;
        mo = [];
        mlock = false;
        mdraw();
      }, 800);
      return;
    }
  }

  mdraw();
}

document.getElementById("mre").onclick = mnew;
carregarMelhorPartidaBanco();
mnew();
