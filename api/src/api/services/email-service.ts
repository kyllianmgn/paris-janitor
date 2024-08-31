import nodemailer from "nodemailer";
import crypto from 'crypto';
import { prisma } from "../../utils/prisma";
import {User} from "./users-services";


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const sendResetPasswordEmail = async (email: string, resetToken: string): Promise<void> => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Reset Your Password',
        html: `
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
    `,
    };

    await transporter.sendMail(mailOptions);
};

export const createResetPasswordToken = async (email: string): Promise<void> => {
    const user: User | null = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('User not found');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour

    await prisma.resetPasswordToken.upsert({
        where: { userId: user.id },
        update: { token, expiresAt },
        create: { userId: user.id, token, expiresAt },
    });


    await sendResetPasswordEmail(email, token);
};