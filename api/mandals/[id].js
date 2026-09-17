import { config } from "../_lib/config.js";
import { ObjectId } from "mongodb";
import { getDb } from "../_lib/db.js";
import { requireAdmin } from "../_lib/auth.js";

export default async function handler(req, res) {
  try {
    await requireAdmin(req);

    const db = await getDb();
    const col = db.collection(config.mongodbCollection);

    const rawId = req.params?.id || req.query?.id;

    if (!rawId || !ObjectId.isValid(rawId)) {
      return res.status(400).json({
        error: "Invalid mandal id"
      });
    }

    const _id = new ObjectId(rawId);

    // UPDATE MANDAL
    if (req.method === "PUT") {
      const doc = {
        ...req.body,
        updatedAt: new Date()
      };

      // Never allow these fields to be overwritten
      delete doc._id;
      delete doc.createdAt;

      const result = await col.updateOne(
        { _id },
        {
          $set: doc
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({
          error: "Mandal not found"
        });
      }

      return res.json({
        ok: true,
        message: "Mandal updated successfully"
      });
    }

    // DELETE MANDAL
    if (req.method === "DELETE") {
      const result = await col.deleteOne({ _id });

      if (result.deletedCount === 0) {
        return res.status(404).json({
          error: "Mandal not found"
        });
      }

      return res.json({
        ok: true,
        message: "Mandal deleted successfully"
      });
    }

    return res.status(405).json({
      error: "Method not allowed"
    });
  } catch (error) {
    console.error("Mandal API error:", error);

    const status =
      error.message === "Unauthorized"
        ? 401
        : 500;

    return res.status(status).json({
      error:
        status === 401
          ? "Your admin session has expired. Please log in again."
          : error.message || "Internal server error"
    });
  }
}
