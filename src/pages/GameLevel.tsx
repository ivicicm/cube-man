import React, { useState, useEffect } from 'react';
import styles from './GameLevel.module.css'
import Controller from '../control/Controller'
import Tile from '../components/Tile'
import { GameObject, GameModel } from '../model';

const GameLevel : React.FunctionComponent<{ gameChart: string }> = function GameLevel(props) {
  const [model, setModel] = useState(new GameModel(1,1)) // only temporary before real model is set from controller
  const [controller] = useState(() => new Controller(props.gameChart, setImmutableModel))

  function setImmutableModel(m: GameModel) {
    console.log(m)
    setModel(m)
  }

  useEffect(() => {
    function keyDown(e : KeyboardEvent) {
      switch(e.key) {
        case 'w':
          controller.playerMove(0)
          break
        case 'd':
          controller.playerMove(1)
          break
        case 's':
          controller.playerMove(2)
          break
        case 'a':
          controller.playerMove(3)
          break
      }
    }
    document.addEventListener("keydown", keyDown)
    return () => document.removeEventListener("keydown", keyDown)
  })


  let percentWidth = 100 / model.map[0].length
  let tiles: JSX.Element[] = []
  model.map.forEach(x => x.forEach(tile => {
    function objectToJsx(o: GameObject, isFloor = false) {
      let key = `${o.x} ${o.y}${isFloor && ' f'}`
      return <Tile gameObject={o} percentWidth={percentWidth} model={model} 
        key={key}
      />
    }
    if(tile.floorElement)
      tiles.push(objectToJsx(tile.floorElement, true))
    if(tile.element)
      tiles.push(objectToJsx(tile.element, true))
  }))
  return (
    <div className={styles.map}>
      {tiles}
    </div>
  );
}

export default GameLevel;
