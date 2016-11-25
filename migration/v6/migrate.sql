
ALTER TABLE RecipeOrders MODIFY COLUMN productionStatus enum("NEW","PENDING", "RECEIVED", "REQUESTED", "SUBMITTED", "PAID", "PROCESSING", "CANCELLED", "SHIPPED", "DELIVERED", "COMPLETED");
ALTER TABLE EventOrders MODIFY COLUMN productionStatus enum("NEW","PENDING", "RECEIVED", "REQUESTED", "SUBMITTED", "PAID", "PROCESSING", "CANCELLED", "SHIPPED", "DELIVERED", "COMPLETED");
UPDATE RecipeOrders JOIN Allpays ON Allpays.`RecipeOrderId` = RecipeOrders.`id` SET RecipeOrders.`productionStatus` = "PENDING" WHERE Allpays.PaymentType = 'aio';

UPDATE Feeds SET publish = 0 WHERE type = 'status';
ALTER TABLE Feeds MODIFY fullPicture text;
