import { Router } from "express";
import { UpdateMetaDataSchema } from "../../types";
import client from "@repo/db/client";
import { userMiddleware } from "../../middleware/user";

export const userRouter = Router();

userRouter.post("/metadata", userMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const parsedData = UpdateMetaDataSchema.safeParse(req.body);

    if (!parsedData.success) {
      res.status(400).json({ message: "Validation failed" });
      return;
    }

    await client.user.update({
      where: {
        id: req.userId,
      },
      data: {
        avatarId: parsedData.data.avatarId,
      },
    });
    res.json({ message: "Metadata updated" });
  } catch (e) {
    res.status(400).json({ message: "internal server error" });
  }
});

userRouter.get("/metadata/bulk", async (req, res) => {
  const userIdString = (req.query.ids ?? "[]") as string;
  const userIds = userIdString.slice(1, userIdString.length - 2).split(",");

  const metadata = await client.user.findMany({
    where: {
      id: { in: userIds },
    },
    select: { avatar: true, id: true },
  });

  res.json({
    avaters: metadata.map((m) => ({
      // returning metadata response into map with userID and imgUrl
      userId: m.id,
      avaterId: m.avatar?.imageUrl,
    })),
  });
});
