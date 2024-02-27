import { IonCard, IonCardSubtitle, IonContent, IonHeader, IonItem, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import './DataVisualContainer.css';
import { collection, getDocs, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { firestore } from '../firebase_setup/firebase';

interface ContainerProps {
  name: string;
}

const DataVisualContainer: React.FC<ContainerProps> = ({ name }) => {
  const [testData, setTestData] = useState<string[]>([]);

  // Function to get the test data
  const getTestData = async () => {
    try {
      // Reference to the collection 'test_data'
      const testCollection = collection(firestore, 'test_data');

      // Get all documents in the collection
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(testCollection);

      const data: string[] = [];
      // Loop through the documents and push 'testData' field to data array
      querySnapshot.forEach((doc) => {
        const testDataValue = doc.data().testData;
        data.push(testDataValue);
      });

      setTestData(data); // Set the state with the retrieved data
    } catch (error) {
      console.error('Error getting documents:', error);
    }
  };

  useEffect(() => {
    getTestData(); // Call getTestData when component mounts
  }, []); // Empty dependency array to ensure it only runs once when component mounts

  return (
    <IonContent className="DataVisualContainer">
      <IonCard>
      <IonCardSubtitle>Data Visual Container</IonCardSubtitle>
      <IonList>
        {/* Loop through testData array and display each item */}
        {testData.map((data, index) => (
          <IonItem key={index}>Test Data: {data}</IonItem>
        ))}
      </IonList>
      </IonCard>
    </IonContent>
  );
};

export default DataVisualContainer;