import bcrypt from "bcryptjs"
import { db } from "../lib/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
    const { email, password, name } = req.body;
    console.log("email", email);

    try {
        const existingUser = await db.user.findUnique({
            where: {
                email
            }
        })
        if (existingUser)
            return res.status(400).json(
                {
                    status: false,
                    message: "User already exists"
                }
            )
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: UserRole.USER
            }
        })

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: "7d" })

        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 1000 * 60 * 60 * 24 * 7
        })

        res.status(201).json({
            message: "User created succesfully",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                image: newUser.image
            }

        })
    } catch (error) {
        console.error("Error creating user", error);
        return res.status(500).json({
            message: `Error creating user, ${error}`
        })
    }

}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({
                status: false,
                message: "All fields are required"
            })

        const user = await db.user.findUnique({
            where: {
                email
            }
        })
        if (!user)
            return res.status(401).json(
                {
                    message: "User not found"
                }
            )

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch)
            return res.status(401).json(
                {
                    stataus: false,
                    message: "Invalid credentials"
                })
    } catch (error) {
        console.error("Login Failed", error);
        res.status(400).json({
            status: false,
            message: `Login Failed ${error}`
        })


    }

}

const logout = async (req, res) => {

}

const me = async (req, res) => {

}

export { register, login, logout, me }