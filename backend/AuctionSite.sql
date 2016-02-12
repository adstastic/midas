-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 12, 2016 at 05:41 PM
-- Server version: 5.5.47-0ubuntu0.14.04.1
-- PHP Version: 5.5.9-1ubuntu4.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `AuctionSite`
--

-- --------------------------------------------------------

--
-- Table structure for table `Auctions`
--

CREATE TABLE IF NOT EXISTS `Auctions` (
  `Auction ID` int(11) NOT NULL,
  `Current Bid` int(11) NOT NULL,
  `Current Bidders` int(11) NOT NULL,
  `Item ID` int(11) NOT NULL,
  `Sellers_Seller ID` int(11) NOT NULL,
  `Bid_Bid ID` int(11) NOT NULL,
  `Active` tinyint(1) NOT NULL,
  PRIMARY KEY (`Auction ID`)
  FOREIGN KEY (`Item ID`)
  FOREIGN KEY (`Sellers_Seller ID`)

) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Bids`
--

CREATE TABLE IF NOT EXISTS `Bids` (
  `Bid ID` int(11) NOT NULL,
  `Bid amount` int(11) NOT NULL,
  `Bid time` int(11) NOT NULL,
  `Buyers_Buyer ID` int(11) NOT NULL,
  PRIMARY KEY (`Bid ID`)
  FOREIGN KEY (`Buyers_Buyer ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Items`
--

CREATE TABLE IF NOT EXISTS `Items` (
  `Name` varchar(35) NOT NULL DEFAULT '',
  `Description` text NOT NULL,
  `Category` varchar(35) DEFAULT NULL,
  `Item ID` int(11) NOT NULL,
  `Start Price` decimal(8,2) NOT NULL,
  `Reserve Price` decimal(8,2) NOT NULL,
  `End Date` date NOT NULL,
  `Current Price` decimal(8,2) NOT NULL,
  `Bids` int(11) NOT NULL,
  `Seller ID` int(11) NOT NULL,
  PRIMARY KEY (`Item ID`)
  FOREIGN KEY (`Seller ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
