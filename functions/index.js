const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

exports.shareReceiptPoints = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { squadId, points } = req.body || {};

  if (!squadId || typeof squadId !== "string") {
    return res.status(400).json({ error: "squadId is required" });
  }

  const numericPoints = Number(points);
  if (!numericPoints || numericPoints <= 0) {
    return res.status(400).json({ error: "points must be a positive number" });
  }

  const firestore = admin.firestore();
  const squadRef = firestore.collection("squads").doc(squadId);

  try {
    const result = await firestore.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(squadRef);
      if (!snapshot.exists) {
        throw new Error("Squad not found");
      }

      const squadData = snapshot.data();
      const members = squadData.members || [];
      if (!Array.isArray(members) || members.length === 0) {
        throw new Error("Squad has no members to share points");
      }

      const perMember = Math.round((numericPoints / members.length) * 100) / 100;
      const updatedTotal = (squadData.totalPoints || 0) + numericPoints;

      transaction.update(squadRef, {
        totalPoints: updatedTotal,
        lastReceipt: {
          amount: numericPoints,
          perMember,
          processedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
      });

      return { perMember, updatedTotal, members: members.length };
    });

    return res.json({
      ok: true,
      distributedPerMember: result.perMember,
      membersCount: result.members,
      totalPoints: result.updatedTotal,
    });
  } catch (error) {
    console.error("shareReceiptPoints error", error);
    return res.status(400).json({ error: error.message || "Unable to share receipt" });
  }
});
