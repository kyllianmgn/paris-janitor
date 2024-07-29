import express from "express";
import { prisma } from "./utils/prisma";
import { initRoutes } from "./api/routes";
import cors from "cors";

const main = async () => {
  const app = express();
  const port = Number(process.env.PORT);

  try {
    console.log("Datasource initialized");
  } catch (error) {
    console.log(error);
    console.error("Cannot contact database.");
    process.exit(1);
  }

  app.use(cors());

  app.use(express.json({ limit: "50mb" }));

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    initRoutes(app);
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
