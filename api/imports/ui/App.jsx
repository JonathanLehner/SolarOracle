import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withTracker } from 'meteor/react-meteor-data';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import NavBar from './NavBar.jsx';
import RouterSwitch from './RouterSwitch.jsx';

import './app.css';

import i18n from 'meteor/universe:i18n';
const T = i18n.createComponent();

const App = (props) => (
  <div>
    <Router {...props}>
      <NavBar />
      <RouterSwitch />
      <div>
        test with
        <div style={{fontSize: "10px"}}>
          <div>curl "https://oracle.peer2panel.com/solar_info?server_id=3"</div>
          <div>curl -X POST https://oracle.peer2panel.com/update -H 'Content-Type: application/json' -d '&#123;"server_id": 3,"secret": 8, "production": 500&#125;'</div>
        </div>
      </div>
    </Router>
  </div>
);

const MeteorApp = withTracker(({ }) => {
  const user = Meteor.user();
  return {
    user,
  };
})(App);

export default MeteorApp;
