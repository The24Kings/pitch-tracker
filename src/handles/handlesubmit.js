import { query, where, getDocs, collection, doc, setDoc, increment, addDoc, getDoc, updateDoc } from '@firebase/firestore';
import { firestore } from '../firebase_setup/firebase';

export const handleSubmit = async (playerName, typeData, resultData, touchCoordinates) => {
    try {
        // Query the "players" collection to find the document with the matching "name" property
        const playerQuery = query(collection(firestore, 'players'), where('name', '==', playerName));
        const querySnapshot = await getDocs(playerQuery);

        // If a document matching the playerName is found
        if (querySnapshot.empty) {
            console.error(`Player with name "${playerName}" not found.`);
            return;
        } 

        // Get the reference to the first document (assuming playerName is unique)
        const playerDocRef = querySnapshot.docs[0].ref;

        // Add a new document with auto-generated ID under the "pitch_data" subcollection
        const pitchDataCollectionRef = collection(playerDocRef, 'pitch_data');
        const newPitchDocRef = await addDoc(pitchDataCollectionRef, {
            pitch_type: typeData,
            pitch_result: resultData, // Initialize pitch_result to null
            touch_coordinates: touchCoordinates  // Add touch coordinates
        });

        console.log("Pitch type:",typeData,"\nPitch Result:",resultData,"\nSuccessfully added for player:",playerName,"\nDocument ID:",newPitchDocRef.id);
    } catch (err) {
        console.error('Error adding pitch type:', err);
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