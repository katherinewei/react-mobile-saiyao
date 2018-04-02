import React from "react";
import styles from './UnpaidOrderComponent.css';
import ProductsComponent from '../components/productsComponent';
import { getCartProductsNumber, getPrice,timeString, validator } from '../utils/helper'
import {Modal} from 'antd-mobile';
const alert = Modal.alert;
function UnpaidOrder({ order, dispatch,del_cb}) {

    function onHandlePay(){
        dispatch({type: 'order/ordersPay', id:order.object_id})
    }
    function onDeleteOrder(){
        alert('删除', <p style={{padding:'0.2rem 0.4rem 0.4rem'}}>确定删除么???<br/></p>, [
            { text: '取消', onPress: () => {} },
            { text: '确定', onPress: () => {

                dispatch({type: 'order/delete', id:order.object_id,del_cb,status:order.status})
            } }
          ])
    }
    const id = order.object_id.substr(0, 8);
    const products = order.items;
    function statusString(){
        if(order.status==0||order.status==1){
            return "等待付款"
        }else if(order.status==9){
            return "已收货"
        }
    }
    return (
        <div className={styles.contentStyle}>
            <div className={styles.orderIdContainerStyle}><span
                className={styles.orderIdStyle}>{`订单号:`}{id}</span><span
                className={styles.waitPayTextStyle}>{statusString()}</span></div>
            <div><ProductsComponent items={products} expired={false} order={id}></ProductsComponent></div>
            <div className={styles.sumContainerStyle}>
                    <span
                        className={styles.sumTextStyle}>{`共${getCartProductsNumber(products)}件商品  合计: ¥${getPrice(order.real_price)} `}</span>
            </div>
            {order.status==9?<div className={styles.hr}></div>:<div className={styles.payContainerStyle}><span onClick={()=> onDeleteOrder(order.object_id)} className={styles.payTextStyleLdel}>{`删除`}</span> <span onClick={()=> onHandlePay()} className={styles.payTextStyle}>{`支付`}</span></div>}
        </div>
    );
}
export default UnpaidOrder;
