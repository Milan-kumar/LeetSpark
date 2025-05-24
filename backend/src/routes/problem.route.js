import express from "express";
import { authMiddleware, checkAdmin } from "../middleware/auth.middleware.js";
import { createProblem, deleteProblem, getAllProblems, getAllProblemsSolvedByUser, getProblem, updateProblem } from "../controllers/problem.controller.js";

const problemRoutes = express.Router();

// Create a new problem (Admin only)
problemRoutes.post("/create-problem", authMiddleware, checkAdmin, createProblem);

// Get all problems (Public)
problemRoutes.get("/get-all-problems", authMiddleware, getAllProblems);

// Get a problem by ID (Public)
problemRoutes.get("/get-problem/:id", authMiddleware, getProblem)

// Update a problem by ID (Admin only) put is used TO UPDATE ALL FIELDS AND PATCH IS USED TO UPDATE SPECIFIC FIELDS ONLY
problemRoutes.post("/update-problem/:id", authMiddleware, checkAdmin, updateProblem);

// Delete a problem by ID (Admin only)
problemRoutes.delete("/delete-problem/:id", authMiddleware, checkAdmin, deleteProblem);

problemRoutes.get("/get-solved-problems", authMiddleware, getAllProblemsSolvedByUser);

export default problemRoutes;