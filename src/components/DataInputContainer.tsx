import React, { useState } from 'react';
import { IonButton, IonAlert } from '@ionic/react';
import { handleSubmit } from '../handles/handlesubmit';

interface ContainerProps {
  name: string;
}

const DataInputContainer: React.FC<ContainerProps> = ({ name }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  const handleSave = async () => {
    console.log("Selected value before submission:", selectedValue); // Check selected value before submission
    await handleSubmit(selectedValue); // Wait for the submission to complete
    setSelectedValue('');
    setShowAlert(false);
  };

  return (
    <>
      <IonButton onClick={() => setShowAlert(true)}>Open Alert</IonButton>
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={'Select Data'}
        message={'Choose one option:'}
        inputs={[
          {
            name: 'option1',
            type: 'radio',
            label: 'Option 1',
            value: 'option1',
            checked: selectedValue === 'option1',
            handler: () => setSelectedValue('option1')
          },
          {
            name: 'option2',
            type: 'radio',
            label: 'Option 2',
            value: 'option2',
            checked: selectedValue === 'option2',
            handler: () => setSelectedValue('option2')
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
    </>
  );
};

export default DataInputContainer;
