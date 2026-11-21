var formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", function (evento) {
  evento.preventDefault();

  var emailVar = document.getElementById("email").value;
  var senhaVar = document.getElementById("senha").value;
  var mensagem = document.getElementById("mensagem");

  fetch("/usuarios/autenticar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      emailServer: emailVar,
      senhaServer: senhaVar
    })
  })
    .then(function (resposta) {
      if (resposta.ok) {
        resposta.json().then(function (json) {
          sessionStorage.ID_USUARIO = json.id;
          sessionStorage.NOME_USUARIO = json.nome;
          sessionStorage.NICK_USUARIO = json.nick;
          sessionStorage.EMAIL_USUARIO = json.email;
          sessionStorage.RANK_USUARIO = json.rank_atual;
          sessionStorage.PONTOS_USUARIO = json.pontos_rr;

          window.location = "dashboard.html";
        });
      } else {
        mensagem.textContent = "E-mail ou senha inválidos.";
      }
    })
    .catch(function (erro) {
      console.log(erro);
      mensagem.textContent = "Erro ao conectar com o servidor.";
    });
});
