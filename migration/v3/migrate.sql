ALTER TABLE Messages MODIFY COLUMN type enum('greeting','orderConfirm','paymentConfirm','deliveryConfirm','orderSync', 'forgotPassword');
ALTER TABLE Users add resetPasswordToken varchar(32) DEFAULT NULL
