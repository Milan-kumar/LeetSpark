import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { addProblemToPlaylist, createPlaylist, deletePlaylist, getAllPlaylists, getPlaylist, removeProblemFromPlaylist } from "../controllers/playlist.controller.js";

const playlistRoutes = express.Router();

playlistRoutes.get("/", authMiddleware, getAllPlaylists);
playlistRoutes.get("/:playlistId", authMiddleware, getPlaylist);
playlistRoutes.post("/createPlaylist", authMiddleware, createPlaylist);
playlistRoutes.post("/:playlistId/addProblem", authMiddleware, addProblemToPlaylist);
playlistRoutes.delete("/:playlistId", authMiddleware, deletePlaylist);
playlistRoutes.delete("/:playlistId/removeProblem", authMiddleware, removeProblemFromPlaylist);

export default playlistRoutes;