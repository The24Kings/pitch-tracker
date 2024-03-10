import { query, where, getDocs, collection, doc, addDoc } from '@firebase/firestore';
import { firestore } from "../firebase_setup/firebase"
 
export const handleFirstSubmit = async (playerName, testdata) => {
    try {
        // Query the "players" collection to find the document with the matching "name" property
        const playerQuery = query(collection(firestore, 'players'), where('name', '==', playerName));
        const querySnapshot = await getDocs(playerQuery);

        // If a document matching the playerName is found
        if (!querySnapshot.empty) {
            // Get the reference to the first document (assuming playerName is unique)
            const playerDoc = querySnapshot.docs[0].ref;
            const pitchTypeRef = collection(playerDoc, "pitch_type");

            let data = {
                testData: testdata
            };

            // Add the testData document to the "pitch_type" subcollection
            await addDoc(pitchTypeRef, data);
        } else {
            console.error(`Player with name "${playerName}" not found.`);
        }
    } catch (err) {
        console.error('Error adding pitch type:', err);
    }
}
export const handleSecondSubmit = async (playerName, testdata) => {
    try {
        // Query the "players" collection to find the document with the matching "name" property
        const playerQuery = query(collection(firestore, 'players'), where('name', '==', playerName));
        const querySnapshot = await getDocs(playerQuery);

        // If a document matching the playerName is found
        if (!querySnapshot.empty) {
            // Get the reference to the first document (assuming playerName is unique)
            const playerDoc = querySnapshot.docs[0].ref;
            const pitchResultRef = collection(playerDoc, "pitch_result");

            let data = {
                testData: testdata
            };

            // Add the testData document to the "pitch_result" subcollection
            await addDoc(pitchResultRef, data);
        } else {
            console.error(`Player with name "${playerName}" not found.`);
        }
    } catch (err) {
        console.error('Error adding pitch result:', err);
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