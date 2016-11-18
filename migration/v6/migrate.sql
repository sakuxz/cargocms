ALTER TABLE Users add updateEmailToken varchar(32) DEFAULT NULL;
ALTER TABLE Users add updateEmail varchar(32) DEFAULT NULL;

ALTER TABLE Messages MODIFY COLUMN type enum('greeting','orderConfirm','paymentConfirm','deliveryConfirm','orderSync', 'forgotPassword', 'contact', 'newEmail');
