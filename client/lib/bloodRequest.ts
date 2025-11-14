import {
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  Timestamp,
  updateDoc,
  doc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import { getCompatibleRecipients } from "@/lib/bloodCompatibility"


export const createBloodRequest = async (data : any) => {
  try {
    const urgency= data.urgency;
    const hours =
    urgency === 1
      ? 2
      : urgency === 2
      ? 6
      : urgency === 3
      ? 24
      : 72; // urgency === "4"

    const now = new Date();
    const ttl = new Date(now.getTime() + hours * 60 * 60 * 1000);
    const docRef = await addDoc(collection(db, "bloodRequests"), {
      ...data,
      status: "requested",
      ttl,
      createdAt: Timestamp.now(),
    });
    console.log("Blood request saved with ID:", docRef.id);
    return {
      success: true,
      message: "Blood request submitted successfully!",
      id: docRef.id,
    };
  } catch (error) {
    console.error("Error saving blood request:", error);
    return {
      success: false,
      message: "Failed to submit blood request. " + error.message,
    };
  }
}

export const getBloodRequestsOfType = async (
  bloodType: string,
  l : number,
) => {
  const q = query(
    collection(db, "bloodRequests"),
    where("status", "==", "requested"),
    where("bloodType", "==", bloodType),
    orderBy("urgency"),
    orderBy("createdAt", "desc"),
    limit(l),
  );
  const snapshot = await getDocs(q);
  const now = Timestamp.now();

  const results = await Promise.all(
    snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();
      const ttl = data.ttl?.toMillis?.() || 0;
      const expired = ttl < now.toMillis();

      if (expired && data.status === "requested") {
        await updateDoc(docSnap.ref, { status: "expired" });
        return null;
      }

      return { id: docSnap.id, ...data };
    })
  );

  return results.filter((item) => item !== null);
};

export const getUrgencyHeader = async () => {
  const q = query(
    collection(db, "bloodRequests"),
    where("status", "==", "requested"),
    orderBy("urgency"),
    orderBy("createdAt", "desc"),
    limit(6),
  );
  const snapshot = await getDocs(q);
  const now = Timestamp.now();

  const results = await Promise.all(
    snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();
      const ttl = data.ttl?.toMillis?.() || 0;
      const expired = ttl < now.toMillis();

      if (expired && data.status === "requested") {
        await updateDoc(docSnap.ref, { status: "expired" });
        return null; 
      }

      return { id: docSnap.id, ...data };
    })
  );

  return results.filter((item) => item !== null);
};