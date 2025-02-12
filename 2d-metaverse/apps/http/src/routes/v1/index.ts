import { Router } from "express";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import { userRouter } from "./user";
import { SigninSchema, SignupSchema } from "../../types";
import client from "@repo/db/client";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import bcrypt from "bcrypt";

configDotenv();
export const router = Router();

router.post("/signin", async (req, res) => {
  const parsed = SigninSchema.safeParse(req.body);

  if (!parsed.success) {
    res
      .status(403)
      .json({ message: "Entre a valid input and try to login in again" });
  }

  try {
    const user = await client.user.findUnique({
      where: {
        username: parsed.data?.username,
      },
    });

    if (!user) {
      res.status(403).json({ message: "User not found" });
      return;
    }

    const isValid = await bcrypt.compare(
      parsed.data?.password as string,
      user.password
    ); // true

    if (!isValid) {
      res.status(403).json({ message: "incorrect password" });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, "key");
    res.status(200).json({
      message: "user logged in success",
      token: token,
    });
    return;
  } catch (e) {
    res.status(400).json({ message: "internal server error" });
  }
});

router.post("/signup", async (req, res) => {
  const parsed = SignupSchema.safeParse(req.body);
  if (!parsed.success) {
    console.log("Validation failed:", parsed.error);
    res
      .status(403)
      .json({ message: "Validation error", errors: parsed.error.format() });
    return;
  }

  const username = parsed.data?.username;
  const existingUser = await client.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    console.log("Username already taken");
    res.status(400).json({ error: "Username already taken" });
    return;
  }
  const hashpassword = await bcrypt.hash(parsed.data?.password, 2);

  console.log("Password hashed successfully");

  try {
    const newUser = await client.user.create({
      data: {
        username,
        password: hashpassword,
        role: parsed.data.type === "admin" ? "Admin" : "User",
      },
    });

    console.log("User created successfully:", newUser);
    res.status(200).json({
      message: "User signup success",
      success: true,
      userId: newUser.id,
    });
  } catch (err) {
    console.log("Error during user creation:", err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
});

router.get("/elements", async (req, res) => {
  const elements = await client.element.findMany();

  res.json({
    elements: elements.map((e) => ({
      id: e.id,
      imageUrl: e.imageUrl,
      width: e.width,
      height: e.height,
      static: e.static,
    })),
  });
});

router.get("/avatars", async (req, res) => {
  const avatars = await client.avatar.findMany();
  res.json({
    avatars: avatars.map((x) => ({
      id: x.id,
      imageUrl: x.imageUrl,
      name: x.name,
    })),
  });
});
router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/space", spaceRouter);
