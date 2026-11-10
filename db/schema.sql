-- Em Busca de Mim — estrutura do banco (MySQL 5.7+ / MariaDB 10.3+)
-- Importe pelo phpMyAdmin: selecione o banco > aba "Importar" > escolha este arquivo.

SET NAMES utf8mb4;

-- Cadastros do formulário da página inicial
CREATE TABLE IF NOT EXISTS inscricoes (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome          VARCHAR(120) NOT NULL,
  email         VARCHAR(160) NOT NULL,
  whatsapp      VARCHAR(20)  NOT NULL,
  consentimento TINYINT(1)   NOT NULL DEFAULT 1,
  utm_source    VARCHAR(200) NULL,
  utm_medium    VARCHAR(200) NULL,
  utm_campaign  VARCHAR(200) NULL,
  utm_content   VARCHAR(200) NULL,
  utm_term      VARCHAR(200) NULL,
  criado_em     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_inscricoes_email (email),
  KEY idx_inscricoes_criado (criado_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Respostas da página /feedback
CREATE TABLE IF NOT EXISTS feedbacks (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  conexao    VARCHAR(60)  NULL,
  areas      TEXT         NULL COMMENT 'Áreas separadas por "; "',
  impacto    TINYINT UNSIGNED NULL COMMENT '1 a 5',
  indicacao  VARCHAR(40)  NULL,
  ajuda      TEXT         NULL,
  criado_em  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_feedbacks_criado (criado_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Quem pode entrar no painel /admin
-- A senha é definida com:  npm run admin:senha -- <email>
CREATE TABLE IF NOT EXISTS admins (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome         VARCHAR(80)  NOT NULL,
  email        VARCHAR(160) NOT NULL,
  senha_hash   VARCHAR(100) NULL,
  ultimo_login DATETIME     NULL,
  criado_em    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admins_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO admins (nome, email) VALUES
  ('Felipe Stamboni', 'felipe.stamboni@fitgestao.com'),
  ('Taynan Queiroz',  'taynan.queiroz@fitgestao.com');
