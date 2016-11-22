UPDATE Feeds SET publish = 0 WHERE type = 'status';

ALTER TABLE Feeds MODIFY fullPicture text;
