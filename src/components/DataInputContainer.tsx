import React, { useState, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { person } from 'ionicons/icons';
import { IonButton, IonAlert, IonContent, IonGrid, IonRow, IonCol, IonSelect, IonSelectOption, IonCard, IonToolbar } from '@ionic/react';
import { handleSubmit, handlePlayerSubmit } from '../handles/handlesubmit';
import { firestore } from '../firebase_setup/firebase';
import { collection, getDocs } from '@firebase/firestore';
import strikeZoneWhite from '../../public/StrikeZoneWhite.webp';

interface ContainerProps {
  name: string;
}

const DataInputContainer: React.FC<ContainerProps> = ({ name }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedResult, setSelectedResult] = useState('');
  const [showSecondAlert, setShowSecondAlert] = useState(false);
  const [showPlayerAlert, setShowPlayerAlert] = useState(false);
  const [players, setPlayers] = useState<string[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [touchCoordinates, setTouchCoordinates] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchPlayers = async () => {
      const playersCollection = await getDocs(collection(firestore, 'players'));
      const playerNames = playersCollection.docs.map((doc) => doc.data().name);
      setPlayers(playerNames);
    };

    fetchPlayers();
  }, []);

  const handleSave = async () => {
    console.log("Selected player before submission:", selectedPlayer);
    //await handleFirstSubmit(selectedPlayer, selectedType, touchCoordinates); // Pitch Type
    //setSelectedType('');
    setShowAlert(false);
    setShowSecondAlert(true);
  };

  const handleSecondAlertSave = async () => {
    console.log("Selected player from second alert:", selectedPlayer);
    await handleSubmit(selectedPlayer, selectedType, selectedResult, touchCoordinates); // Pitch Type and Result
    setSelectedType('');
    setSelectedResult('');
    setShowSecondAlert(false);
  };

  const handlePlayerAlertSave = async (name: string) => {
    console.log("Player name:", name);

    if (!name.trim()) {
      console.error("Player name is required!");
      return;
    }

    await handlePlayerSubmit(name);
    setShowPlayerAlert(false);
  };

  const handleRegionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setShowAlert(true);
    const { offsetX, offsetY } = event.nativeEvent;
    const adjustedX = offsetX - 5;
    setTouchCoordinates({ x: adjustedX, y: offsetY });
  };
  
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
          </IonGrid>
        </IonToolbar>
      </IonCard>

      <div className="strike-zone-container" onClick={handleRegionClick}>
        <img src={strikeZoneWhite} alt="Strike Zone" className="strike-zone-image" />
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
