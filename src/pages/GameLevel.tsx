import React, { useState } from 'react';
import styles from './GameLevel.module.css'
import * as Model from '../model'
import Controller from '../control/Controller'
import Tile from '../components/Tile'

function jsxFromObject(o: Model.GameObject, percentWidth: number, controller: Controller) {
  let image = typeof o.image === 'string' ? o.image : o.image(controller.model)
  return <Tile gameObject={o} percentWidth={percentWidth} image={image}/>
}

const GameLevel : React.FunctionComponent<{ gameChart: string }> = function GameLevel(props) {
  const [controller] = useState(() => new Controller(props.gameChart))
  let percentWidth = 100 / controller.model.map[0].length

  return (
    <div className={styles.map}>
      {
        controller.model.map.map(x => x.map(tile => {
          return  <React.Fragment>
            {tile.floorElement && jsxFromObject(tile.floorElement, percentWidth, controller)}
            {tile.element && jsxFromObject(tile.element, percentWidth, controller)}
          </React.Fragment>       
        }))
      }
    </div>
  );
}

export default GameLevel;
