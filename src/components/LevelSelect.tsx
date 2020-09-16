import React from 'react';
import styles from './LevelSelect.module.css'
import { Link } from "react-router-dom";

const LevelSelect :  React.FunctionComponent<{ levelCount: number }> = function LevelSelect({ levelCount }) {

    let levels: JSX.Element[] = []
    for(let i = 1; i <= levelCount; i++) {
        levels.push(
            <Link className={styles.level} to={"/levels/" + i} key={i}>{i}</Link>
        )
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.selectLevel}>Select level</h1>
            <div className={styles.levelContainer} >
                {levels}
            </div>
        </div>
    );
}

export default LevelSelect;