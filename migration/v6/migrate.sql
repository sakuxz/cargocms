ALTER TABLE Users add verificationEmailToken varchar(32) DEFAULT NULL;

ALTER TABLE Messages MODIFY COLUMN type enum('greeting','orderConfirm','paymentConfirm','deliveryConfirm','orderSync', 'forgotPassword', 'contact', 'newEmail');
