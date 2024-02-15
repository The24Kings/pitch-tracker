import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './DataVisual.css';

const DataVisual: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Data Visual</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Data Visual</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Data Visual page" />
      </IonContent>
    </IonPage>
  );
};

export default DataVisual;
