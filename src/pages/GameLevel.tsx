import React, { useState, useEffect } from 'react';
import styles from './GameLevel.module.css'
import Controller from '../control/Controller'
import Tile from '../components/Tile'
import { GameObject, GameModel } from '../model';
import Modal from 'react-modal';

const modalStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    border                : '5px dashed grey',
    backgroundColor                 : 'black',
    color                 : 'white'
  },
  overlay : {
    backgroundColor       : 'rgba(0, 0, 0, 0.5)'
  }
};

const GameLevel : React.FunctionComponent<{ gameChart: string }> = function GameLevel(props) {
  const [model, setModel] = useState(new GameModel(1,1)) // only temporary before real model is set from controller
  const [controller] = useState(() => new Controller(props.gameChart, setImmutableModel, gameEnd))
  const [modalOpen, setModalOpen] = useState(false)
  const [state, setState] = useState<'playing' | 'won' | 'lost'>('playing')

  function setImmutableModel(m: GameModel) {
    setModel(m)
  }

  function gameEnd(playerWon: boolean) {
    setState(playerWon ? 'won' : 'lost')
    setModalOpen(true)
  }

  function escPressed() {
    setModalOpen(!modalOpen)
  }

  useEffect(() => {
    function keyDown(e : KeyboardEvent) {
      if(modalOpen && (e.key !== 'Escape' || state !== 'playing'))
        return
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
        case 'q':
          controller.playerMove("rotate left")
          break
        case 'e':
          controller.playerMove("rotate right")
          break
        case 'Escape':
          escPressed()
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
      tiles.push(objectToJsx(tile.element))
  }))
  return (
    <div>
      <div className={styles.map}>
        {tiles}
      </div>
      <Modal isOpen={modalOpen} style={modalStyles} onRequestClose={state === 'playing' ? (() => setModalOpen(false)) : undefined}>
            {state !== 'playing' && 
              <p className={styles.endGameText}>{state === 'won' ? 'Level completed' : 'Character died'}</p>
            }
            {state === 'won' && <div className={styles.menuButton}>Next level</div>}
            <div className={styles.menuButton}>Restart</div>
            <div className={styles.menuButton}>To Menu</div>
            {state === 'playing' && <div className={`${styles.menuButton} ${styles.cancelButton}`} onClick={() => setModalOpen(false)}>Cancel</div>}
      </Modal>
    </div>
  );
}

export default GameLevel;
