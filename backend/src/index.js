import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";

dotenv.config();
const PORT = process.env.PORT || 8080

const app = express();

app.use(express.json())
app.use(cookieParser());


app.get("/", (req, res) => {
    res.send("Welcome to leetspark 🧑‍💻")

})

app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);

})