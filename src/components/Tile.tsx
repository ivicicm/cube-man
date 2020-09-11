import React, { useState } from 'react';
import * as Model from '../model'

const GameLevel : React.FunctionComponent<{ gameObject: Model.GameObject, percentWidth: number, image: Model.SVG }> = function GameLevel({ gameObject, percentWidth, image}) {

  let style = {
      position: 'absolute' as 'absolute',
      width: percentWidth + '%',
      height: percentWidth + '%',
      left: (gameObject.x as number) * percentWidth + '%',
      top: (gameObject.y as number) * percentWidth + '%',
      backgroundImage: image
  }

  return (
    <div style={style}>
      
    </div>
  );
}

export default GameLevel;
