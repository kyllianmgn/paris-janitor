import express from "express";
import { invalidPath } from "./errors/invalid-path";
import { initUsers } from "./routes/users";
import {initAuth} from "./routes/auth";
import {initOrganizations} from "./routes/organizations";
import {initMembers} from "./routes/members";
import {initActivities} from "./routes/activities";
import {initAGS} from "./routes/ags";
import {initDocuments} from "./routes/documents";
import {initDonations} from "./routes/donations";
import {initVotes} from "./routes/votes";
import {initResourceType} from "./routes/resource-types";
import {initResource} from "./routes/resources";
import {initTask} from "./routes/tasks";
import {initAssignment} from "./routes/assignments";
import {initTaskResource} from "./routes/task-resources";
import {initJavaVersions} from "./routes/java-versions";
import {initAI} from "./routes/openai";

export const initRoutes = (app: express.Express) => {
    app.get("/health", (_req, res) => {
        res.status(200).json({ data: "lol" });
    });

    initUsers(app);
    initAuth(app);
    initOrganizations(app)
    initMembers(app);
    initActivities(app);
    initAGS(app);
    initDocuments(app);
    initDonations(app);
    initVotes(app);
    initResourceType(app);
    initResource(app);
    initTask(app);
    initAssignment(app);
    initTaskResource(app);
    initJavaVersions(app);
    initAI(app);

    app.use(invalidPath);
};
