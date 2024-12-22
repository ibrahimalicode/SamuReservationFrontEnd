import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

async function verifyCode(Email, inputCode, isDelete = false) {
  try {
    console.log(Email, inputCode);
    const verificationRef = doc(db, "EmailVerification", Email);
    const verificationSnap = await getDoc(verificationRef);

    if (verificationSnap.exists()) {
      const { code } = verificationSnap.data();

      // Check if the code matches
      if (code === inputCode) {
        // Delete the code after successful verification
        if (isDelete) await deleteDoc(verificationRef);

        return true; // Code verified successfully
      } else {
        throw new Error("Invalid verification code.");
      }
    } else {
      throw new Error("No verification code found for this email.");
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    return false;
  }
}

export default verifyCode;
