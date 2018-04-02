import React from "react";
import {connect} from "dva";
import {Tabs, WhiteSpace} from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';
import Orders from './Orders';

const Goods = ({dispatch,location}) => {
    var type=location.query.type||"-1";

    function renderTabBar(props) {
        return (<Sticky>
            {({ style }) => <div style={{ ...style, zIndex: 1 }}><Tabs.DefaultTabBar {...props} /></div>}
        </Sticky>);
    }
    var title=[{title:"全部订单",status:-1},{title:"待付款",status:1},{title:"待发货",status:5},{title:"已完成",status:9}]


        if(type == 1){
            type = 1
        }
        else if(type == 5){
            type = 2
        }
        else if(type == 9){
            type = 3
        }else {
            type = 0
        }

        function changeTab(status) {
            dispatch({type: 'order/setState', orders:[],status })
            let payload = {}

            if(status !== -1){
                payload = {status};
            }

            dispatch({type: 'order/fetchOrders', payload })
        }

    return (
        <div style={{backgroundColor:"#ffffff"}}>
            <StickyContainer>
            <Tabs swipeable={false} tabs={title} initialPage={type}
                  onChange={(tab, index) => { changeTab(tab.status) }}
                  renderTab={tab => <span>{tab.title}-{tab.sub}</span>}
                  renderTabBar={renderTabBar}
            >
                <Orders  type={-1}/>
            </Tabs>
            </StickyContainer>
        </div>
    )
}

export default connect(({order}) => ({order}))(Goods)