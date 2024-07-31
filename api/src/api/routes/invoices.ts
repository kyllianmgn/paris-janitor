import express from "express";
import { prisma } from "../../utils/prisma";
import { isAuthenticated, isSuperAdmin } from "../middlewares/auth-middleware";
import {InvoicePatchValidator, InvoiceValidator,} from "../validators/invoice-validator";

export const initInvoices = (app: express.Express) => {
    app.get("/invoices", async (_req, res) => {
        try {
            const allInvoices = await prisma.invoice.findMany();
            res.status(200).json({data: allInvoices});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/invoices/:id(\\d+)", async (req, res) => {
        try {
            const Invoices = await prisma.invoice.findUnique({
                where: { id: +req.params.id },
            });
            res.status(200).json({data: Invoices});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.post("/invoices/", async (req, res) => {
        try {
            const validation = InvoiceValidator.validate(req.body);

            if (validation.error) {
                res.status(400).json({ error: validation.error });
                return;
            }

            const serviceRequest = validation.value;
            const invoice = await prisma.invoice.create({
                data: serviceRequest
            })
            res.status(200).json({data: invoice});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.patch("/invoices/:id(\\d+)", isAuthenticated, isSuperAdmin, async (req, res) => {
        const validation = InvoicePatchValidator.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const invoicePatch = validation.value;
        try {
            const property = await prisma.invoice.update({
                where: {
                    id: +req.params.id,
                },
                data: invoicePatch,
            });
            res.status(200).json({data: property});
        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    });

    app.patch("/invoices/:id(\\d+)/status", isAuthenticated, isSuperAdmin, async (req, res) => {
        const validation = InvoicePatchValidator.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const invoicePatch = validation.value;
        try {
            const property = await prisma.invoice.update({
                where: {
                    id: +req.params.id,
                },
                data: {status: invoicePatch.status},
            });
            res.status(200).json({data: property});
        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    });

    app.delete("/invoices/:id(\\d+)", isAuthenticated, isSuperAdmin, async (req, res) => {
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
