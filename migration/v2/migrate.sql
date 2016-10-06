UPDATE Allpays SET TradeNo=NULL WHERE TradeNo=MerchantTradeNo;
ALTER TABLE Feeds add createdTime DATETIME DEFAULT NULL;
ALTER TABLE Feeds add publish TINYINT DEFAULT 1;

ALTER TABLE Messages MODIFY COLUMN type enum('greeting','orderConfirm','paymentConfirm','deliveryConfirm','orderSync', 'forgotPassword');
ALTER TABLE Users add resetPasswordToken varchar(32) DEFAULT NULL;

CREATE TABLE `Contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `content` text,
  `success` tinyint(1) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

ALTER TABLE Posts ADD type enum('blog','internal-event','external-event') DEFAULT 'blog';
ALTER TABLE Posts ADD alias varchar(255) DEFAULT NULL;
UPDATE Posts SET url=NULL

CREATE TABLE `Events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `limit` int(11) DEFAULT '0',
  `signupCount` int(11) DEFAULT '0',
  `price` int(11) DEFAULT '0',
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `sellStartDate` datetime NOT NULL,
  `sellEndDate` datetime NOT NULL,
  `eventStartDate` datetime NOT NULL,
  `eventEndDate` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `PostId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `PostId` (`PostId`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`PostId`) REFERENCES `Posts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;


CREATE TABLE `EventOrders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `recipient` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `invoiceNo` varchar(255) DEFAULT NULL,
  `productionStatus` enum('NEW','RECEIVED','REQUESTED','SUBMITTED','PAID','PROCESSING','CANCELLED','SHIPPED','DELIVERED','COMPLETED') DEFAULT 'NEW',
  `updatedAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL,
  `EventId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `UserId` (`UserId`),
  KEY `EventId` (`EventId`),
  CONSTRAINT `eventorders_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `eventorders_ibfk_2` FOREIGN KEY (`EventId`) REFERENCES `Events` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
