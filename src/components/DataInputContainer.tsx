import React, { useState } from 'react';
import { IonButton, IonAlert } from '@ionic/react';
import { handleFirstSubmit } from '../handles/handlesubmit';

interface ContainerProps {
  name: string;
}

const DataInputContainer: React.FC<ContainerProps> = ({ name }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [showSecondAlert, setShowSecondAlert] = useState(false);

  const handleSave = async () => {
    console.log("Selected value before submission:", selectedValue); // Check selected value before submission
    await handleFirstSubmit(selectedValue); // Wait for the submission to complete
    setSelectedValue('');
    setShowAlert(false);
    setShowSecondAlert(true); // Show the second alert
  };

  const handleSecondAlertSave = async () => {
    console.log("Selected value from second alert:", selectedValue); // Check selected value before submission
    await handleFirstSubmit(selectedValue); // Wait for the submission to complete
    setSelectedValue('');
    setShowSecondAlert(false);
  };

  return (
    <>
      <IonButton onClick={() => setShowAlert(true)}>Open Alert</IonButton>
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
          // Add more radio buttons as needed
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
          // Add more radio buttons as needed
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
    </>
  );
};

export default DataInputContainer;
