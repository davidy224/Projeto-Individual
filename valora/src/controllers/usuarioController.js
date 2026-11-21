var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (!email) {
        return res.status(400).send("Informe seu e-mail!");
    }
    if (!senha) {
        return res.status(400).send("Informe sua senha!");
    }

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
                res.status(403).send("E-mail e/ou senha inválidos!");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage || "Erro ao realizar login.");
        });
}

function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var nick = req.body.nickServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var rankAtual = req.body.rankServer || "Ferro 1";
    var pontosRr = req.body.pontosServer != undefined ? Number(req.body.pontosServer) : 0;

    if (!nome || !nick || !email || !senha) {
        return res.status(400).send("Preencha todos os campos obrigatórios!");
    }
    if (isNaN(pontosRr) || pontosRr < 0) {
        return res.status(400).send("Informe seus pontos (RR) corretamente!");
    }

    usuarioModel.cadastrar(nome, nick, email, senha, rankAtual, pontosRr)
        .then(function (resultado) {
            res.status(201).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage || "Erro ao realizar cadastro.");
        });
}

module.exports = {
    autenticar,
    cadastrar
};
