
ALTER TABLE RecipeOrders add shipping varchar(255) DEFAULT NULL;
ALTER TABLE RecipeOrders add trackingNumber varchar(255) DEFAULT NULL;
ALTER TABLE RecipeOrders add `token` varchar(32) DEFAULT NULL;
