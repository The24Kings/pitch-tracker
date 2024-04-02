import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonButtons,
  IonMenuButton
} from '@ionic/react';
import DataInputContainer from '../components/DataInputContainer';

const DataInput: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
        </IonHeader>
        <DataInputContainer name="Data Input page" />
      </IonContent>
    </IonPage>
  );
};

export default DataInput;
