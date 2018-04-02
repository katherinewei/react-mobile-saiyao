import React from "react";
import styles from './404.less';
import { history } from '../config'
import {Button} from 'antd-mobile'

const NotFound =() =>{

    return (
        <div className={styles.notFound}>

            <div className={styles.bg}></div>
            <div className={styles.content}><p><b>SORRY</b></p><p>页面报错啦！</p><p>您访问的页面已离开地球</p><Button onClick={()=>{history.back()}} inline  size="small">返回上一页</Button></div>
        </div>
    )
}
export default NotFound