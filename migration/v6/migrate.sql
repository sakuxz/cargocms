RENAME TABLE Slogans TO Qoutes;
ALTER TABLE Qoutes add `type` enum('quote','recommend') DEFAULT 'quote';
ALTER TABLE Qoutes add `author` varchar(255) DEFAULT NULL;
