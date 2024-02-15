import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './DataInput.css';

const DataInput: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Data Input</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Data Input</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Data Input page" />
      </IonContent>
    </IonPage>
  );
};

export default DataInput;
