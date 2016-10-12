UPDATE Images SET `filePath` = REPLACE (`filePath`,'/home/ubuntu','file:///home/ubuntu') WHERE `filePath` LIKE '/home/ubuntu%';
ALTER TABLE Messages MODIFY COLUMN type enum('greeting','orderConfirm','paymentConfirm','deliveryConfirm','orderSync', 'forgotPassword', 'contact');
