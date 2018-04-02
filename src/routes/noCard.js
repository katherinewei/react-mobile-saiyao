import React from "react";
import styles from '../index.less';
import {Icon} from 'antd-mobile'
import {getString} from '../utils/helper'
import CustomIcon from '../components/CustomIcon'
const NoCard = () =>{

    return (
        <div className={styles.noCard}>
            <p className={styles.icon}><CustomIcon   type={require('../assets/svgDirs/sad.svg')}  /></p>
            <p>{getString('noCard')}</p>
        </div>
    )
}
export default NoCard