import React, { useState, useEffect } from 'react';
import { IonCard, IonCardSubtitle, IonContent, IonToolbar, IonSelect, IonSelectOption } from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { person } from 'ionicons/icons';
import { collection, getDocs, query, where, QuerySnapshot, DocumentData } from 'firebase/firestore'; // Added Firestore imports
import './DataVisualContainer.css';
import strikeZoneWhite from '../../public/StrikeZoneWhite.webp';
import { firestore } from '../firebase_setup/firebase'; // Import firestore from your Firebase setup file

const DataVisualContainer: React.FC<{ name: string }> = ({ name }) => {
  const [pitchData, setPitchData] = useState<{ pitch_type: string; pitch_result: string; x: number; y: number }[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [players, setPlayers] = useState<string[]>([]);
  const [selectedPitch, setSelectedPitch] = useState<{ pitch_type: string; pitch_result: string } | null>(null);

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
  
      const data: { pitch_type: string; pitch_result: string; x: number; y: number }[] = [];
      pitchDataQuerySnapshot.forEach((doc) => {
        const { pitch_type, pitch_result, touch_coordinates } = doc.data();
        const { x, y } = touch_coordinates; // Access x and y coordinates from touch_coordinates field
        console.log(`Pitch Type: ${pitch_type}, Pitch Result: ${pitch_result}, X: ${x}, Y: ${y}`);
        data.push({ pitch_type, pitch_result, x, y });
      });
  
      setPitchData(data);
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
          <IonIcon icon={person}></IonIcon>
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
        <div className="strike-zone-container">
          <img src={strikeZoneWhite} alt="Strike Zone" className="strike-zone-image" />
          {/* Map over pitchData array and render circles for each pitch */}
          {pitchData.map((data, index) => (
            <div 
              key={index} 
              className={`pitch-circle ${data.pitch_type}`} 
              style={{ top: data.y - 15, left: data.x - 15 }}
              onClick={() => setSelectedPitch({ pitch_type: data.pitch_type, pitch_result: data.pitch_result })}
            />
          ))}
          {/* Display pitch result */}
          {selectedPitch && (
            <div className="pitch-result">
              <p>{`Pitch Type: ${selectedPitch.pitch_type}`}</p>
              <p>{`Pitch Result: ${selectedPitch.pitch_result}`}</p>
            </div>
          )}
        </div>
      </IonCard>
    </IonContent>
  );
};

export default DataVisualContainer;