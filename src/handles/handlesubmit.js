import { query, where, getDocs, collection, doc, setDoc, increment, addDoc, getDoc, updateDoc } from '@firebase/firestore';
import { firestore } from '../firebase_setup/firebase';


export const handleFirstSubmit = async (playerName, testdata) => {
    try {
        // Query the "players" collection to find the document with the matching "name" property
        const playerQuery = query(collection(firestore, 'players'), where('name', '==', playerName));
        const querySnapshot = await getDocs(playerQuery);

        // If a document matching the playerName is found
        if (!querySnapshot.empty) {
            // Get the reference to the first document (assuming playerName is unique)
            const playerDocRef = querySnapshot.docs[0].ref;

            // Add a new document with auto-generated ID under the "pitch_data" subcollection
            const pitchDataCollectionRef = collection(playerDocRef, 'pitch_data');
            const newPitchDocRef = await addDoc(pitchDataCollectionRef, {
                pitch_type: testdata,
                pitch_result: null // Initialize pitch_result to null
            });

            console.log("Pitch type added successfully for player:", playerName, "Document ID:", newPitchDocRef.id);
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
            const playerDocRef = querySnapshot.docs[0].ref;

            // Get the reference to the last added document under "pitch_data" subcollection
            const pitchDataCollectionRef = collection(playerDocRef, 'pitch_data');
            const pitchDataQuerySnapshot = await getDocs(pitchDataCollectionRef);
            const lastPitchDocRef = pitchDataQuerySnapshot.docs[pitchDataQuerySnapshot.docs.length - 1].ref;

            // Update the existing document with the new pitch result
            await updateDoc(lastPitchDocRef, { pitch_result: testdata });

            console.log("Pitch result added successfully for player:", playerName, "Document ID:", lastPitchDocRef.id);
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
        // Add a new document to the "players" collection with playerName as its ID
        await addDoc(playersRef, { name: playerName });
        console.log("Player added successfully:", playerName);
    } catch(err) {
        console.error("Error adding player: ", err);
    }
}