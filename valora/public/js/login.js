var formLogin = document.getElementById("formLogin");

var vtemail = ["@"];
var vtsenha = ["@", "#", "$", "%"];

function mostrarErro(inputId, erroId, mensagem) {
  var input = document.getElementById(inputId);
  var erroEl = document.getElementById(erroId);
  if (input) input.classList.add("campo-erro");
  if (erroEl) erroEl.textContent = mensagem;
}

function limparErro(inputId, erroId) {
  var input = document.getElementById(inputId);
  var erroEl = document.getElementById(erroId);
  if (input) input.classList.remove("campo-erro");
  if (erroEl) erroEl.textContent = "";
}

formLogin.addEventListener("submit", function(evento) {
  evento.preventDefault();

  var emailVar = document.getElementById("email").value.trim();
  var senhaVar = document.getElementById("senha").value;
  var valido = true;

  limparErro("email", "erroEmail");
  limparErro("senha", "erroSenha");

  if (!emailVar) {
    mostrarErro("email", "erroEmail", "Preencha o e-mail.");
    valido = false;
  } else if (!vtemail.some(function(c) { return emailVar.includes(c); })) {
    mostrarErro("email", "erroEmail", "Coloque um email válido!");
    valido = false;
  }

  if (!senhaVar) {
    mostrarErro("senha", "erroSenha", "Preencha a senha.");
    valido = false;
  } else if (
      !senhaVar.includes("@") &&
      !senhaVar.includes("#") &&
      !senhaVar.includes("$") &&
      !senhaVar.includes("%")
    ) {
    mostrarErro("senha", "erroSenha", "Coloque um caractere especial!");
    valido = false;
  }

  if (!valido) return;

  fetch("/usuarios/autenticar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailServer: emailVar, senhaServer: senhaVar })
  })
    .then(function(resposta) {
      if (resposta.ok) {
        resposta.json().then(function(json) {
          sessionStorage.ID_USUARIO     = json.id;
          sessionStorage.NOME_USUARIO   = json.nome;
          sessionStorage.NICK_USUARIO   = json.nick;
          sessionStorage.EMAIL_USUARIO  = json.email;
          sessionStorage.RANK_USUARIO   = json.rank_atual;
          sessionStorage.PONTOS_USUARIO = json.pontos_rr;
          window.location = "dashboard.html";
        });
      } else {
        mostrarErro("email", "erroEmail", "E-mail ou senha inválidos.");
      }
    })
    .catch(function(erro) {
      console.log(erro);
      mostrarErro("email", "erroEmail", "Erro ao conectar com o servidor.");
    });
});
