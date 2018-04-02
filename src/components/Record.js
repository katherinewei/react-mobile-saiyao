import React from "react";
import { Flex,List ,PullToRefresh ,ListView,Card,Icon} from 'antd-mobile';
import {connect} from "dva";
import { history } from '../config'
import  './record.less'
const Item = List.Item;
import {timeStringFormat,getPrice} from  '../utils/helper'
const Record =({dispatch,activeKey,record:{records,loading,pages,page,refreshing,cost}}) =>{

    let years = [], newData = [];  let d = [];
    if(records) {
        for(let k of records){

            years.push(timeStringFormat(k.created_at,'yyyy'));
        }
        years = [...(new Set(years))];

        for(let i =0;i < years.length;i++){
            let year = [];
            records && records.length > 0 && records.map((row,j) =>{

                if(timeStringFormat(row.created_at,'yyyy') == years[i]){
                    year.push(row);
                }
            })

            newData.push(year);
        }
    }

    const imgUrl = require(`../assets/staticIcon/noData0.png`);
    const onEndReached = (event) => {
        if (!loading && pages > page) {
            dispatch({
                type: 'record/fetchRecord',consumption:true,page:page+1
            });
        }
    };
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const renderRow = (rowData, sectionId, rowId) => (
        <div>
            <Flex  align="stretch" key={rowId}>
                <Flex.Item className="year">{timeStringFormat(rowData[0].created_at,'yyyy')}年</Flex.Item>
                <Flex.Item>
                    <List className="my-list">
                        {
                            rowData.map((item,j) =>{
                                const diff = item.diff < 0;
                                const item_cost = cost['res' + item.object_id];
                                return <div className="item_record" onClick={() => viewDetail(diff,j,item.object_id)}  key={`key${rowId}_${j}`}>
                                    <Item extra={<span><span className={diff && 'diff'}>￥{getPrice(Math.abs(item.diff))}</span>{diff ? <Icon type={item_cost && item_cost.state ? "down" :"up"}/>: ''}</span> }>{timeStringFormat(item.created_at,'MM月dd日 / hh:mm:ss')}</Item>
                                        {diff &&  item_cost && item_cost.result ? item_cost.result.map((product,k) =>{
                                            return <Card key={k} className={`product product_${item_cost && item_cost.state ? 'show' : 'hide' }`} id={`product_${j}`}>
                                                    <Card.Header
                                                        title={product.name + '  ×'+ product.quantity}
                                                        extra={<p><span className="price">￥{getPrice(Math.abs( product.price))}</span></p>}
                                                    />
                                                </Card>
                                            })
                                            : ''}
                                </div>
                            })
                        }
                    </List>
                </Flex.Item>
            </Flex>
        </div>
    );
    function viewDetail(diff,index,source_id) {
        const object = document.getElementById('product_'+index);
        if(diff){
            if(object){
                let item = cost['res' +source_id];
                item.state = !item.state;
                for(let key in cost){
                    if(key !== 'res' +source_id){
                        cost[key].state = false;
                    }
                }
                dispatch({type:'record/setQuest',cost:cost})
            }
            else{
                dispatch({type:'record/fetchCost',source_id})
            }
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
            dispatch({type: 'record/fetchRecord', refreshing: true});
            timer = false;
            sessionStorage.setItem('timer',new Date().getTime());
        }else{
            onRefresh();
        }
    }

    return (
        <div>
            {/*<div className="whitespace"></div>*/}
            {records && records.length > 0 ?  <div className="record">
                    <ListView
                        dataSource={ds.cloneWithRows(newData)}
                        renderRow={renderRow}
                        renderFooter={renderFooter}
                        scrollRenderAheadDistance={1}
                        onEndReached={onEndReached}
                        onEndReachedThreshold={600}
                        initialListSize={0}
                        pageSize={20}
                        scrollEventThrottle={30}
                        scrollerOptions={{ scrollbars: true }}
                        style={{
                            height: document.documentElement.clientHeight * 3 / 5,
                        }}
                        pullToRefresh ={<PullToRefresh
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                         />}
                    />
                </div> : <div className="noData"><img src={'/'+imgUrl} /> </div>}
        </div>
    )
}
export default connect(({record}) => ({record}))(Record)