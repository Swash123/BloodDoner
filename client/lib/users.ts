import {
  addDoc,
  collection,
  setDoc,
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
import {getCompatibleDonors} from "@/lib/bloodCompatibility"

export async function createUser(
    id:string,
    email: string,
    userData :Record<string, any>,
){
    try{
        await setDoc(doc(db, "users", id), {
            uid: id,
            email: email,
            ...userData,
            createdAt: new Date(),
        });
        return {
            success: true,
            message: "User Created successfully!",
            id: id,
        };
    }catch(err){
        console.log(err);
        return {
            success: false,
            message: "Failed to create User!",
        };
    }
}

export async function searchDonnerforRequest(
    bloodType: string,
){
    const bloodTypes=getCompatibleDonors(bloodType);
    const q = query(
        collection(db, "users"),
        where("role","==","donor"), 
        where("bloodType", "==", bloodType),
        limit(5),
    );
    const docsSnap= await getDocs(q);
    let donors = docsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (donors.length < 5) {
        const remaining = 5 - donors.length;
        const otherTypes = bloodTypes.filter(bt => bt !== bloodType);

        if(otherTypes.length>0){
            const otherQuery = query(
                collection(db, "users"),
                where("role", "==", "donor"),
                where("bloodType", "in", otherTypes),
                limit(remaining)
            );
            const otherSnap = await getDocs(otherQuery);
            const others = otherSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            donors = [...donors, ...others];
        }


    }
    return donors;
}