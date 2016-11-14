ALTER TABLE RecipeOrders add `deletedAt` datetime DEFAULT NULL;
ALTER TABLE Allpays add `deletedAt` datetime DEFAULT NULL;

ALTER TABLE RecipeOrders ADD UNIQUE (token)

ALTER TABLE EventOrders ADD token varchar(32) DEFAULT NULL
ALTER TABLE EventOrders ADD UNIQUE (token)
ALTER TABLE ScentFeedbacks ADD `feedbackCheck` tinyint(1) DEFAULT '0';
