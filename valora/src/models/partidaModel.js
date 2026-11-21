var database = require("../database/config");

function registrar(
    fkUsuario,
    mapa,
    agente,
    resultado,
    roundsGanhos,
    roundsPerdidos,
    kills,
    mortes,
    assistencias,
    variacaoRr,
    rankAposPartida,
    dtPartida
) {
    var colunaData = dtPartida ? `'${dtPartida}'` : "CURRENT_TIMESTAMP";
    var instrucaoSql = `
        INSERT INTO partida (
            fk_usuario,
            mapa,
            agente,
            resultado,
            rounds_ganhos,
            rounds_perdidos,
            kills,
            mortes,
            assistencias,
            variacao_rr,
            rank_apos_partida,
            dt_partida
        ) VALUES (
            ${fkUsuario},
            '${mapa}',
            '${agente}',
            '${resultado}',
            ${roundsGanhos},
            ${roundsPerdidos},
            ${kills},
            ${mortes},
            ${assistencias},
            ${variacaoRr},
            '${rankAposPartida}',
            ${colunaData}
        );
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizarRankUsuario(idUsuario, rankAtual, pontosRr) {
    var instrucaoSql = `
        UPDATE usuario
        SET rank_atual = '${rankAtual}', pontos_rr = ${pontosRr}
        WHERE id = ${idUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarUsuario(idUsuario) {
    var instrucaoSql = `
        SELECT id, nome, nick, email, rank_atual, pontos_rr
        FROM usuario
        WHERE id = ${idUsuario};
    `;
    return database.executar(instrucaoSql);
}

function buscarResumoGeral(idUsuario) {
    var instrucaoSql = `
        SELECT
            COUNT(*) AS total_partidas,
            COALESCE(SUM(CASE WHEN resultado = 'Vitória' THEN 1 ELSE 0 END), 0) AS vitorias,
            COALESCE(SUM(kills), 0) AS total_kills,
            COALESCE(SUM(mortes), 0) AS total_mortes,
            COALESCE(SUM(assistencias), 0) AS total_assistencias
        FROM partida
        WHERE fk_usuario = ${idUsuario};
    `;
    return database.executar(instrucaoSql);
}

function buscarAgenteFavorito(idUsuario) {
    var instrucaoSql = `
        SELECT agente, COUNT(*) AS partidas
        FROM partida
        WHERE fk_usuario = ${idUsuario}
        GROUP BY agente
        ORDER BY partidas DESC, agente ASC
        LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}

function buscarDesempenhoMapas(idUsuario) {
    var instrucaoSql = `
        SELECT
            mapa,
            COUNT(*) AS total_partidas,
            SUM(CASE WHEN resultado = 'Vitória' THEN 1 ELSE 0 END) AS vitorias,
            ROUND((SUM(CASE WHEN resultado = 'Vitória' THEN 1 ELSE 0 END) / COUNT(*)) * 100) AS win_rate
        FROM partida
        WHERE fk_usuario = ${idUsuario}
        GROUP BY mapa
        ORDER BY win_rate DESC, total_partidas DESC, mapa ASC;
    `;
    return database.executar(instrucaoSql);
}

function listarHistorico(idUsuario) {
    var instrucaoSql = `
        SELECT
            id,
            mapa,
            agente,
            resultado,
            rounds_ganhos,
            rounds_perdidos,
            kills,
            mortes,
            assistencias,
            variacao_rr,
            rank_apos_partida,
            DATE_FORMAT(dt_partida, '%d/%m/%Y') AS data_formatada
        FROM partida
        WHERE fk_usuario = ${idUsuario}
        ORDER BY dt_partida DESC, id DESC
        LIMIT 10;
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    registrar,
    atualizarRankUsuario,
    buscarUsuario,
    buscarResumoGeral,
    buscarAgenteFavorito,
    buscarDesempenhoMapas,
    listarHistorico
};
