import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { baseballOutline, podiumOutline } from 'ionicons/icons';
import DataInput from './pages/DataInput';
import DataVisual from './pages/DataVisual';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/DataInput">
            <DataInput />
          </Route>
          <Route exact path="/DataVisual">
            <DataVisual />
          </Route>
          <Route exact path="/">
            <Redirect to="/DataVisual" />
          </Route>
        </IonRouterOutlet>
        
        <IonTabBar slot="bottom">
          <IonTabButton tab="DataInput" href="/DataInput">
            <IonIcon aria-hidden="true" icon={baseballOutline} />
            <IonLabel>Data Input</IonLabel>
          </IonTabButton>
          <IonTabButton tab="DataVisual" href="/DataVisual">
            <IonIcon aria-hidden="true" icon={podiumOutline} />
            <IonLabel>Data Visual</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
