
  import React from 'react';
  import {
      BrowserRouter as Router,
      Switch,
      Route,
      Link,
      Redirect
    } from "react-router-dom";

  function RouteSwitch(props) {
      return (
          <Switch>
              <Route path="/login">
                  Please log in
              </Route>
              <Route exact path="/">
                <Redirect to="/home" />
              </Route>
          </Switch>
      )
    }
  
  export default RouteSwitch;
  