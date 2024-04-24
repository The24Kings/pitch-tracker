import React, { useState, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { person } from 'ionicons/icons';
import { 
  IonButton, 
  IonAlert, 
  IonContent, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonSelect, 
  IonSelectOption, 
  IonCard, 
  IonToolbar 
} from '@ionic/react';
import { handleSubmit, handlePlayerSubmit } from '../handles/handlesubmit';
import { firestore } from '../firebase_setup/firebase';
import { collection, getDocs } from '@firebase/firestore';
import { useIonViewWillEnter } from '@ionic/react';
import strikeZoneWhite from '../../public/StrikeZoneWhite.webp';
import strikeZone from '../../public/StrikeZone.png';
import { Timestamp } from '@firebase/firestore'; // For Firestore Timestamp


interface ContainerProps {
  name: string;
}

const DataInputContainer: React.FC<ContainerProps> = ({ name }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedResult, setSelectedResult] = useState('');
  const [showSecondAlert, setShowSecondAlert] = useState(false);
  const [showPlayerAlert, setShowPlayerAlert] = useState(false);
  const [players, setPlayers] = useState<{ id: string, name: string }[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [touchCoordinates, setTouchCoordinates] = useState({ x: 0, y: 0 });
  const [strikeZoneImage, setStrikeZoneImage] = useState('');

  const fetchPlayers = async () => {
    try {
      const playersCollection = await getDocs(collection(firestore, 'players'));
      const playerData = playersCollection.docs.map((doc) => ({
        id: doc.id, // Use document ID as unique key
        name: doc.data().name,
      }));
      setPlayers(playerData); // Set state with player data
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  useEffect(() => {
    fetchPlayers(); // Fetch players when component mounts
  }, []);


  const handleSave = async () => {
    console.log("Selected player before submission:", selectedPlayer);
    //await handleFirstSubmit(selectedPlayer, selectedType, touchCoordinates); // Pitch Type
    //setSelectedType('');
    setShowAlert(false);
    setShowSecondAlert(true);
  };

  const handleSecondAlertSave = async () => {
    const currentDate = new Date(); // Get current date
    const formattedDate = currentDate.toISOString(); // You can use other formats if needed
  
    // Call the `handleSubmit` function with the new date parameter
    await handleSubmit(
      selectedPlayer,
      selectedType,
      selectedResult,
      touchCoordinates,
      formattedDate // Pass the date to the function
    );
  
    setSelectedType('');
    setSelectedResult('');
    setShowSecondAlert(false);
  };

  const handlePlayerAlertSave = async (name: string) => {
    if (!name.trim()) {
      console.error("Player name is required!");
      return;
    }

    await handlePlayerSubmit(name); // Add the new player
    setShowPlayerAlert(false); // Close the alert

    fetchPlayers(); // Refresh the list of players
  };

  const handleRegionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setShowAlert(true);
    const { offsetX, offsetY } = event.nativeEvent;
    const adjustedX = offsetX - 5;
    setTouchCoordinates({ x: adjustedX, y: offsetY });
  };

  useIonViewWillEnter(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      setStrikeZoneImage(strikeZoneWhite); // Image for dark mode
    } else {
      setStrikeZoneImage(strikeZone); // Image for light mode
    }
  });
  
  //FIXME: The IonSelectOption for player name input is not centered
  return (
    <IonContent>
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
                  <IonSelectOption key={player.id} value={player.name}>
                    {player.name}
                  </IonSelectOption>
                ))}
              </IonSelect>
              </IonCol>
              <IonCol size="auto">
                <IonButton onClick={() => setShowPlayerAlert(true)}>+ Player</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonCard>

      <div className="strike-zone-container" onClick={selectedPlayer ? handleRegionClick : undefined}>
        <img src={strikeZoneImage} alt="Strike Zone" className="strike-zone-image" />
      </div>
      
      <IonAlert
        isOpen={showPlayerAlert}
        onDidDismiss={() => setShowPlayerAlert(false)}
        header={'Add Player'}
        inputs={[
          {
            name: 'playerName',
            type: 'text',
            placeholder: 'Enter player name'
          },
        ]}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              setShowPlayerAlert(false);
            },
          },
          {
            text: 'Save',
            handler: data => {
              console.log("Player name input:", data.playerName);
              handlePlayerAlertSave(data.playerName);
            }
          },
        ]}
      />

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={'Pitch Type'}
        message={'Select a pitch type:'}
        inputs={[
          {
            name: 'Fastball',
            type: 'radio',
            label: 'Fastball',
            value: 'Fastball',
            checked: selectedType === 'Fastball',
            handler: () => setSelectedType('Fastball')
          },
          {
            name: 'Curveball',
            type: 'radio',
            label: 'Curveball',
            value: 'Curveball',
            checked: selectedType === 'Curveball',
            handler: () => setSelectedType('Curveball')
          },
          {
            name: 'Slider',
            type: 'radio',
            label: 'Slider',
            value: 'Slider',
            checked: selectedType === 'Slider',
            handler: () => setSelectedType('Slider')
          },
          {
            name: 'Changeup',
            type: 'radio',
            label: 'Changeup',
            value: 'Changeup',
            checked: selectedType === 'Changeup',
            handler: () => setSelectedType('Changeup')
          },
          {
            name: 'Sinker',
            type: 'radio',
            label: 'Sinker',
            value: 'Sinker',
            checked: selectedType === 'Sinker',
            handler: () => setSelectedType('Sinker')
          },
          {
            name: 'Cutter',
            type: 'radio',
            label: 'Cutter',
            value: 'Cutter',
            checked: selectedType === 'Cutter',
            handler: () => setSelectedType('Cutter')
          },
          {
            name: 'Splitter',
            type: 'radio',
            label: 'Splitter',
            value: 'Splitter',
            checked: selectedType === 'Splitter',
            handler: () => setSelectedType('Splitter')
          },
          {
            name: 'Knuckleball',
            type: 'radio',
            label: 'Knuckleball',
            value: 'Knuckleball',
            checked: selectedType === 'Knuckleball',
            handler: () => setSelectedType('Knuckleball')
          },
          // Add other radio buttons here
        ]}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              setShowAlert(false);
            },
          },
          {
            text: 'Save',
            handler: () => {
              handleSave();
            },
          },
        ]}
      />

      <IonAlert
        isOpen={showSecondAlert}
        onDidDismiss={() => setShowSecondAlert(false)}
        header={'Pitch Result'}
        message={'Select the result of the pitch:'}
        inputs={[
          {
            name: 'Called Strike',
            type: 'radio',
            label: 'Called Strike',
            value: 'Called Striked',
            checked: selectedResult === 'Called Strike',
            handler: () => setSelectedResult('Called Strike')
          },
          {
            name: 'Swinging Strike',
            type: 'radio',
            label: 'Swinging Strike',
            value: 'Swinging Strike',
            checked: selectedResult === 'Swinging Strike',
            handler: () => setSelectedResult('Swinging Strike')
          },
          {
            name: 'Ball',
            type: 'radio',
            label: 'Ball',
            value: 'Ball',
            checked: selectedResult === 'Ball',
            handler: () => setSelectedResult('Ball')
          },
          {
            name: 'Hit By Pitch',
            type: 'radio',
            label: 'Hit By Pitch',
            value: 'Hit By Pitch',
            checked: selectedResult === 'Hit By Pitch',
            handler: () => setSelectedResult('Hit By Pitch')
          },
          {
            name: 'Ball In Play',
            type: 'radio',
            label: 'Ball In Play',
            value: 'Ball In Play',
            checked: selectedResult === 'Ball In Play',
            handler: () => setSelectedResult('Ball In Play')
          },
          // Add other radio buttons here
        ]}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              setShowAlert(false);
            },
          },
          {
            text: 'Save',
            handler: () => {
              handleSecondAlertSave();
            },
          },
        ]}
      />
    </IonContent>
  );
};

export default DataInputContainer;
