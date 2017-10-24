ALTER TABLE Posts add `chosen` tinyint(1) DEFAULT '0';

ALTER TABLE Scents add `coverUrl` VARCHAR(255);

CREATE TABLE `StaticPages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `html` text,
  `css` text,
  `javascript` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 新增發布日期欄位
ALTER TABLE Posts add `date` DATE;