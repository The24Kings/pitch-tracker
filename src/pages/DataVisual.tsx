import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonButtons,
  IonMenuButton
} from '@ionic/react';
import DataVisualContainer from '../components/DataVisualContainer';

const DataVisual: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
        </IonHeader>
        <DataVisualContainer name="Data Visual page" />
      </IonContent>
    </IonPage>
  );
};

export default DataVisual;
