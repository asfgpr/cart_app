-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 05, 2021 at 07:14 AM
-- Server version: 8.0.21
-- PHP Version: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `user_authentication`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
CREATE TABLE IF NOT EXISTS `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `product_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=42 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
CREATE TABLE IF NOT EXISTS `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `discription` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  `rating` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `seller` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `price` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `discription`, `rating`, `seller`, `price`) VALUES
(1, 'Product One', 'This is a product with id 1', '4 start', 'shop name one', 300),
(2, 'Product Two', 'This is a product with id 2', '3 start', 'shop name Two', 600),
(3, 'Product Three', 'This is a product with id 3', '4 start', 'shop name Three', 700),
(4, 'Product Four', 'This is a product with id 4', '5 start', 'shop name Four', 670),
(5, 'Product Five', 'This is a product with id 5', '4 start', 'shop name Five', 620),
(6, 'Product Six', 'This is a product with id 6', '2 start', 'shop name Six', 230),
(7, 'Product Seven', 'This is a product with id 7', '5 start', 'shop name Seven', 640),
(8, 'Product Eight', 'This is a product with id 8', '3 start', 'shop name Eight', 660),
(9, 'Product Nine', 'This is a product with id 9', '3 start', 'shop name Nine', 760),
(10, 'Product Ten', 'This is a product with id 10', '3 start', 'shop name Ten', 610),
(11, 'Product Eleven', 'This is a product with id 11', '3 start', 'shop name Two', 600),
(14, 'Product Twelve', 'This is a product with id 12', '4 start', 'shop name Twelve', 690),
(15, 'Product Thirteen', 'This is a product with id 13', '3 start', 'shop name Thirteen', 200),
(16, 'Product Fourteen', 'This is a product with id 14', '3 start', 'shop name Fourteen', 840);

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
CREATE TABLE IF NOT EXISTS `session` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `session_key` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=36 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `phone` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
