//getallsubscription
//getsubsbyid
import {
  getAlmostExpiredSubscriptions,
  getSubscriptionById,
  createSubscriptions,
  deleteSubscriptionById,
  editSubscriptionById,
  renewSubscription,
  getPaginatedSubscription,
  getSubscriptionsInfo,
  getSubscriptionExpenses,
  getSpendingByCategory,
  cancelSubscription,
  archiveSubscription,
} from "../controllers/subs.controller.js";

//post request
//add subscription 
//delete subscription by id
//edit subscription by id

import { Router } from "express";

export const subscriptionRouter = Router()
// GET Methods
subscriptionRouter.get("/paginated", getPaginatedSubscription);
subscriptionRouter.get("/almostExpired", getAlmostExpiredSubscriptions);
subscriptionRouter.get("/expenses", getSubscriptionExpenses);
subscriptionRouter.get("/categories", getSpendingByCategory);
subscriptionRouter.get("/info", getSubscriptionsInfo);
subscriptionRouter.get("/:id", getSubscriptionById);

// POST Method
subscriptionRouter.post("/add", createSubscriptions);

//PATCH Methods
subscriptionRouter.patch("/edit/:id", editSubscriptionById);
subscriptionRouter.patch("/:id/renew", renewSubscription);
subscriptionRouter.patch("/cancel/:id", cancelSubscription);
subscriptionRouter.patch("/archive/:id", archiveSubscription);


// DELETE method
subscriptionRouter.delete("/delete/:id", deleteSubscriptionById);



