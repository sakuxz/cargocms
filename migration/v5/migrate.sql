ALTER TABLE RecipeOrders add `deletedAt` datetime DEFAULT NULL;
ALTER TABLE Allpays add `deletedAt` datetime DEFAULT NULL;

ALTER TABLE RecipeOrders ADD UNIQUE (token);
ALTER TABLE EventOrders ADD UNIQUE (token);

ALTER TABLE Feeds MODIFY description text;
ALTER TABLE Feeds MODIFY message text;
