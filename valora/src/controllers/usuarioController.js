var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    usuarioModel.autenticar(email, senha)
        .then(function (resultadoAutenticar) {
            if (resultadoAutenticar.length == 1) {
                res.json({
                    id: resultadoAutenticar[0].id,
                    nome: resultadoAutenticar[0].nome,
                    nick: resultadoAutenticar[0].nick,
                    email: resultadoAutenticar[0].email,
                    rank_atual: resultadoAutenticar[0].rank_atual,
                    pontos_rr: resultadoAutenticar[0].pontos_rr
                });
            } else {
                res.status(403).send("Email e/ou senha inválido(s)");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var nick = req.body.nickServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var rankAtual = req.body.rankServer || "Ferro 1";
    var pontosRr = req.body.pontosServer != undefined ? req.body.pontosServer : 0;

    usuarioModel.cadastrar(nome, nick, email, senha, rankAtual, pontosRr)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    autenticar,
    cadastrar
};
