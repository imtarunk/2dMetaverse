import { configDotenv } from "dotenv";
import express from "express";
import { router } from "./routes/v1";

configDotenv();
const app = express();
app.use(express.json());

app.use("/api/v1", router);

const port = process.env.PORT || 2000;
app.listen(port, () => {
  console.log("server is running " + port);
});
