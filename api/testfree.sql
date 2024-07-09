-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 08-Jul-2024 às 04:35
-- Versão do servidor: 10.4.32-MariaDB
-- versão do PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Banco de dados: `testfree`
-- --------------------------------------------------------

-- Estrutura da tabela `testprojects`
CREATE TABLE `testprojects` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Estrutura da tabela `testcenarios`
CREATE TABLE `testcenarios` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `testproject_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `testproject_id` (`testproject_id`),
  CONSTRAINT `fk_testproject` FOREIGN KEY (`testproject_id`) REFERENCES `testprojects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Estrutura da tabela `testcases`
CREATE TABLE `testcases` (
  `id` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `steps` text DEFAULT NULL,
  `testcenario_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `testcenario_id` (`testcenario_id`),
  CONSTRAINT `fk_testcenario` FOREIGN KEY (`testcenario_id`) REFERENCES `testcenarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Incluindo valores iniciais na tabela `testprojects`
INSERT INTO `testprojects` (`id`, `name`, `description`) VALUES
(1, 'Projeto de Teste 1', 'Descrição do Projeto de Teste 1'),
(2, 'Projeto de Teste 2', 'Descrição do Projeto de Teste 2');

-- Incluindo valores iniciais na tabela `testcenarios`
INSERT INTO `testcenarios` (`id`, `name`, `description`, `testproject_id`) VALUES
(1, 'Cenário de Teste 1', 'Descrição do Cenário de Teste 1', 1),
(2, 'Cenário de Teste 2', 'Descrição do Cenário de Teste 2', 1);

-- Incluindo valores iniciais na tabela `testcases`
INSERT INTO `testcases` (`id`, `description`, `steps`, `testcenario_id`) VALUES
(1, 'Descrição do Teste 1', 'Passo 1: Ação A\nPasso 2: Ação B\nPasso 3: Ação C', 1),
(2, 'Descrição do Teste 2', 'Passo 1: Ação X\nPasso 2: Ação Y\nPasso 3: Ação Z', 1);
(3, 'Descrição do Teste 3', 'Passo 1: Ação A\nPasso 2: Ação B\nPasso 3: Ação C', 2),
(4, 'Descrição do Teste 4', 'Passo 1: Ação X\nPasso 2: Ação Y\nPasso 3: Ação Z', 2);

-- AUTO_INCREMENT de tabelas despejadas
ALTER TABLE `testcases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `testprojects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `testcenarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

COMMIT;