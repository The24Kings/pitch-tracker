import React, { useState, useEffect } from 'react';
import { IonButton, IonAlert, IonContent, IonGrid, IonRow, IonCol, IonSelect, IonSelectOption } from '@ionic/react';
import { handleFirstSubmit } from '../handles/handlesubmit';
import { handleSecondSubmit } from '../handles/handlesubmit';
import { handlePlayerSubmit } from '../handles/handlesubmit';
import { firestore } from '../firebase_setup/firebase';
import { collection, getDocs } from '@firebase/firestore'; // Import Firestore functions

interface ContainerProps {
  name: string;
}

const DataInputContainer: React.FC<ContainerProps> = ({ name }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [showSecondAlert, setShowSecondAlert] = useState(false);
  const [showPlayerAlert, setShowPlayerAlert] = useState(false);
  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    // Fetch players from Firestore when the component mounts
    const fetchPlayers = async () => {
      const playersCollection = await getDocs(collection(firestore, 'players'));
      const playerNames = playersCollection.docs.map((doc) => doc.data().name);
      setPlayers(playerNames);
    };

    fetchPlayers();
  }, []);

  const handleSave = async () => {
    console.log("Selected value before submission:", selectedValue);
    await handleFirstSubmit(selectedValue);
    setSelectedValue('');
    setShowAlert(false);
    setShowSecondAlert(true);
  };

  const handleSecondAlertSave = async () => {
    console.log("Selected value from second alert:", selectedValue);
    await handleSecondSubmit(selectedValue);
    setSelectedValue('');
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

  return (
    <IonContent>
      <IonGrid>
        {/* Player Dropdown and +Player button */}
        <IonRow className="ion-align-items-center ion-justify-content-between">
          <IonCol size="auto">
            <IonSelect
              value={selectedValue}
              placeholder="Select Player"
              onIonChange={(e) => setSelectedValue(e.detail.value)}
            >
              {players.map((player) => (
                <IonSelectOption key={player} value={player}>
                  {player}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonCol>
          <IonCol size="auto">
            <IonButton onClick={() => setShowPlayerAlert(true)}>+Player</IonButton>
          </IonCol>
        </IonRow>
        {/* Open Alert button */}
        <IonRow className="ion-align-items-center ion-justify-content-center">
          <IonCol size="12" className="ion-text-center">
            <IonButton onClick={() => setShowAlert(true)}>Open Alert</IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>

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
              checked: selectedValue === 'Fastball',
              handler: () => setSelectedValue('Fastball')
            },
            {
              name: 'Curveball',
              type: 'radio',
              label: 'Curveball',
              value: 'Curveball',
              checked: selectedValue === 'Curveball',
              handler: () => setSelectedValue('Curveball')
            },
            {
              name: 'Slider',
              type: 'radio',
              label: 'Slider',
              value: 'Slider',
              checked: selectedValue === 'Slider',
              handler: () => setSelectedValue('Slider')
            },
            {
              name: 'Changeup',
              type: 'radio',
              label: 'Changeup',
              value: 'Changeup',
              checked: selectedValue === 'Changeup',
              handler: () => setSelectedValue('Changeup')
            },
            {
              name: 'Sinker',
              type: 'radio',
              label: 'Sinker',
              value: 'Sinker',
              checked: selectedValue === 'Sinker',
              handler: () => setSelectedValue('Sinker')
            },
            {
              name: 'Cutter',
              type: 'radio',
              label: 'Cutter',
              value: 'Cutter',
              checked: selectedValue === 'Cutter',
              handler: () => setSelectedValue('Cutter')
            },
            {
              name: 'Splitter',
              type: 'radio',
              label: 'Splitter',
              value: 'Splitter',
              checked: selectedValue === 'Splitter',
              handler: () => setSelectedValue('Splitter')
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
              checked: selectedValue === 'Called Strike',
              handler: () => setSelectedValue('Called Strike')
            },
            {
              name: 'Swinging Strike',
              type: 'radio',
              label: 'Swinging Strike',
              value: 'Swinging Strike',
              checked: selectedValue === 'Swinging Strike',
              handler: () => setSelectedValue('Swinging Strike')
            },
            {
              name: 'Ball',
              type: 'radio',
              label: 'Ball',
              value: 'Ball',
              checked: selectedValue === 'Ball',
              handler: () => setSelectedValue('Ball')
            },
            {
              name: 'Hit By Pitch',
              type: 'radio',
              label: 'Hit By Pitch',
              value: 'Hit By Pitch',
              checked: selectedValue === 'Hit By Pitch',
              handler: () => setSelectedValue('Hit By Pitch')
            },
            {
              name: 'Ball In Play',
              type: 'radio',
              label: 'Ball In Play',
              value: 'Ball In Play',
              checked: selectedValue === 'Ball In Play',
              handler: () => setSelectedValue('Ball In Play')
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
