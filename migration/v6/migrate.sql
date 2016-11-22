ALTER TABLE RecipeOrder MODIFY COLUMN productionStatus enum("NEW","PENDING", "RECEIVED", "REQUESTED", "SUBMITTED", "PAID", "PROCESSING", "CANCELLED", "SHIPPED", "DELIVERED", "COMPLETED");
ALTER TABLE EventOrder MODIFY COLUMN productionStatus enum("NEW","PENDING", "RECEIVED", "REQUESTED", "SUBMITTED", "PAID", "PROCESSING", "CANCELLED", "SHIPPED", "DELIVERED", "COMPLETED");

UPDATE RecipeOrder JOIN Allpay ON Allpay.`RecipeOrderId` = RecipeOrder.`id` SET RecipeOrder.`productionStatus` = "PENDING" WHERE Allpay.PaymentType = 'aio';
