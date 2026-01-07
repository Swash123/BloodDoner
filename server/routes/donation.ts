// server/routes/donation.ts
import { RequestHandler, Router } from "express";
import multer from "multer";
import { completeBloodDonation, UploadFile } from "@server/lib/bloodDonation";

const router = Router();
const upload = multer(); // memory storage

// ✅ Typed request handler
export const handleCompleteDonation: RequestHandler<{ donationId: string }> = async (req, res) => {
  try {
    const donationId = req.params.donationId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadFile: UploadFile = {
      buffer: file.buffer,
      originalname: file.originalname,
    };

    const result = await completeBloodDonation(uploadFile, donationId);

    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Server error" });
  }
};

// Attach route
router.post("/complete/:donationId", upload.single("file"), handleCompleteDonation);

export default router;
