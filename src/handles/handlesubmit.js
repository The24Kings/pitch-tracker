import { query, where, getDocs, collection, doc, setDoc, increment, addDoc, getDoc } from '@firebase/firestore';
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

            // Check if a document exists for the player in the "pitch_data" subcollection
            const pitchDataCollectionRef = collection(playerDocRef, 'pitch_data');
            const pitchDataQuerySnapshot = await getDocs(pitchDataCollectionRef);

            if (!pitchDataQuerySnapshot.empty) {
                // Get the reference to the existing auto-incremented document
                const pitchDataDocRef = pitchDataQuerySnapshot.docs[0].ref;

                // Update the existing document with the new pitch type
                await setDoc(pitchDataDocRef, { pitch_type: testdata }, { merge: true });
            } else {
                // Create a new auto-incremented document under the "pitch_data" subcollection
                await addDoc(pitchDataCollectionRef, { pitch_type: testdata });
            }

            console.log("Pitch type added successfully for player:", playerName);
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

            // Check if a document exists for the player in the "pitch_data" subcollection
            const pitchDataCollectionRef = collection(playerDocRef, 'pitch_data');
            const pitchDataQuerySnapshot = await getDocs(pitchDataCollectionRef);

            if (!pitchDataQuerySnapshot.empty) {
                // Get the reference to the existing auto-incremented document
                const pitchDataDocRef = pitchDataQuerySnapshot.docs[0].ref;

                // Update the existing document with the new pitch result
                await setDoc(pitchDataDocRef, { pitch_result: testdata }, { merge: true });
            } else {
                // Create a new auto-incremented document under the "pitch_data" subcollection
                await addDoc(pitchDataCollectionRef, { pitch_result: testdata });
            }

            console.log("Pitch result added successfully for player:", playerName);
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