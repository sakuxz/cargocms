DROP TABLE Slogans;

CREATE TABLE `Quotes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `type` enum('quote','recommend') DEFAULT 'quote',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `img` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `img` (`img`),
  CONSTRAINT `quotes_ibfk_1` FOREIGN KEY (`img`) REFERENCES `Images` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
