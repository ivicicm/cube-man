import React, { useState } from 'react';
import styles from './GameLevel.module.css'
import Controller from '../control/Controller'
import Tile from '../components/Tile'
import { GameObject } from '../model';

const GameLevel : React.FunctionComponent<{ gameChart: string }> = function GameLevel(props) {
  const [controller] = useState(() => new Controller(props.gameChart))

  let percentWidth = 100 / controller.model.map[0].length
  let tiles: JSX.Element[] = []
  controller.model.map.forEach(x => x.forEach(tile => {
    function objectToJsx(o: GameObject, isFloor = false) {
      let key = `${o.x} ${o.y}${isFloor && ' f'}`
      return <Tile gameObject={o} percentWidth={percentWidth} model={controller.model} 
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
