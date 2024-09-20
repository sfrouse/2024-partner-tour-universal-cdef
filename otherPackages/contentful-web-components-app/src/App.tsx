import React, { useMemo } from 'react';
import { locations } from '@contentful/app-sdk';
import ConfigScreen from './locations/config/ConfigScreen';
import Field from './locations/fieldEditor/Field';
import EntryEditor from './locations/other/EntryEditor';
import Dialog from './locations/other/Dialog';
import Sidebar from './locations/other/Sidebar';
import Page from './locations/other/Page';
import Home from './locations/other/Home';
import { useSDK } from '@contentful/react-apps-toolkit';
import Default from './locations/other/Default';
import './tokens/output/css/variables.css';

const ComponentLocationSettings = {
  [locations.LOCATION_APP_CONFIG]: ConfigScreen,
  [locations.LOCATION_ENTRY_FIELD]: Field,
  [locations.LOCATION_ENTRY_EDITOR]: EntryEditor,
  [locations.LOCATION_DIALOG]: Dialog,
  [locations.LOCATION_ENTRY_SIDEBAR]: Sidebar,
  [locations.LOCATION_PAGE]: Page,
  [locations.LOCATION_HOME]: Home,
};


const App = () => {
  const sdk = useSDK();
  const Component = useMemo((): any => {
    for (const [location, component] of Object.entries(ComponentLocationSettings)) {
      if (sdk.location.is(location)) {
        return component;
      }
    }
  }, [sdk.location]);

  return Component ? <Component /> : <Default />;
};

export default App;
