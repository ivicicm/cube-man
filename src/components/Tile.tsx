import React from 'react';
import * as Model from '../model'
import { GameModel } from '../model'

const GameLevel : React.FunctionComponent<{ gameObject: Model.GameObject, percentWidth: number, model: GameModel }> = function GameLevel({ gameObject, percentWidth, model}) {

  let image = typeof gameObject.image === 'string' ? gameObject.image : gameObject.image(model)

  let style = {
      position: 'absolute' as 'absolute',
      width: percentWidth + '%',
      height: percentWidth + '%',
      left: (gameObject.x as number) * percentWidth + '%',
      top: (gameObject.y as number) * percentWidth + '%',
      backgroundImage: `url(${image})`,
      transform: `rotate(${(gameObject.orientation - 1)*90}deg)`
  }

  return (
    <div style={style}>
      
    </div>
  );
}

export default GameLevel;
