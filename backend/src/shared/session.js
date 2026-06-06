import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth.js";

export function getSession(req) {
  return auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });
}

export async function requireSession(req, res) {
  const session = await getSession(req);

  if (!session) {
    res.status(401).json({ message: "Kamu harus sign in terlebih dahulu." });
    return null;
  }

  return session;
}
