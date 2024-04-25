import { 
  IonContent, 
  IonHeader, 
  IonPage
} from '@ionic/react';
import DataVisualContainer from '../components/DataVisualContainer';

const DataVisual: React.FC = () => {
  return (
    <IonPage>
      <IonContent forceOverscroll={false}>
        <DataVisualContainer/>
      </IonContent>
    </IonPage>
  );
};

export default DataVisual;
