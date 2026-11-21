-- ============================================================================
-- PROJETO INDIVIDUAL: VALORA (VALORANT TRACKER & JOGO DA MEMÓRIA)
-- Script de criação do Banco de Dados e Tabelas (MySQL)
-- ============================================================================

SET NAMES utf8mb4;
CREATE DATABASE IF NOT EXISTS valora CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE valora;

-- ----------------------------------------------------------------------------
-- 1. Tabela USUARIO
-- Armazena os dados cadastrais do jogador, seu Rank atual e seus Pontos (RR).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(80) NOT NULL,
    nick VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    rank_atual VARCHAR(30) NOT NULL DEFAULT 'Ferro 1',
    pontos_rr INT NOT NULL DEFAULT 0,
    dt_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_pontos_rr CHECK (pontos_rr >= 0)
);

-- ----------------------------------------------------------------------------
-- 2. Tabela PARTIDA
-- Registra cada partida competitiva jogada pelo usuário (Relacionamento 1:N).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS partida (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT NOT NULL,
    mapa VARCHAR(40) NOT NULL,
    agente VARCHAR(40) NOT NULL,
    resultado VARCHAR(15) NOT NULL,
    rounds_ganhos INT NOT NULL,
    rounds_perdidos INT NOT NULL,
    kills INT NOT NULL,
    mortes INT NOT NULL,
    assistencias INT NOT NULL,
    variacao_rr INT NOT NULL,
    rank_apos_partida VARCHAR(30) NOT NULL,
    dt_partida DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_resultado CHECK (resultado IN ('Vitória', 'Derrota', 'Empate')),
    CONSTRAINT chk_estatisticas_positivas CHECK (
        rounds_ganhos >= 0 AND
        rounds_perdidos >= 0 AND
        kills >= 0 AND
        mortes >= 0 AND
        assistencias >= 0
    ),
    CONSTRAINT fk_partida_usuario FOREIGN KEY (fk_usuario)
        REFERENCES usuario(id)
        ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 3. Tabela JOGO_MEMORIA
-- Registra cada partida concluída no Jogo da Memória dos Agentes (1:N).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS jogo_memoria (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT NOT NULL,
    jogadas INT NOT NULL,
    tempo_segundos INT DEFAULT NULL,
    dt_jogo DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_jogadas CHECK (jogadas > 0),
    CONSTRAINT fk_memoria_usuario FOREIGN KEY (fk_usuario)
        REFERENCES usuario(id)
        ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- Dados iniciais para o usuário de teste
-- ----------------------------------------------------------------------------
INSERT IGNORE INTO usuario (id, nome, nick, email, senha, rank_atual, pontos_rr)
VALUES (1, 'Jett', 'Jett_BR#1234', 'jett@email.com', '123456', 'Platina 2', 47);

INSERT INTO partida (fk_usuario, mapa, agente, resultado, rounds_ganhos, rounds_perdidos, kills, mortes, assistencias, variacao_rr, rank_apos_partida, dt_partida)
VALUES
    (1, 'Ascent', 'Jett', 'Vitória', 13, 8, 18, 14, 4, 20, 'Platina 2', '2026-11-16 19:00:00'),
    (1, 'Split', 'Omen', 'Vitória', 13, 10, 22, 15, 7, 19, 'Platina 2', '2026-11-17 20:00:00'),
    (1, 'Haven', 'Jett', 'Vitória', 13, 7, 19, 10, 6, 22, 'Platina 2', '2026-11-18 21:00:00'),
    (1, 'Bind', 'Reyna', 'Derrota', 9, 13, 15, 18, 3, -16, 'Platina 2', '2026-11-19 21:30:00'),
    (1, 'Ascent', 'Jett', 'Vitória', 13, 9, 21, 12, 5, 21, 'Platina 2', '2026-11-20 22:00:00');

INSERT INTO jogo_memoria (fk_usuario, jogadas, tempo_segundos)
VALUES (1, 14, 45);
