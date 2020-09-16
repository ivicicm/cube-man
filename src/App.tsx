import React, { useState } from 'react';
import level from './levels/1.txt'
import GameLevel from './components/GameLevel'
import Intro from './components/Intro'
import SelectLevel from './components/LevelSelect'
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";

const App = function App() {

  let levels = [
      level,
  ]
  let [levelCount, setLevelCount] = useState(() => {
    let storageLevelCount = window.localStorage.getItem('levelCount');
    if(storageLevelCount) {
        let parsedCount = parseInt(storageLevelCount)
        if(!isNaN(parsedCount) && levels.length >= parsedCount)
            return parsedCount
    }
    return 1
  })

  function passedSetLevelCount(count: number) {
    window.localStorage.setItem('levelCount', count.toString());  
    setLevelCount(count)
  }

  return (
    <Router>
        <Switch>
          {levels.map((l,index) =>
            <Route path={"/levels/" + (index + 1)} key={index}>
                <GameLevel setLevelCount={passedSetLevelCount} level={index + 1} gameChart={l} isLast={index === levels.length - 1}/>
            </Route> 
          )}
          <Route path="/levels">
            <SelectLevel levelCount={levelCount}/>
          </Route>
          <Route path="/">
            <Intro/>
          </Route>
        </Switch>
    </Router>
  );
}

export default App;