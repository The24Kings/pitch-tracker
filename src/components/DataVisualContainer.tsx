import React, { useState, useEffect } from 'react';
import { 
  IonCard, 
  IonContent, 
  IonToolbar, 
  IonSelect, 
  IonSelectOption, 
  IonRow, 
  IonGrid, 
  IonCol, 
  IonAlert, 
  IonButton, 
  IonCardTitle, 
  IonCardSubtitle,
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonCardContent,
  IonCardHeader
} from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { person } from 'ionicons/icons';
import { handlePlayerSubmit } from '../handles/handlesubmit';
import { collection, getDocs, query, where, QuerySnapshot, DocumentData } from 'firebase/firestore';
import './DataVisualContainer.css';
import strikeZoneWhite from '../../public/StrikeZoneWhite.webp';
import strikeZone from '../../public/StrikeZone.png';
import { firestore } from '../firebase_setup/firebase';
import { useIonViewWillEnter } from '@ionic/react';

const DataVisualContainer: React.FC<{ name: string }> = ({ name }) => {
  const [pitchData, setPitchData] = useState<{ pitch_type: string; pitch_result: string; x: number; y: number }[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [players, setPlayers] = useState<string[]>([]);
  const [selectedPitch, setSelectedPitch] = useState<{ pitch_type: string; pitch_result: string } | null>(null);
  const [showPlayerAlert, setShowPlayerAlert] = useState(false);
  const [strikeZoneImage, setStrikeZoneImage] = useState('');
  const [selectedPitchType, setSelectedPitchType] = useState("");
  const [pitchTypes, setPitchTypes] = useState<string[]>([]); // Keep original list of pitch types


  const handlePlayerAlertSave = async (name, onPlayerAdded) => {
    if (!name.trim()) {
      console.error("Player name is required!");
      return;
    }
  
    await handlePlayerSubmit(name);
    setShowPlayerAlert(false);
  
    if (onPlayerAdded) {
      onPlayerAdded(); // Call the callback to refresh the player list
    }
  };

  // Function to fetch players from Firestore
  const fetchPlayers = async () => {
    try {
      const playersCollection = await getDocs(collection(firestore, 'players'));
      const playerNames = playersCollection.docs.map((doc) => doc.data().name); // Ensure unique names
      setPlayers([...new Set(playerNames)]); // Ensure no duplicates
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };
  

  // Function to get the pitch data based on selected player
  const getPitchData = async () => {
    try {
      if (!selectedPlayer) {
        console.error("Please select a player");
        return;
      }
  
      const playerCollection = collection(firestore, "players");
      const playerQuery = query(playerCollection, where("name", "==", selectedPlayer));
      const playerQuerySnapshot = await getDocs(playerQuery);
  
      if (playerQuerySnapshot.empty) {
        console.error(`No data found for player: ${selectedPlayer}`);
        return;
      }
  
      const playerDocRef = playerQuerySnapshot.docs[0].ref;
      const pitchDataCollectionRef = collection(playerDocRef, "pitch_data");
      const pitchDataQuerySnapshot = await getDocs(pitchDataCollectionRef);
  
      let data = [];
      let pitchTypesSet = new Set<string>(); // Explicitly declare a set of strings
  
      pitchDataQuerySnapshot.forEach((doc) => {
        const pitchType = doc.data().pitch_type;
        const { pitch_result, touch_coordinates } = doc.data();
        const { x, y } = touch_coordinates;
  
        // Make sure to only work with strings
        if (typeof pitchType === 'string') {
          pitchTypesSet.add(pitchType); // Add to set if it's a string
        }
  
        if (!selectedPitchType || pitchType === selectedPitchType) {
          data.push({ pitch_type: pitchType, pitch_result, x, y });
        }
      });
  
      setPitchData(data);
      setPitchTypes(Array.from(pitchTypesSet)); // Convert set to an array
    } catch (error) {
      console.error("Error getting documents:", error);
    }
  };
  
  

  useEffect(() => {
    fetchPlayers(); // Fetch players when component mounts
  }, []);

  useEffect(() => {
    if (selectedPlayer) {
      getPitchData(); // Call getPitchData when player or pitch type changes
    }
  }, [selectedPlayer, selectedPitchType]); // React to player or pitch type changes


  useIonViewWillEnter(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      setStrikeZoneImage(strikeZoneWhite); // Image for dark mode
    } else {
      setStrikeZoneImage(strikeZone); // Image for light mode
    }
  });

  return (
    <IonContent className="DataVisualContainer">
      <IonCard>
        <IonToolbar>
          <IonGrid>
            <IonRow className="ion-align-items-center ion-justify-content-around">
              <IonCol size="auto">
                <IonIcon icon={person}></IonIcon>
              </IonCol>
              <IonCol size="auto">
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
              </IonCol>
              <IonCol size="auto">
                <IonButton onClick={() => setShowPlayerAlert(true)}>+ Player</IonButton>
              </IonCol>
            </IonRow>
            <IonRow className="ion-align-items-center ion-justify-content-around">
              <IonCol size="auto">
                <IonSelect
                  value={selectedPitchType}
                  placeholder="Filter by Pitch Type"
                  onIonChange={(e) => setSelectedPitchType(e.detail.value)}
                >
                  {/* Default option for "view all pitches" */}
                  <IonSelectOption value="">
                    All Pitches
                  </IonSelectOption>
                  {pitchTypes.map((type) => (
                    <IonSelectOption key={type} value={type}>
                      {type}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonCard>

      <IonAlert
  isOpen={showPlayerAlert}
  onDidDismiss={() => setShowPlayerAlert(false)}
  header={'Add Player'}
  inputs={[
    {
      name: 'playerName',
      type: 'text',
      placeholder: 'Enter player name',
    },
  ]}
  buttons={[
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => setShowPlayerAlert(false),
    },
    {
      text: 'Save',
      handler: (data) => {
        const playerName = data.playerName?.trim();
        if (playerName) {
          handlePlayerAlertSave(playerName, fetchPlayers); // Pass fetchPlayers as the callback
        }
      },
    },
  ]}
/>

      <div className="strike-zone-container">
          <img src={strikeZoneImage} alt="Strike Zone" className="strike-zone-image" />
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

      {/* Legend container */}
      <div className="legend-container">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Pitch Type</IonCardTitle>
            <IonCardSubtitle>Legend</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            <IonList>
              <IonItem>
                <IonThumbnail slot="start">
                  <div className="legend-color Fastball"></div>
                </IonThumbnail>
                <IonLabel>FastBall</IonLabel>
              </IonItem>
              <IonItem>
                <IonThumbnail slot="start">
                  <div className="legend-color Changeup"></div>
                </IonThumbnail>
                <IonLabel>Changeup</IonLabel>
              </IonItem>
              <IonItem>
                <IonThumbnail slot="start">
                  <div className="legend-color Cutter"></div>
                </IonThumbnail>
                <IonLabel>Cutter</IonLabel>
              </IonItem>
              <IonItem>
                <IonThumbnail slot="start">
                  <div className="legend-color Slider"></div>
                </IonThumbnail>
                <IonLabel>Slider</IonLabel>
              </IonItem>
              <IonItem>
                <IonThumbnail slot="start">
                  <div className="legend-color Curveball"></div>
                </IonThumbnail>
                <IonLabel>Curveball</IonLabel>
              </IonItem>
              <IonItem>
                <IonThumbnail slot="start">
                  <div className="legend-color Sinker"></div>
                </IonThumbnail>
                <IonLabel>Sinker</IonLabel>
              </IonItem>
              <IonItem>
                <IonThumbnail slot="start">
                  <div className="legend-color Splitter"></div>
                </IonThumbnail>
                <IonLabel>Splitter</IonLabel>
              </IonItem>
              <IonItem>
                <IonThumbnail slot="start">
                  <div className="legend-color Knuckleball"></div>
                </IonThumbnail>
                <IonLabel>Knuckleball</IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>
      </div>
    </IonContent>
  );
};

export default DataVisualContainer;
