var database = require("../database/config");

function registrar(fkUsuario, jogadas) {
    var instrucaoSql = `
        INSERT INTO jogo_memoria (fk_usuario, jogadas)
        VALUES (${fkUsuario}, ${jogadas});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarEstatisticas(idUsuario) {
    var instrucaoSql = `
        SELECT
            MIN(jogadas) AS melhor_partida,
            COUNT(*) AS total_jogos
        FROM jogo_memoria
        WHERE fk_usuario = ${idUsuario};
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    registrar,
    buscarEstatisticas
};
