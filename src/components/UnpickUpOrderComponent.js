import React from "react";
import styles from './UnpickUpOrderComponent.css';
import ProductsComponent from '../components/productsComponent';
import { getCartProductsNumber, getPrice, timeString, validator} from '../utils/helper'


function UnpickUpOrder({ orders, dispatch}) {

    function onHandleOr(pick_number,device_id){

        dispatch({type: 'order/setState',currentOrder:orders})
        dispatch({type: 'order/showModal', number:pick_number, device_id: device_id})
    }
    const id = orders.object_id.substr(0, 8);
    const products = orders.items;
    return (
        <div className={styles.contentStyle}>

            <div className={styles.orderIdContainerStyle}><span
                className={styles.orderIdStyle}>{`订单号:`}{id}</span><span
                className={styles.payStatusTextStyle}>未提货</span></div>
            <div><ProductsComponent items={products} expired={validator(orders.invalid_at)}/></div>
            <div className={styles.pickTimeContainerStyle}><span
                className={styles.pickLastTimeStyle}/>
                    <span
                        className={styles.sumTextStyle}>{`共${getCartProductsNumber(products)}件商品合计:`}<span
                        className={styles.priceSignStyle}>{'¥'}</span>{`${getPrice(orders.real_price)}`}</span>
            </div>
            <div className={styles.pickContainerStyle} onClick={()=> onHandleOr(orders.pick_number,orders.device_id)}>
                <div>
                    <span className={styles.pickNumStyle}>{`提货码:`}{orders.pick_number}</span>
                    <span className={styles.pickNumStyleTime}>{'提货截止时间'}:{timeString(orders.invalid_at)}</span>
                </div>
                <span className={styles.qrShowStyle}>{'二维码'}</span>
                </div>
        </div>
    );
}
export default UnpickUpOrder;

