import { IonCard, IonCardSubtitle, IonContent, IonHeader, IonItem, IonList, IonPage, IonTitle, IonToolbar, IonSelect, IonSelectOption } from '@ionic/react';
import { useEffect, useState } from 'react';
import './DataVisualContainer.css';
import { collection, getDocs, QuerySnapshot, DocumentData, where, query } from 'firebase/firestore';
import { firestore } from '../firebase_setup/firebase';

interface ContainerProps {
  name: string;
}

const DataVisualContainer: React.FC<ContainerProps> = ({ name }) => {
  const [pitchData, setPitchData] = useState<{ pitch_type: string; pitch_result: string }[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [players, setPlayers] = useState<string[]>([]);

  // Function to fetch players from Firestore
  const fetchPlayers = async () => {
    try {
      const playersCollection = await getDocs(collection(firestore, 'players'));
      const playerNames = playersCollection.docs.map((doc) => doc.data().name);
      setPlayers(playerNames);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  // Function to get the pitch data based on selected player
  const getPitchData = async () => {
    try {
      if (!selectedPlayer) {
        console.error('Please select a player');
        return;
      }

      // Reference to the collection 'pitch_data' for the selected player
      const playerCollection = collection(firestore, 'players');
      const playerQuery = query(playerCollection, where('name', '==', selectedPlayer));
      const playerQuerySnapshot = await getDocs(playerQuery);

      if (playerQuerySnapshot.empty) {
        console.error(`No data found for player: ${selectedPlayer}`);
        return;
      }

      const playerDocRef = playerQuerySnapshot.docs[0].ref;
      const pitchDataCollectionRef = collection(playerDocRef, 'pitch_data');
      const pitchDataQuerySnapshot: QuerySnapshot<DocumentData> = await getDocs(pitchDataCollectionRef);

      const data: { pitch_type: string; pitch_result: string }[] = [];
      // Loop through the documents and push 'pitch_type' and 'pitch_result' fields to data array
      pitchDataQuerySnapshot.forEach((doc) => {
        const { pitch_type, pitch_result } = doc.data();
        data.push({ pitch_type, pitch_result });
      });

      setPitchData(data); // Set the state with the retrieved data
    } catch (error) {
      console.error('Error getting documents:', error);
    }
  };

  useEffect(() => {
    fetchPlayers(); // Fetch players when component mounts
  }, []);

  useEffect(() => {
    if (selectedPlayer) {
      getPitchData(); // Call getPitchData only when selectedPlayer is not empty
    }
  }, [selectedPlayer]); // Call useEffect when selectedPlayer changes

  return (
    <IonContent className="DataVisualContainer">
      <IonCard>
        <IonCardSubtitle>Pitch Data</IonCardSubtitle>
        <IonToolbar>
          <IonSelect
            value={selectedPlayer}
            placeholder="Select Player"
            onIonChange={(e) => setSelectedPlayer(e.detail.value)}
          >
            {players.map((player) => (
              <IonSelectOption key={player} value={player}>
                {player}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonToolbar>
        <IonList>
          {/* Loop through pitchData array and display pitch_type and pitch_result for each item */}
          {pitchData.map((data, index) => (
            <IonItem key={index}>
              <p>Pitch Type: {data.pitch_type}</p>
              <p>Pitch Result: {data.pitch_result}</p>
            </IonItem>
          ))}
        </IonList>
      </IonCard>
    </IonContent>
  );
};

export default DataVisualContainer;
