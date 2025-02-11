import express from "express";
import { router } from "./routes/v1"; //@ts-ignore
import client from "@repo/db";

const app = express();
const PORT = 3000;

app.use("/api/v1", router);

app.listen(PORT, () => {
  console.log("server is running " + PORT);
});
