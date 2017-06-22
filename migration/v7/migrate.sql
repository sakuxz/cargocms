CREATE TABLE `Configs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `key` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `value` text NOT NULL,
  `type` enum('text','editor','url','file','boolean','array') NOT NULL DEFAULT 'text',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8;


INSERT INTO `MenuItems` (`id`, `icon`, `href`, `title`, `sequence`, `createdAt`, `updatedAt`, `ParentMenuItemId`)
VALUES
	(20, 'sliders', '#', '設定', 3, '2017-06-22 14:37:19', '2017-06-22 14:37:19', NULL);
INSERT INTO `MenuItems` (`id`, `icon`, `href`, `title`, `sequence`, `createdAt`, `updatedAt`, `ParentMenuItemId`)
VALUES
	(21, NULL, '/admin/imagelist?layoutImages', '版位圖片設定', 30, '2017-06-22 14:37:19', '2017-06-22 14:37:19', 20);
