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
  IonCardHeader,
} from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { person } from 'ionicons/icons';
import { handlePlayerSubmit } from '../handles/handlesubmit';
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import './DataVisualContainer.css';
import strikeZoneWhite from '../../public/StrikeZoneWhite.webp';
import strikeZone from '../../public/StrikeZone.png';
import { firestore } from '../firebase_setup/firebase';
import { useIonViewWillEnter } from '@ionic/react';

// Main component
const DataVisualContainer: React.FC<{ name: string }> = ({ name }) => {
  const [pitchData, setPitchData] = useState<
    { pitch_type: string; pitch_result: string; x: number; y: number; date?: string }[]
  >([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [players, setPlayers] = useState<string[]>([]);
  const [selectedPitch, setSelectedPitch] = useState<{ pitch_type: string; pitch_result: string } | null>(null);
  const [showPlayerAlert, setShowPlayerAlert] = useState(false); // Declare this first
  const [strikeZoneImage, setStrikeZoneImage] = useState<string>('');
  const [selectedPitchType, setSelectedPitchType] = useState('');
  const [pitchTypes, setPitchTypes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [dates, setDates] = useState<string[]>([]);

  // Player Alert Save Handler
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

  // Fetch players from Firestore
  const fetchPlayers = async () => {
    try {
      const playersCollection = await getDocs(collection(firestore, 'players'));
      const playerNames = playersCollection.docs.map((doc) => doc.data().name); // Ensure unique names
      setPlayers([...new Set(playerNames)]); // Ensure no duplicates
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  // Fetch pitch data from Firestore
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
      let pitchTypesSet = new Set<string>();
      let dateSet = new Set<string>();
  
      pitchDataQuerySnapshot.forEach((doc) => {
        const pitchType = doc.data().pitch_type;
        const { pitch_result, touch_coordinates, date } = doc.data();
        const { x, y } = touch_coordinates;
  
        // Format the date to only include the year, month, and day
        let formattedDate = "";
        if (typeof date === "string") {
          const parsedDate = new Date(date);
          formattedDate = parsedDate.toISOString().split("T")[0]; // Extract the date part
          dateSet.add(formattedDate); // Add to the set of unique dates
        }
  
        // Apply filters for pitch type and date
        if ((!selectedPitchType || pitchType === selectedPitchType) &&
            (!selectedDate || formattedDate === selectedDate)) {
          data.push({ pitch_type: pitchType, pitch_result, x, y, date: formattedDate });
        }
  
        // Add pitch type to the set of unique pitch types
        if (typeof pitchType === "string") {
          pitchTypesSet.add(pitchType);
        }
      });
  
      setPitchData(data);
      setPitchTypes(Array.from(pitchTypesSet));
      setDates(Array.from(dateSet)); // Populate dropdown with formatted dates
    } catch (error) {
      console.error("Error getting documents:", error);
    }
  };
  

  useEffect(() => {
    fetchPlayers(); // Fetch players when component mounts

    const intervalId = setInterval(() => {
        fetchPlayers(); // Fetch pitch data every 1 second

    }, 1000); // Set interval to 1 second

    return () => clearInterval(intervalId); // Clear interval when component unmounts or selectedPlayer changes
  }, []);

  useEffect(() => {
    if (selectedPlayer) {
      getPitchData(); // Fetch pitch data when player or filters change
    }

    const intervalId = setInterval(() => {
      if (selectedPlayer) {
        getPitchData(); // Fetch pitch data every 1 second
      }
    }, 1000); // Set interval to 1 second

    return () => clearInterval(intervalId); // Clear interval when component unmounts or selectedPlayer changes
  }, [selectedPlayer, selectedPitchType, selectedDate]); // Add selectedDate to dependencies

  useIonViewWillEnter(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setStrikeZoneImage(prefersDark ? strikeZoneWhite : strikeZone);
  });

  return (
    <IonContent className="DataVisualContainer">
      <IonCard>
        <IonToolbar>
          <IonGrid>
            <IonRow className="ion-align-items-center ion-justify-content-around">
              <IonCol size="auto">
                <IonIcon icon={person} />
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
              {/* New dropdown for date selection */}
              <IonCol size="auto">
              <IonSelect
                value={selectedDate}
                placeholder="Filter by Date"
                onIonChange={(e) => setSelectedDate(e.detail.value)}
              >
                <IonSelectOption value="">
                  All Dates
                </IonSelectOption>
                {dates.map((date) => (
                  <IonSelectOption key={date} value={date}>
                    {date}
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
                handlePlayerAlertSave(playerName, fetchPlayers);
              }
            },
          },
        ]}
      />

      <div className="strike-zone-container">
        <img src={strikeZoneImage} alt="Strike Zone" className="strike-zone-image" />
        {pitchData.map((data, index) => (
          <div
            key={index}
            className={`pitch-circle ${data.pitch_type}`}
            style={{ top: data.y - 15, left: data.x - 15 }}
            onClick={() =>
              setSelectedPitch({ pitch_type: data.pitch_type, pitch_result: data.pitch_result })
            }
          />
        ))}
        {selectedPitch && (
          <div className="pitch-result">
            <p>{`Pitch Type: ${selectedPitch.pitch_type}`}</p>
            <p>{`Pitch Result: ${selectedPitch.pitch_result}`}</p>
          </div>
        )}
      </div>

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
                  <div className="legend-color Fastball" />
                </IonThumbnail>
                <IonLabel>Fastball</IonLabel>
              </IonItem>
              <IonItem>
                <IonThumbnail slot="start">
                  <div className="legend-color Changeup" />
                </IonThumbnail>
                <IonLabel>Changeup</IonLabel>
              </IonItem>
              <IonItem>
                <IonThumbnail slot="start">
                  <div className="legend-color Cutter" />
                </IonThumbnail>
                <IonLabel>Cutter</IonLabel>
              </IonItem>
              <IonItem>
                <IonThumbnail slot="start">
                  <div className="legend-color Slider" />
                </IonThumbnail>
                <IonLabel>Slider</IonLabel>
              </IonItem>
              <IonItem>
                <IonThumbnail slot="start">
                  <div className="legend-color Curveball" />
                </IonThumbnail>
                <IonLabel>Curveball</IonLabel>
              </IonItem>
              <IonItem>
                <IonThumbnail slot="start">
                  <div className="legend-color Sinker" />
                </IonThumbnail>
                <IonLabel>Sinker</IonLabel>
              </IonItem>
              <IonItem>
                <IonThumbnail slot="start">
                  <div className="legend-color Splitter" />
                </IonThumbnail>
                <IonLabel>Splitter</IonLabel>
              </IonItem>
              <IonItem>
                <IonThumbnail slot="start">
                  <div className="legend-color Knuckleball" />
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
