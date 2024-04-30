import { 
  IonContent, 
  IonHeader, 
  IonPage
} from '@ionic/react';
import DataInputContainer from '../components/DataInputContainer';

const DataInput: React.FC = () => {
  return (
    <IonPage>
      <IonContent forceOverscroll={false}>
        <DataInputContainer/>
      </IonContent>
    </IonPage>
  );
};

export default DataInput;
