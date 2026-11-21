var formCadastro = document.getElementById("formCadastro");

formCadastro.addEventListener("submit", function (evento) {
  evento.preventDefault();

  var nomeVar = document.getElementById("nome").value.trim();
  var nickVar = document.getElementById("nick").value.trim();
  var emailVar = document.getElementById("email").value.trim();
  var senhaVar = document.getElementById("senha").value;
  var confirmarVar = document.getElementById("confirmar").value;
  var rankVar = document.getElementById("rank").value;
  var campoPontos = document.getElementById("pontos").value;
  var mensagem = document.getElementById("mensagem");

  if (!nomeVar || !nickVar || !emailVar || !senhaVar) {
    mensagem.textContent = "Preencha todos os campos.";
    return;
  }

  if (senhaVar !== confirmarVar) {
    mensagem.textContent = "As senhas não coincidem.";
    return;
  }

  if (campoPontos === "" || Number(campoPontos) < 0) {
    mensagem.textContent = "Informe seus pontos (RR).";
    return;
  }

  var pontosVar = Number(campoPontos);
  mensagem.textContent = "";

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
