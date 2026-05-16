import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../../auth.js";

async function getSession(req) {
  return auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });
}

export function registerAuthExampleRoutes(app) {
  app.get("/api/session", async (req, res, next) => {
    try {
      const session = await getSession(req);
      res.json({ session });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/public", (_req, res) => {
    res.json({
      message: "Route ini publik. Kamu bisa akses tanpa login.",
      protected: false
    });
  });

  app.get("/api/protected", async (req, res, next) => {
    try {
      const session = await getSession(req);

      if (!session) {
        res.status(401).json({ message: "Kamu harus sign in untuk membuka route ini." });
        return;
      }

      res.json({
        message: "Route ini protected dan hanya bisa dibuka setelah login.",
        protected: true,
        user: session.user
      });
    } catch (error) {
      next(error);
    }
  });
}
