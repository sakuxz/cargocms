UPDATE Images SET `filePath` = REPLACE (`filePath`,'/home/ubuntu','file:///home/ubuntu') WHERE `filePath` LIKE '/home/ubuntu%';
