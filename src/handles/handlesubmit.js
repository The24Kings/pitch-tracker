import { query, where, getDocs, collection, doc, setDoc, increment, addDoc, getDoc, updateDoc } from '@firebase/firestore';
import { firestore } from '../firebase_setup/firebase';

export const handleFirstSubmit = async (playerName, testdata, touchCoordinates) => {
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
                pitch_result: null, // Initialize pitch_result to null
                touch_coordinates: touchCoordinates  // Add touch coordinates
            });

            console.log("Pitch type added successfully for player:", playerName, "Document ID:", newPitchDocRef.id);
        } else {
            console.error(`Player with name "${playerName}" not found.`);
        }
    } catch (err) {
        console.error('Error adding pitch type:', err);
    }
}

export const handleSecondSubmit = async (playerName, testdata, touchCoordinates) => {
    try {
        // Check if testdata is null
        if (testdata === null) {
            console.log("Skipping update operation because testdata is null.");
            return; // Skip the update operation if testdata is null
        }

        console.log("Submitting pitch result:", testdata);

        const playerQuery = query(collection(firestore, 'players'), where('name', '==', playerName));
        const querySnapshot = await getDocs(playerQuery);

        if (!querySnapshot.empty) {
            const playerDocRef = querySnapshot.docs[0].ref;
            const pitchDataCollectionRef = collection(playerDocRef, 'pitch_data');
            const pitchDataQuerySnapshot = await getDocs(pitchDataCollectionRef);

            if (!pitchDataQuerySnapshot.empty) {
                const lastPitchDocRef = pitchDataQuerySnapshot.docs[pitchDataQuerySnapshot.docs.length - 1].ref;
                await updateDoc(lastPitchDocRef, {
                    pitch_result: testdata,
                    touch_coordinates: touchCoordinates
                });

                console.log("Pitch result added successfully for player:", playerName, "Document ID:", lastPitchDocRef.id);
            } else {
                console.error(`No pitch data found for player "${playerName}".`);
            }
        } else {
            console.error(`Player with name "${playerName}" not found.`);
        }
    } catch (err) {
        console.error('Error adding pitch result:', err);
    }
};


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