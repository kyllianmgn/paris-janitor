import express from "express";
import { prisma } from "../../utils/prisma";
import {
  userPatchValidation,
} from "../validators/user-validator";
import { isAuthenticated, isSuperAdmin } from "../middlewares/auth-middleware";

export const initUsers = (app: express.Express) => {
  app.get(`/users/me`, isAuthenticated, async (req: any, res) => {
    try {
      let user;
      if (req.user.userId){
        user = await prisma.user.findUnique({
          where: { id: +req.user.userId },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            Landlord: true,
            Traveler: true,
            ServiceProvider: true
          }
        });
      }else if (req.user.adminId){
        user = await prisma.admin.findUnique({
          where: { id: +req.user.adminId },
          select: {
            id: true,
            username: true
          }
        })
      }

      res.status(200).json({data: user});
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.get("/users", isAuthenticated, isSuperAdmin, async (_req, res) => {
    try {
      const allUsers = await prisma.user.findMany();
      res.status(200).json({data: allUsers});
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.get("/users/:id(\\d+)", isAuthenticated, isSuperAdmin, async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(req.params.id) },
      });
      res.status(200).json({data: user});
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.patch("/users/:id(\\d+)", async (req, res) => {
    const validation = userPatchValidation.validate(req.body);

    if (validation.error) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const userRequest = validation.value;
    try {
      const user = await prisma.user.update({
        where: {
          id: Number(req.params.id),
        },
        data: userRequest,
      });
      res.status(200).json({data: user});
    } catch (e) {
      res.status(500).json({ error: e });
      return;
    }
  });

  app.delete("/users/:id(\\d+)", async (req, res) => {
    try {
      const deletedUser = await prisma.user.delete({
        where: { id: Number(req.params.id) },
      });
      res.status(200).json({data: deletedUser});
    } catch (e) {
      res.status(500).send({ error: e });
    }
  });
};
