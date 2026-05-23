//getallsubscription
//getsubsbyid
import {
  getSubscriptions,
  getSubscriptionById,
  createSubscriptions,
  deleteSubscriptionById,
  editSubscriptionById,
} from "../controllers/subs.controller.js";

//post request
//add subscription 
//delete subscription by id
//edit subscription by id

import { Router } from "express";

export const subscriptionRouter = Router()

subscriptionRouter.get("/", getSubscriptions);
subscriptionRouter.get("/:id", getSubscriptionById);
subscriptionRouter.post("/add", createSubscriptions);
subscriptionRouter.patch("/edit/:id", editSubscriptionById);
subscriptionRouter.delete("/delete/:id", deleteSubscriptionById);

