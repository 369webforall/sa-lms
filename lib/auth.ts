import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { emailOTP } from "better-auth/plugins";
import { resend } from "./resend";
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.AUTH_GITHUB_CLIENT_SECRET,
    },
  },

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        //implement sending email to the user.
        await resend.emails.send({
          from: "SA-TECH <onboarding@resend.dev>",
          to: [email],
          subject: "SA-TECH Verify your email",
          html: `<p>Your OPT is <strong>${otp}</strong></p>`,
        });
      },
    }),
  ],
});
