
ALTER TABLE RecipeOrders add shipping varchar(255) DEFAULT NULL;
ALTER TABLE RecipeOrders add trackingNumber varchar(255) DEFAULT NULL;
UPDATE Images SET `filePath` = REPLACE (`filePath`,'/home/ubuntu','file:///home/ubuntu') WHERE `filePath` LIKE '/home/ubuntu%';
ALTER TABLE Messages MODIFY COLUMN type enum('greeting','orderConfirm','paymentConfirm','deliveryConfirm','orderSync', 'forgotPassword', 'contact');
