-- Atualiza a tabela "feedbacks" para o formulário novo (perguntas de múltipla escolha e "momento").
-- Rode UMA vez no phpMyAdmin (banco > aba "Importar" ou "SQL") se você já importou o schema.sql antigo.

ALTER TABLE feedbacks
  MODIFY conexao TEXT NULL COMMENT 'Como nos conhecemos, separado por "; "',
  ADD COLUMN momento TEXT NULL COMMENT 'Momento em que viveu a transformação' AFTER areas;
