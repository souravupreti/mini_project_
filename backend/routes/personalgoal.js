 import express from "express";
import {
  addPersonalGoal,
  getPersonalGoals,
  updatePersonalGoal,
  deletePersonalGoal,
} from "../controllers/personal.controller.js";
import {authenticate} from "../middleware/isAuth.js";

const routerssss = express.Router();

routerssss.post("/goals", authenticate, addPersonalGoal); // Add a new goal
routerssss.get("/goals", authenticate, getPersonalGoals); // Get all goals
routerssss.put("/goals/:goalId", authenticate, updatePersonalGoal); // Update a goal
routerssss.delete("/goals/:id", authenticate, deletePersonalGoal); // Delete a goal

export default routerssss;