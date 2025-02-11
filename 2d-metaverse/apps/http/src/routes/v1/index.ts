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
      .status(400)
      .json({ message: "Entre a valid input and try to login in again" });
  }

  try {
    const user = await client.user.findUnique({
      where: {
        username: parsed.data?.username,
      },
    });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const isValid = await bcrypt.compare(
      parsed.data?.password as string,
      user.password
    ); // true

    if (isValid) {
      const token = jwt.sign({ userId: user.id, role: user.role }, "key");
      res.status(200).json({
        message: "user logged in success",
        success: true,
        token: token,
      });
      return;
    }
  } catch (e) {
    res.status(400).json({ message: "internal server error" });
  }
});

router.post("/signup", async (req, res) => {
  const parsed = SignupSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: "validation error" });
    return;
  }

  const hashPassword = bcrypt.hashSync(parsed.data.password, 5);

  try {
    const newUser = await client.user.create({
      data: {
        username: parsed.data.username,
        password: hashPassword,
        role: parsed.data.type === "admin" ? "Admin" : "User",
      },
    });

    res.status(200).json({
      message: "user signup success",
      success: true,
      userId: newUser.id,
    });
    return;
  } catch (err) {
    res.status(400).json({ message: "User already exists" });
    console.log("error:" + err);
  }
});

router.get("/avaters", (req, res) => {});

router.get("/elements", (req, res) => {});

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/space", spaceRouter);
