var partidaModel = require("../models/partidaModel");

function registrar(req, res) {
    var idUsuario = Number(req.body.idUsuarioServer);
    var mapa = req.body.mapaServer;
    var agente = req.body.agenteServer;
    var resultado = req.body.resultadoServer;
    var roundsGanhos = Number(req.body.roundsGanhosServer) || 0;
    var roundsPerdidos = Number(req.body.roundsPerdidosServer) || 0;
    var kills = Number(req.body.killsServer);
    var mortes = Number(req.body.mortesServer);
    var assistencias = Number(req.body.assistenciasServer) || 0;
    var variacaoRr = Number(req.body.variacaoRrServer);
    var novoRank = req.body.novoRankServer;
    var novosPontosRr = Number(req.body.novosPontosRrServer);
    var dtPartida = req.body.dataPartidaServer || null;

    if (!idUsuario) {
        return res.status(400).send("Usuário inválido!");
    }
    if (!mapa || !agente || !resultado) {
        return res.status(400).send("Mapa, agente e resultado são obrigatórios!");
    }
    if (isNaN(kills) || isNaN(mortes) || isNaN(variacaoRr)) {
        return res.status(400).send("Informe kills, mortes e pontos (RR)!");
    }

    partidaModel
        .registrar(
            idUsuario,
            mapa,
            agente,
            resultado,
            roundsGanhos,
            roundsPerdidos,
            kills,
            mortes,
            assistencias,
            variacaoRr,
            novoRank,
            dtPartida
        )
        .then(function () {
            return partidaModel.atualizarRankUsuario(idUsuario, novoRank, novosPontosRr);
        })
        .then(function () {
            res.status(201).json({
                mensagem: "Partida registrada com sucesso!",
                rank_atual: novoRank,
                pontos_rr: novosPontosRr
            });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage || "Erro ao registrar partida.");
        });
}

function obterDashboard(req, res) {
    var idUsuario = Number(req.params.idUsuario);

    if (!idUsuario) {
        return res.status(400).send("ID do usuário inválido!");
    }

    Promise.all([
        partidaModel.buscarUsuario(idUsuario),
        partidaModel.buscarResumoGeral(idUsuario),
        partidaModel.buscarAgenteFavorito(idUsuario),
        partidaModel.buscarDesempenhoMapas(idUsuario),
        partidaModel.listarHistorico(idUsuario)
    ])
        .then(function (resultados) {
            var usuario = resultados[0][0] || null;
            var resumo = resultados[1][0] || {
                total_partidas: 0,
                vitorias: 0,
                total_kills: 0,
                total_mortes: 0,
                total_assistencias: 0
            };
            var agenteFavorito = resultados[2][0] || null;
            var mapas = resultados[3] || [];
            var historico = resultados[4] || [];

            res.json({
                usuario: usuario,
                resumo: resumo,
                agenteFavorito: agenteFavorito,
                mapas: mapas,
                historico: historico
            });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage || "Erro ao carregar dashboard.");
        });
}

module.exports = {
    registrar,
    obterDashboard
};
