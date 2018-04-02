import React from "react";
import {connect} from "dva";
import Spin from '../components/Spin';
import UnpaidOrder from '../components/UnpaidOrderComponent';
import UnpickUpOrder from '../components/UnpickUpOrderComponent';
import { Result } from 'antd-mobile';


const Order = ({dispatch, order:{ orders:{orders, pages, page}, loading, visible, number, device}}) => {
    
    
    let orderNodes = orders && orders.length > 0 ? orders.map((order) => {
        if (order.status == 1) {
            return (
                    <UnpaidOrder order={order} dispatch={dispatch} key={order.object_id}></UnpaidOrder>
            )
        } else if (order.status == 5) {
            return (
                <UnpickUpOrder order={order} dispatch={dispatch} key={order.object_id} visible={visible} number={number} device={device}></UnpickUpOrder>
            )
        }
    }) : '';
   

    let nextPage;
    if(pages){
        if(pages> 1 && pages - page >= 1){
            //nextPage = <div>111</div>
        }
    }
    return (
        <div>
            {
                loading == true ? <Spin /> : '' 
            }
            <div>
                {orderNodes ? orderNodes :  <Result
                    imgUrl="https://zos.alipayobjects.com/rmsportal/NRzOqylcxEstLGf.png"
                    title='暂无订单信息'
                />}
            </div>
        </div>
    )
}

export default connect(({order}) => ({order}))(Order)
