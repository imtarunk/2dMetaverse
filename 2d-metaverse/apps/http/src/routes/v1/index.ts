import { Router } from "express";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import { userRouter } from "./user";

export const router = Router();

router.post("/login", (req, res) => {
  return console.log("routing is success");
});

router.post("/signup", (req, res) => {
  res.status(200).json({
    message: "routting success",
  });
});

router.get("/avaters", (req, res) => {});

router.get("/elements", (req, res) => {});

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/space", spaceRouter);
