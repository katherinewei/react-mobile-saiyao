import React from "react";
import { Flex,List ,PullToRefresh ,ListView,Result,Toast} from 'antd-mobile';
import {connect} from "dva";
import { history } from '../config'
import  '../components/record.less'
import UnpaidOrder from '../components/UnpaidOrderComponent';
import UnpickUpOrder from '../components/UnpickUpOrderComponent';
import Panel from '../components/PanelComponent';
const Item = List.Item;
import {timeStringFormat,getPrice} from  '../utils/helper'
const Order =({dispatch,order:{orders,loading,pages,page,refreshing,status,visible,currentOrder,device}}) =>{

    // const list = orders.orders ? orders.orders : [];
    // console.log(list)



    const onEndReached = (event) => {
        console.log(1)

        if (!loading && pages > page) {
            let payload = {
                page:page+1
            }

            if(status && status !== -1){
                payload.status = status
            }
            dispatch({
                type: 'order/fetchOrders',payload
            });
        }
    };
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const renderRow = (rowData, sectionId, rowId) => {
        if (rowData.status == 0||rowData.status == 1||rowData.status == 9) {
            return (
                <UnpaidOrder del_cb={del_cb()} order={rowData} dispatch={dispatch} key={rowData.object_id}/>
            )
        } else if (rowData.status == 5) {
            return (
                <UnpickUpOrder orders={rowData} dispatch={dispatch} key={rowData.object_id} />
            )
        }else{
            return <div></div>
        }
    };
    const del_cb = () =>{
        return function (object_id){
            Toast.info('删除成功', 1);
            onRefresh();
        }
    }

    //列表Footer
    const renderFooter = () => (<div id="ListFooter" style={{ padding: 5, textAlign: 'center' }}>
        {loading ? '加载中...' : '加载完毕'}</div>);
    setTimeout(() => {
        if(document.getElementById('ListFooter')) {
            document.getElementById('ListFooter').style.opacity = !loading ? '0' : '1';
        }
    },1500)

    let timer = true;
    function onRefresh (){
        const timerSession = sessionStorage.getItem('timer');
        if(new Date().getTime() - parseInt(timerSession) > 10 * 1000 ){
            timer = true;
        }
        if(timer){
            let payload = {};
            if(status !== -1){
                payload.status = status
            }
            dispatch({type: 'order/fetchOrders', refreshing: true,payload});
            timer = false;
            sessionStorage.setItem('timer',new Date().getTime());
        }else{
            onRefresh();
        }
    }


    const panelProps = {
        visible,
        ...currentOrder,
        device,
        onClose() {
            dispatch({type: 'order/hideModal'})
        },
    };

    return (
        <div>
            {/*<div className="whitespace"></div>*/}
            {orders && orders.length > 0 ?
                    <ListView
                        dataSource={ds.cloneWithRows(orders)}
                        renderRow={renderRow}
                        renderFooter={renderFooter}
                        scrollRenderAheadDistance={1}
                        onEndReached={onEndReached}
                        onEndReachedThreshold={10}

                        pageSize={20}
                        scrollEventThrottle={30}
                        scrollerOptions={{ scrollbars: true }}
                        style={{
                            height: document.documentElement.clientHeight * 3 / 2,
                        }}

                    />
                 :  <div style={{paddingTop:"3.466666rem"}}>
                    <Result
                        imgUrl="https://zos.alipayobjects.com/rmsportal/NRzOqylcxEstLGf.png"
                        title='暂无订单信息'
                    />
                </div>}

            {panelProps.pick_number && <Panel {...panelProps}/>}
        </div>
    )
}
export default connect(({order}) => ({order}))(Order)