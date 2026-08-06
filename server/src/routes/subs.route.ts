//getallsubscription
//getsubsbyid
import {
  getSubscriptions,
  getSubscriptionById,
  createSubscriptions,
  deleteSubscriptionById,
  editSubscriptionById,
  renewSubscription,
  getPaginatedSubscription,
  getSubscriptionsInfo,
  getSubscriptionExpenses,
  getSpendingByCategory,
} from "../controllers/subs.controller.js";

//post request
//add subscription 
//delete subscription by id
//edit subscription by id

import { Router } from "express";

export const subscriptionRouter = Router()
subscriptionRouter.get("/paginated", getPaginatedSubscription);
subscriptionRouter.get("/", getSubscriptions);
subscriptionRouter.get("/expenses", getSubscriptionExpenses);
subscriptionRouter.get("/categories", getSpendingByCategory);
subscriptionRouter.get("/info", getSubscriptionsInfo);
subscriptionRouter.get("/:id", getSubscriptionById);
subscriptionRouter.post("/add", createSubscriptions);
subscriptionRouter.patch("/edit/:id", editSubscriptionById);
subscriptionRouter.delete("/delete/:id", deleteSubscriptionById);
subscriptionRouter.patch("/:id/renew", renewSubscription);

