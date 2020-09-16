import React from 'react';
import * as Model from '../model'
import styles from './Instructions.module.css'

const GameLevel : React.FunctionComponent<{ corners: Model.Coords[], percentWidth: number }> = function GameLevel({ corners, percentWidth }) {

  let style = {
      position: 'absolute' as 'absolute',
      width: percentWidth * (corners[1].x - corners[0].x + 1) + '%',
      height: percentWidth * (corners[1].y - corners[0].y + 1) + '%',
      left: corners[0].x * percentWidth + '%',
      top: corners[0].y  * percentWidth + '%',
  }

  return (
    <div className={styles.container} style={style}>
      <div className={styles.instructions}>
        Move:          W S A D<br/>
        Rotate:        Q E<br/>
        In-Game Menu:  Esc
      </div>
    </div>
  );
}

export default GameLevel;