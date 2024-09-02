import express from "express";
import {prisma} from "../../utils/prisma";
import {isAuthenticated, isRole, isSuperAdmin, UserRole} from "../middlewares/auth-middleware";
import {
    interventionFormValidator,
    interventionPatchValidator,
    interventionValidator
} from "../validators/service-validator";

export const initInterventionForms = (app: express.Express) => {
    app.get("/intervention-forms", async (_req, res) => {
        try {
            const allInterventionForms = await prisma.intervention.findMany();
            res.status(200).json({data: allInterventionForms});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/intervention-forms/:id(\\d+)", isAuthenticated, async (req, res) => {
        try {
            const interventionForm = await prisma.interventionForm.findFirst({
                where: { interventionId: +req.params.id },
            });
            res.status(200).json({data: interventionForm});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.post("/intervention-forms/:id(\\d+)", isAuthenticated, isRole(UserRole.SERVICE_PROVIDER), async (req, res) => {
        try {
            const validation = interventionFormValidator.validate(req.body);

            if (validation.error) {
                res.status(400).json({ error: validation.error });
                return;
            }

            const serviceRequest = validation.value;
            const intervention = await prisma.intervention.findUnique({
                where: { id: +req.params.id, providerOccupation: {providerId: req.user?.serviceProviderId} },
            })
            if (!intervention) return res.sendStatus(401)
            const oldInterventionForm = await prisma.interventionForm.findFirst({
                where: { interventionId: intervention.id},
            })

            let interventionForm;
            if (oldInterventionForm){
                interventionForm = await prisma.interventionForm.update({
                    where: {
                        interventionId: intervention.id
                    },
                    data: {
                        comment: serviceRequest.comment,
                    }
                })
            }else{
                interventionForm = await prisma.interventionForm.create({
                    data: {
                        interventionId: intervention.id,
                        comment: serviceRequest.comment,
                    }
                })
            }

            res.status(200).json({data: interventionForm});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.patch("/intervention-forms/:id(\\d+)/status", isAuthenticated, isSuperAdmin, async (req, res) => {
        const validation = interventionPatchValidator.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const interventionFormPatch = validation.value;
        try {
            const property = await prisma.intervention.update({
                where: {
                    id: +req.params.id,
                },
                data: interventionFormPatch,
            });
            res.status(200).json({data: property});
        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    });

    app.delete("/intervention-forms/:id(\\d+)", isAuthenticated, isSuperAdmin, async (req, res) => {
        try {
            const deletedProperty = await prisma.property.delete({
                where: { id: +req.params.id },
            });
            res.status(200).json({data: deletedProperty});
        } catch (e) {
            res.status(500).send({ error: e });
        }
    });
};
