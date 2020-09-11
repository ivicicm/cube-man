import React from 'react';
import styles from './GameLevel.module.css'

const GameLevel : React.FunctionComponent<{ gameChart: string }> = function GameLevel(props) {
  console.log(props.gameChart)
  return (
    <div className={styles.map}>
      
    </div>
  );
}

export default GameLevel;
