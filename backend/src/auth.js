import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { db } from "./db/index.js";
import * as schema from "./db/schema.js";

export const auth = betterAuth({
  appName: "Expense Tracker",
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema
  }),
  emailAndPassword: {
    enabled: true
  },
  trustedOrigins: [process.env.FRONTEND_URL ?? "http://localhost:5173"]
});
