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


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `testfree`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `testcases`
--

CREATE TABLE `testcases` (
  `id` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `steps` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Extraindo dados da tabela `testcases`
--

INSERT INTO `testcases` (`id`, `description`, `steps`) VALUES
(1, 'Descrição do Teste 1', 'Passo 1: Ação A\nPasso 2: Ação B\nPasso 3: Ação C'),
(2, 'Descrição do Teste 2', 'Passo 1: Ação X\nPasso 2: Ação Y\nPasso 3: Ação Z');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `testcases`
--
ALTER TABLE `testcases`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `testcases`
--
ALTER TABLE `testcases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
