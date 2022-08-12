import "./config/config.js";
import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";

import { authRouter } from "./routes/authRoute.js";
import { hashtagsRouter } from "./routes/hashtagsRoute.js";
import { postRouter } from "./routes/postRoute.js";
import { userRoute } from "./routes/usersRoute.js";

const server = express();

server.use(json());
server.use(cors());

server.use(authRouter);
server.use(hashtagsRouter);
server.use(postRouter);
server.use(userRoute);

const { PORT } = process.env;

server.listen(PORT, () => {
  console.log(chalk.bgGreen.white.bold(`Server is running on port ${PORT}\n`));
});
