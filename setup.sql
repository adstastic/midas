-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2016-02-05 17:42:31.906


CREATE DATABASE IF NOT EXISTS Midas
    DEFAULT CHARACTER SET utf8
    DEFAULT COLLATE utf8_general_ci;

GRANT SELECT,UPDATE,INSERT,DELETE
    ON Midas.*
        TO 'admin'@'localhost'
        IDENTIFIED BY ' pass ';

FLUSH PRIVILEGES;

USE Midas;

-- tables
-- Table Auction
CREATE TABLE IF NOT EXISTS Auction (
    auction_id UNSIGNED AUTO_INCREMENT,
    active bool NOT NULL,
    item_id int NOT NULL,
    seller_id int NOT NULL,
    current_bidders int NOT NULL,
    highest_bid_id int NOT NULL,
    end TIME,
    PRIMARY KEY (auction_id),
    FOREIGN KEY (item_id) REFERENCES Items(item_id),
    FOREIGN KEY (highest_bid_id) REFERENCES Bid(bid_id),
    FOREIGN KEY (seller_id) REFERENCES Seller(seller_id)
);

-- Table Bid
CREATE TABLE IF NOT EXISTS Bid (
    bid_id int UNSIGNED AUTO_INCREMENT,
    auction_id int NOT NULL,
    amount int  NOT NULL,
    time TIMESTAMP,
    buyer_id int  NOT NULL,
    PRIMARY KEY (bid_id),
    FOREIGN KEY (auction_id) REFERENCES Auction(auction_id),
    FOREIGN KEY (buyer_id) REFERENCES Buyer(buyer_id)
);

-- Table Buyers
CREATE TABLE IF NOT EXISTS Buyers (
    [First Name] varchar(35)  NOT NULL,
    [Last Name] varchar(35)  NOT NULL,
    [Buyer ID] int  NOT NULL,
    [Rating] int  NOT NULL,
    [Items Bid] int  NOT NULL,
    [Items Bought] int  NOT NULL,
    CONSTRAINT Buyers_pk PRIMARY KEY (Buyer ID)
);

-- Table Category
CREATE TABLE IF NOT EXISTS Category (
    Category group varchar(35)  NOT NULL,
    Description text  NOT NULL,
    Category_Category ID int  NOT NULL,
    Items_Item ID int  NOT NULL
);

-- Table Items
CREATE TABLE IF NOT EXISTS Items (
    Name varchar(35)  NOT NULL,
    Category varchar(35)  NOT NULL,
    Item ID int  NOT NULL,
    Description text  NOT NULL,
    Start Price decimal(65,2)  NOT NULL,
    Reserve Price decimal(65,2)  NOT NULL,
    End Date date  NOT NULL,
    Current Price decimal(65,2)  NOT NULL,
    Bids int  NOT NULL,
    Stock int  NOT NULL,
    Seller ID int  NOT NULL,
    CONSTRAINT Items_pk PRIMARY KEY (Item ID)
);

-- Table Sellers
CREATE TABLE IF NOT EXISTS Sellers (
    First Name varchar(35)  NOT NULL,
    Last Name varchar(35)  NOT NULL,
    Seller ID int  NOT NULL,
    Rating int  NOT NULL,
    Items Listed int  NOT NULL,
    Items Sold int  NOT NULL,
    CONSTRAINT Sellers_pk PRIMARY KEY (Seller ID)
);

-- End of file.
