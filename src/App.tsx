import React from 'react';
import level from './levels/1.txt'
import GameLevel from './components/GameLevel'
import Intro from './components/Intro'
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";

const App = function App() {

  let levels = [
      level,
      "other level"
  ]

  return (
    <Router>
        <Switch>
          {levels.map((l,index) =>
            <Route path={"/levels/" + (index + 1)} key={index}>
                <GameLevel gameChart={l} isLast={index === levels.length - 1}/>
            </Route> 
          )}
          <Route path="/levels">
            levels
          </Route>
          <Route path="/">
            <Intro/>
          </Route>
        </Switch>
    </Router>
  );
}

export default App;