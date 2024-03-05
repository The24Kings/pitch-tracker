import { addDoc, collection } from "@firebase/firestore"
import { firestore } from "../firebase_setup/firebase"
 
export const handleFirstSubmit = async (testdata) => {
    const ref = collection(firestore, "pitch_type");

    let data = {
        testData: testdata
    };
    
    try {
        await addDoc(ref, data); // Wait for the document to be added
    } catch(err) {
        console.log(err);
    }
}
export const handleSecondSubmit = async (testdata) => {
    const ref = collection(firestore, "pitch_result");

    let data = {
        testData: testdata
    };
    
    try {
        await addDoc(ref, data); // Wait for the document to be added
    } catch(err) {
        console.log(err);
    }
}
export const handlePlayerSubmit = async (playerName) => {
    const playersRef = collection(firestore, "players");

    try {
        await addDoc(playersRef, { name: playerName });
        console.log("Player added successfully!");
    } catch(err) {
        console.error("Error adding player: ", err);
    }
}