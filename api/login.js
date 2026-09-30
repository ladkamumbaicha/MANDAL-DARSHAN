import { connectMongoDB } from "../mongo.js";
import { login } from "./auth.js";

export default async function loginHandler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ success: false, message: "Method not allowed" });
  await connectMongoDB();
  const { username, password } = req.body || {};
  const token = login(String(username || ""), String(password || ""));
  if (!token) return res.status(401).json({ success: false, message: "Invalid admin credentials" });
  res.json({ success: true, token });
}
