RENAME TABLE Slogans TO Quotes;
ALTER TABLE Quotes add `type` enum('quote','recommend') DEFAULT 'quote';
ALTER TABLE Quotes add `author` varchar(255) DEFAULT NULL;
