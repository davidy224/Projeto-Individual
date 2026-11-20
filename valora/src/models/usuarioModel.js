var database = require("../database/config");

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL - function autenticar():", email);
    var instrucaoSql = `
        SELECT id, nome, nick, email, rank_atual, pontos_rr
        FROM usuario
        WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(nome, nick, email, senha, rankAtual, pontosRr) {
    console.log("ACESSEI O USUARIO MODEL - function cadastrar():", nome, nick, email, rankAtual, pontosRr);
    var instrucaoSql = `
        INSERT INTO usuario (nome, nick, email, senha, rank_atual, pontos_rr)
        VALUES ('${nome}', '${nick}', '${email}', '${senha}', '${rankAtual}', ${pontosRr});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar
};
