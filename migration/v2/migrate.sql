ALTER TABLE Feeds add createdTime DATETIME DEFAULT NULL;
ALTER TABLE Feeds add publish TINYINT DEFAULT 1;

ALTER TABLE Messages MODIFY COLUMN type enum('greeting','orderConfirm','paymentConfirm','deliveryConfirm','orderSync', 'forgotPassword');
ALTER TABLE Users add resetPasswordToken varchar(32) DEFAULT NULL
