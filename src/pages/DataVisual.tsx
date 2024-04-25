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
        <IonHeader collapse="condense">
        </IonHeader>
        <DataVisualContainer name="Data Visual page" />
      </IonContent>
    </IonPage>
  );
};

export default DataVisual;
