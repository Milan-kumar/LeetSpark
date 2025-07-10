import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"

import authRoutes from "./routes/auth.route.js";
import problemRoutes from "./routes/problem.route.js";
import executeRoutes from "./routes/executeCode.route.js";
import submissionRoutes from "./routes/submission.route.js";
import playlistRoutes from "./routes/playlist.routes.js";

dotenv.config();
const PORT = process.env.PORT || 8080

const app = express();

//middleware
// origin: "http://localhost:5173",
app.use(cors({
    origin: process.env.APP_URL,
    credentials: true
}))

app.use(express.json())
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Welcome to leetspark 🧑‍💻")
    console.log(PORT);
    
})

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problem", problemRoutes);
app.use("/api/v1/execute-code", executeRoutes)
app.use("/api/v1/submissions", submissionRoutes)
app.use("/api/v1/playlist", playlistRoutes);

app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT} ${process.env.APP_URL}`);

})