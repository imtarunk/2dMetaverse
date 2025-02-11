import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers["authorization"];
  const token = header?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, "key") as {
      role: string;
      userId: string;
    };

    if (decoded.role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    req.userId = decoded.userId; // ✅ Corrected

    next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
