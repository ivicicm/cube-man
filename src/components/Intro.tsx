import React, { useEffect } from 'react';
import styles from './Intro.module.css'
import cubeMan from '../assets/cubeman.png'
import { useHistory } from 'react-router-dom';

const Intro = function Intro() {

    const history = useHistory()

    function goToLevelSelect() {
        history.push('/levels')
    }

    useEffect(() => {
        const timer = setTimeout(goToLevelSelect, 5000);
        return () => clearTimeout(timer);
    });

    useEffect(() => {
        function keyDown(e : KeyboardEvent) {
            if(e.key === 'Escape' || e.key === 'Enter')
                goToLevelSelect()
        }
        document.addEventListener("keydown", keyDown)
        return () => document.removeEventListener("keydown", keyDown)
      })

    return (
        <div className={styles.container}>
            <h1 className={styles.name}>Cube Man</h1>
            <img src={cubeMan} alt="cube man" className="logoimage"/>
        </div>
    );
}

export default Intro;