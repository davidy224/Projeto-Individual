var formCadastro = document.getElementById("formCadastro");

formCadastro.addEventListener("submit", function (evento) {
  evento.preventDefault();

  var nomeVar = document.getElementById("nome").value;
  var nickVar = document.getElementById("nick").value;
  var emailVar = document.getElementById("email").value;
  var senhaVar = document.getElementById("senha").value;
  var rankVar = document.getElementById("rank").value;
  var pontosVar = Number(document.getElementById("pontos").value) || 0;
  var mensagem = document.getElementById("mensagem");

  fetch("/usuarios/cadastrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nomeServer: nomeVar,
      nickServer: nickVar,
      emailServer: emailVar,
      senhaServer: senhaVar,
      rankServer: rankVar,
      pontosServer: pontosVar
    })
  })
    .then(function (resposta) {
      if (resposta.ok) {
        window.location = "login.html";
      } else {
        mensagem.textContent = "Não foi possível realizar o cadastro.";
      }
    })
    .catch(function (erro) {
      console.log(erro);
      mensagem.textContent = "Erro ao conectar com o servidor.";
    });
});
