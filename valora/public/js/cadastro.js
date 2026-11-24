var formCadastro = document.getElementById("formCadastro");

function temCaractereEspecial(senha) {
  return ["@", "#", "$", "%"].some(function (c) {
    return senha.includes(c);
  });
}

function mostrarErro(inputId, erroId, mensagem) {
  var el = document.getElementById(inputId);
  var erroEl = document.getElementById(erroId);
  if (el) el.classList.add("campo-erro");
  if (erroEl) erroEl.textContent = mensagem;
}

function limparErros(pares) {
  pares.forEach(function (par) {
    var el = document.getElementById(par[0]);
    var erroEl = document.getElementById(par[1]);
    if (el) el.classList.remove("campo-erro");
    if (erroEl) erroEl.textContent = "";
  });
}

formCadastro.addEventListener("submit", function (evento) {
  evento.preventDefault();

  var nomeVar = document.getElementById("nome").value.trim();
  var nickVar = document.getElementById("nick").value.trim();
  var emailVar = document.getElementById("email").value.trim();
  var senhaVar = document.getElementById("senha").value;
  var confirmarVar = document.getElementById("confirmar").value;
  var rankVar = document.getElementById("rank").value;
  var campoPontos = document.getElementById("pontos").value;
  var valido = true;

  limparErros([
    ["nome", "erroNome"],
    ["nick", "erroNick"],
    ["email", "erroEmail"],
    ["senha", "erroSenha"],
    ["confirmar", "erroConfirmar"],
    ["pontos", "erroPontos"],
  ]);

  if (!nomeVar) {
    mostrarErro("nome", "erroNome", "Preencha o nome.");
    valido = false;
  }

  if (!nickVar) {
    mostrarErro("nick", "erroNick", "Preencha o nick no jogo.");
    valido = false;
  }

  if (!emailVar) {
    mostrarErro("email", "erroEmail", "Preencha o e-mail.");
    valido = false;
  }

  if (!senhaVar) {
    mostrarErro("senha", "erroSenha", "Preencha a senha.");
    valido = false;
  } else if (!temCaractereEspecial(senhaVar)) {
    mostrarErro(
      "senha",
      "erroSenha",
      "A senha deve conter pelo menos um: @ # $ %",
    );
    valido = false;
  }

  if (!confirmarVar) {
    mostrarErro("confirmar", "erroConfirmar", "Confirme a senha.");
    valido = false;
  } else if (senhaVar !== confirmarVar) {
    mostrarErro("confirmar", "erroConfirmar", "As senhas não coincidem.");
    valido = false;
  }

  if (campoPontos === "" || Number(campoPontos) < 0) {
    mostrarErro("pontos", "erroPontos", "Informe seus pontos (RR), mínimo 0.");
    valido = false;
  }

  if (!valido) return;

  var pontosVar = Number(campoPontos);

  fetch("/usuarios/cadastrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nomeServer: nomeVar,
      nickServer: nickVar,
      emailServer: emailVar,
      senhaServer: senhaVar,
      rankServer: rankVar,
      pontosServer: pontosVar,
    }),
  })
    .then(function (resposta) {
      if (resposta.ok) {
        window.location = "login.html";
      } else {
        mostrarErro(
          "email",
          "erroEmail",
          "Não foi possível realizar o cadastro.",
        );
      }
    })
    .catch(function (erro) {
      console.log(erro);
      mostrarErro("email", "erroEmail", "Erro ao conectar com o servidor.");
    });
});
