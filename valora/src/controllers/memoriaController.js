var memoriaModel = require("../models/memoriaModel");

function registrar(req, res) {
    var idUsuario = Number(req.body.idUsuarioServer);
    var jogadas = Number(req.body.jogadasServer);

    if (!idUsuario || !jogadas || jogadas <= 0) {
        return res.status(400).send("Dados inválidos para registrar jogo da memória!");
    }

    memoriaModel
        .registrar(idUsuario, jogadas)
        .then(function () {
            return memoriaModel.buscarEstatisticas(idUsuario);
        })
        .then(function (resultado) {
            var estatisticas = resultado[0] || { melhor_partida: jogadas, total_jogos: 1 };
            res.status(201).json(estatisticas);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage || "Erro ao registrar jogo da memória.");
        });
}

function buscarEstatisticas(req, res) {
    var idUsuario = Number(req.params.idUsuario);

    if (!idUsuario) {
        return res.status(400).send("ID do usuário inválido!");
    }

    memoriaModel
        .buscarEstatisticas(idUsuario)
        .then(function (resultado) {
            var estatisticas = resultado[0] || { melhor_partida: null, total_jogos: 0 };
            res.json(estatisticas);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage || "Erro ao buscar estatísticas da memória.");
        });
}

module.exports = {
    registrar,
    buscarEstatisticas
};
