import React, { useState } from 'react';
import level1 from './levels/1.txt'
import level1andquarter from './levels/1andquarter.txt'
import level1andhalf from './levels/1andhalf.txt'
import level2 from './levels/2.txt'
import level3 from './levels/3.txt'
import level4 from './levels/4.txt'
import d1 from './levels/d1.txt'
import d2 from './levels/d2.txt'
import d3 from './levels/d3.txt'
import d4 from './levels/d4.txt'
import d5 from './levels/d5.txt'
import d6 from './levels/d6.txt'
import d7 from './levels/d7.txt'
import GameLevel from './components/GameLevel'
import Intro from './components/Intro'
import SelectLevel from './components/LevelSelect'
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

const App = function App() {

  let levels = [
    level1,
    level1andquarter,
    level1andhalf,
    level2,
    level3,
    level4,
    d1,
    d2,
    d3,
    d4,
    d5,
    d6,
    d7
  ]
  let [levelCount, setLevelCount] = useState(() => {
    let storageLevelCount = window.localStorage.getItem('levelCount');
    if (storageLevelCount) {
      let parsedCount = parseInt(storageLevelCount)
      if (!isNaN(parsedCount) && levels.length >= parsedCount)
        return parsedCount
    }
    return 1
  })

  function passedLevel(count: number) {
    if (count + 1 > levelCount && count + 1 <= levels.length) {
      window.localStorage.setItem('levelCount', (count + 1).toString());
      setLevelCount(count + 1)
    }
  }

  return (
    <Router>
      <Switch>
        {levels.map((l, index) =>
          <Route path={"/levels/" + (index + 1)} key={index}>
            <GameLevel levelPassed={passedLevel} level={index + 1} gameChart={l} isLast={index === levels.length - 1} />
          </Route>
        )}
        <Route path="/levels">
          <SelectLevel levelCount={levelCount} />
        </Route>
        <Route path="/">
          <Intro />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;