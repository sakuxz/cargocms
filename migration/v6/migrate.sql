
ALTER TABLE Posts add `publish` tinyint(1) DEFAULT '1';

UPDATE Feeds SET publish = 0 WHERE type = 'status';
ALTER TABLE Feeds MODIFY fullPicture text;
