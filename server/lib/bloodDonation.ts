// server/lib/bloodDonation.ts
import fs from "fs";
import path from "path";
import { db, Timestamp } from "@server/firebase/firebaseConfig"; // ✅ alias used

export interface UploadFile {
  buffer: Buffer;
  originalname: string;
}

// Where uploaded files will go
const PUBLIC_UPLOAD_PATH = path.join(__dirname, "../../public/bloodDonationReport");

/**
 * Save the uploaded file to the public folder
 */
export const uploadBloodDonationReport = async (file: UploadFile): Promise<string> => {
  if (!fs.existsSync(PUBLIC_UPLOAD_PATH)) {
    fs.mkdirSync(PUBLIC_UPLOAD_PATH, { recursive: true });
  }

  const fileName = `${Date.now()}-${file.originalname}`;
  const filePath = path.join(PUBLIC_UPLOAD_PATH, fileName);

  await fs.promises.writeFile(filePath, file.buffer);

  return `/bloodDonationReport/${fileName}`;
};

/**
 * Complete a blood donation
 * 1. Save the uploaded report
 * 2. Update bloodAcceptances document
 * 3. Update the linked bloodRequest status to "completed"
 */
export const completeBloodDonation = async (file: UploadFile, donationId: string) => {
  const donationRef = db.collection("bloodAcceptances").doc(donationId);
  const donationSnap = await donationRef.get();

  if (!donationSnap.exists) {
    throw new Error("Donation record not found");
  }

  // Upload the report
  const reportUrl = await uploadBloodDonationReport(file);

  // Update the donation record
  await donationRef.update({
    reportUrl,
    completedAt: Timestamp.now(),
  });

  // Update the related blood request to "completed"
  const donationData = donationSnap.data();
  if (!donationData?.bloodRequestId) {
    throw new Error("Blood request ID missing in donation record");
  }

  const requestRef = db.collection("bloodRequests").doc(donationData.bloodRequestId);
  await requestRef.update({ status: "completed" });

  return { success: true, reportUrl };
};
