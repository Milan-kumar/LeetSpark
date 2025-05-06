import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import problemRoutes from "./routes/problem.route.js";
import executeRoutes from "./routes/executeCode.route.js";

dotenv.config();
const PORT = process.env.PORT || 8080

const app = express();

app.use(express.json())
app.use(cookieParser());


app.get("/", (req, res) => {
    res.send("Welcome to leetspark 🧑‍💻")

})

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problem", problemRoutes);
app.use("/api/v1/execute-code", executeRoutes)

app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);

})