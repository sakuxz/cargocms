
CREATE TABLE `ScentFeedbacks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `feeling` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  `ScentId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `UserId` (`UserId`),
  KEY `ScentId` (`ScentId`),
  CONSTRAINT `scentfeedbacks_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `scentfeedbacks_ibfk_2` FOREIGN KEY (`ScentId`) REFERENCES `Scents` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

ALTER TABLE RecipeOrders add `token` varchar(32) DEFAULT NULL,
