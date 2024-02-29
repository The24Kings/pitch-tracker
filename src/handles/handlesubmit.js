import { addDoc, collection } from "@firebase/firestore"
import { firestore } from "../firebase_setup/firebase"
 
export const handleSubmit = async (testdata) => {
    const ref = collection(firestore, "test_data");

    let data = {
        testData: testdata
    };
    
    try {
        await addDoc(ref, data); // Wait for the document to be added
    } catch(err) {
        console.log(err);
    }
}
