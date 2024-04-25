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
        <IonHeader collapse="condense">
        </IonHeader>
        <DataInputContainer name="Data Input page" />
      </IonContent>
    </IonPage>
  );
};

export default DataInput;
