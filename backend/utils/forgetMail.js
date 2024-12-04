import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export const sendPasswordMail = async (user) => {
    try {
        // Create transporter for sending email
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.PASSWORD,
            },
            secure: false,
            tls: {
                rejectUnauthorized: false,
            },
        });

        // Generate a token for password reset
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Password reset link
        const resetLink = `http://localhost:4000/api/v1/reset-password/${token}`;

        // Send password reset email
        await transporter.sendMail({
            from: `"Your App Name" <${process.env.EMAIL_USER}>`,
            to: user.email, // Use the user's actual email
            subject: "Password Reset Request",
            html: `
                <p>Hi ${user.username},</p>
                <p>You recently requested a password reset for your account. Click the link below to reset your password. If you did not make this request, you can safely ignore this email.</p>
                <p><a href="${resetLink}">Reset Password</a></p>
                <p>This link will expire in one hour.</p>
                <p>Best regards,<br>Your App Support Team</p>
            `,
        });
        console.log("Password reset email sent to:", user.email);
    } catch (error) {
        console.error(`Failed to send password reset email to ${user.email}:`, error);
        throw new Error("Unable to send email at this time.");
    }
};
