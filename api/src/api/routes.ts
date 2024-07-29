import express from "express";
import { invalidPath } from "./errors/invalid-path";
import { initUsers } from "./routes/users";

export const initRoutes = (app: express.Express) => {
    app.get("/health", (_req, res) => {
        res.status(200).json({ data: "lol" });
    });

    initUsers(app);

    app.use(invalidPath);
};
