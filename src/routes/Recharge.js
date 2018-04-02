import React from "react";
import { Flex,Button} from 'antd-mobile';
import styles from './recharge.less';
import {connect} from "dva";
import { history } from '../config'
import {getPrice,getString} from '../utils/helper'
import Spin from '../components/Spin'
const Recharge =({dispatch,recharge:{checkValue,card,settings,loading}}) =>{

    function onChange(value) {
        dispatch({type:'recharge/setQuest',checkValue:value})
    }
    function recharge() {
        if(checkValue == 0){
            return
        }
        dispatch({type:'recharge/recharge',price:checkValue})
    }
    return (
        <div>
            {
                loading ? <Spin /> : ''
            }
            <div className={styles.recharge}>
                <p className={styles.shop}>{getString('title')}<span>{getString('recharge_cno')}：</span></p>
                <p className={styles.name}>{card.cno}</p>
                <p className={styles.balance}>{getString('recharge_balance')}：<span>￥{getPrice(card.balance)}</span></p>
                <p className={styles.limit}>{getString('recharge_limit')}</p>
                <Flex className={styles.flex} wrap="wrap">
                    {settings && settings.map((i,j) => (
                        <div key={`item${j}`} className={`${styles.item} ${checkValue == i.price ? styles.active :''}`} onClick={()=>onChange(i.price)}> <p>{(i.faceValue / 100)}{getString('recharge_unit')}</p><span>{getString('recharge_sale')}：{getPrice(i.price)}</span></div>
                    ))}
                </Flex>
            </div>
            <div  className={styles.rechargeBtn}><Button  style={{backgroundColor:checkValue == 0 ? '#d8d8d8' : '#63b900'}} type="primary" size="large" onClick={() => recharge()}>{getString('recharge_btnTxt')}</Button></div>
        </div>
    )
}
export default connect(({recharge}) => ({recharge}))(Recharge)