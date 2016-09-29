ALTER TABLE Recipes add hashId varchar(32) DEFAULT NULL;

ALTER TABLE RecipeOrders add `productionStatus` enum('NEW','RECEIVED','REQUESTED','SUBMITTED','PAID','PROCESSING','CANCELLED','SHIPPED','DELIVERED','COMPLETED') DEFAULT 'NEW';

ALTER TABLE Recipes DROP `productionStatus`;

ALTER TABLE Recipes DROP `totalDrops`;

ALTER TABLE `Users` ADD (
  `birthday` datetime DEFAULT NULL,
  `phone1` varchar(255) DEFAULT NULL,
  `phone2` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `address2` varchar(255) DEFAULT NULL
);

CREATE TABLE `RecipeFeedbacks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `invoiceNo` varchar(255) DEFAULT '',
  `tradeNo` varchar(255) DEFAULT '',
  `invoiceNoCheck` tinyint(1) DEFAULT '0',
  `tradeNoCheck` tinyint(1) DEFAULT '0',
  `feeling` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  `RecipeId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `UserId` (`UserId`),
  KEY `RecipeId` (`RecipeId`),
  CONSTRAINT `recipefeedbacks_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `recipefeedbacks_ibfk_2` FOREIGN KEY (`RecipeId`) REFERENCES `Recipes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
