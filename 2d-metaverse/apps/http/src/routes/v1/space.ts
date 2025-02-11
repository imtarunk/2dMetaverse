import { Router } from "express";

export const spaceRouter = Router();

spaceRouter.post("/space", (req, res) => {});

spaceRouter.post("/element", (req, res) => {});

spaceRouter.delete("/element", (req, res) => {});

spaceRouter.delete(":spaceId", (req, res) => {});

spaceRouter.get(":spaceId", (req, res) => {}); // get a space arene

spaceRouter.get("/all", (req, res) => {});
