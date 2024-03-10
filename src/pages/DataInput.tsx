import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import DataInputContainer from '../components/DataInputContainer';

const DataInput: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
          </IonToolbar>
        </IonHeader>
        <DataInputContainer name="Data Input page" />
      </IonContent>
    </IonPage>
  );
};

export default DataInput;
