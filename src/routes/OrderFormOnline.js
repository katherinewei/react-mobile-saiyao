import React from "react";
import style from './OrderForm.less';
import {connect} from "dva";
import { history } from '../config';
import {Flex,List,Button,WhiteSpace,Result,Toast,DatePicker,Picker} from 'antd-mobile'
import pathToRegexp from 'path-to-regexp'
import style_C from '../index.less'
import {getAccessDeviceId,getAccessOperatorId} from '../models/validator'
import { getPrice,specifiedMachine} from '../utils/helper'
import ShowDevices from '../components/showDevices'
const FlexItem = Flex.Item;
const  Item = List.Item;
import 'moment/locale/zh-cn';


const OrderForm = ({dispatch,location, orderPay:{ address,orderOnline,wayValue,disable,start_pick,end_pick,near_devices,selectedDevice,visible}}) => {
    let url = encodeURI(window.location.href);

    const entry = localStorage.getItem('entry');
    let has_address=true;
    let now_address=[];
    const deviceId = pathToRegexp('/:deviceId/orderFormOnline').exec(location.pathname);
    const nearby_Devices = localStorage.getItem('nearby_Devices');
    const devices = nearby_Devices ? JSON.parse(nearby_Devices) : [];

    const book = location.query && location.query.book;

    const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt="" />;
    let device = {};
    devices.map((item) => {
        if(item.object_id == localStorage.getItem('access_deviceId')){
            device = item;
            return
        }
    })
    if(address){
        now_address={
            name:address.userName,
            address:address.detailInfo,
            phone:address.telNumber,
            district:address.provinceName+address.cityName+address.countryName
        }
    }else{
        has_address=false
    }
    function onOrderPayClick(){
       // if(!cart_item_id) return
        if(disable) return
        const items = [];
        orderOnline.map(item=>{
            items.push({product_id:item.product_id,quantity:item.num})
        })

        const data = {
            items:items,
        }
        if(book){
            if(!selectedDevice){
                Toast.fail('请选择机台');
                return
            }
            data.device_id = selectedDevice.object_id;
            data.is_pre = 1

        }
        else if( entry && entry == 'device' && !specifiedMachine()){
            if(now_address.length == 0){
               Toast.fail('请填写收货地址');
            //   return
            }
            data.delivery_address=now_address;
            data.operator_id = getAccessOperatorId();
            data.is_marketing = location.query.marketing ? 1 : 0;
        }
        if(entry == 'devices' || specifiedMachine()){
            data.device_id = getAccessDeviceId();
        }
        if(entry == 'device' && !start_pick && !specifiedMachine()){
            Toast.fail('请选择送货时间');
            return
        }
        if(start_pick){
            data.pick_valid_at =  parseInt(start_pick.getTime() / 1000);
            data.pick_invalid_at =  parseInt(end_pick.getTime() / 1000);
        }

        if(location.query.marketing){
            data.is_marketing = 1;
        }
        if(location.query.join){
            data.join = location.query.join
        }
        console.log(data)

        dispatch({type: 'orderPay/cartOrders', payload:data,book})
    }


    let imgUrl = require('../assets/staticIcon/placeholderLogo.png');
    const bottomLine = require('../assets/staticIcon/didian.png');

    let total = 0;
    orderOnline.map(item =>{

        let price = parseFloat(item.price)
        total += price * item.num ;
    })
    function showModal(){
        wx.openAddress({
            success: function (res) {
                dispatch({type:'orderPay/setAddress',address:res})
            }
        });
    }
    function hideModal(){
        dispatch({type: 'orderPay/hideModal'})
    }

    const  delivery = has_address ?
        <div>
            <div className={style.contact}>
                <p className={style.name}>收货人：{now_address.name}</p>
                <p className={style.tel}>{now_address.phone}</p>
            </div>

            <p>收货地址：{now_address.district + now_address.address}</p></div>
        : <p style={{textAlign: "right"}}>选择收货地址</p>;

        const PickUp =  <div className={style.vendingInfoContainerStyle}>
            <div className={style.vendingNameStyle}>{device ? device.area : ''}
            </div>
            <div
                className={style.vendingAddressStyle}>{device ? device.address : ''}</div>
            <span
                className={style.vendingIdStyle}>机台编号 : {device ? device.number : ''}
                        </span>
        </div>
    const chooseDevice = selectedDevice ?
        <div>
            <div className={style.vendingNameStyle}>{selectedDevice.area}
            </div>
            <div className={style.vendingAddressStyle}>{selectedDevice.address}</div>
            <span className={style.vendingIdStyle}>机台编号 : { selectedDevice.number}</span>
        </div>
        : <p style={{textAlign: "right"}} onClick={() => onDevicesClick()}>选择附近机台</p>;

    function onHandleClick(device) {

        dispatch({type:'orderPay/setValue',selectedDevice:device})
        onClose()
    }
    function onClose() {
        dispatch({type:'orderPay/setValue',visible:false})
    }

    function onDevicesClick() {
        dispatch({type:'orderPay/setValue',visible:true})
    }

    const actionprops = {
        dispatch,
        nearby_Devices:near_devices,
        current:'history',
        visible,
        onHandleClick,
        onClose
    }

    return (
        <div>

            {orderOnline.length > 0 ? <div>
                    {!specifiedMachine()  && <div style={{background:'#fff'}}>

                         <div className={style.address + ' ' + 'address_order'}>
                                <List>
                                    <Item
                                        arrow={!(entry && entry == 'devices') && "horizontal"}
                                        thumb={require('../assets/staticIcon/position.png')}
                                        multipleLine
                                        onClick={() => {
                                           book ? onDevicesClick() : (!(entry && entry == 'devices' ) || wayValue ) && showModal()
                                        }}
                                    >

                                        {
                                           book ? chooseDevice : (entry && entry == 'devices') ? PickUp : delivery
                                        }
                                    </Item>
                                    <img src={'/' + bottomLine} className="address_order_line"/>
                                </List>

                            </div>
                       </div>
                    }
                    <WhiteSpace />
                    <div className={style.productInfo}>
                        <h3>我的商品</h3>
                        <List className={style.myList + ' myOrderList'}>
                            {orderOnline.map((item,i)=>(
                                <Item key={i} className={style.myProduct} extra={<div><p className={style.price}><b className={style_C.priceIcon}>￥</b>{getPrice(item.price)}</p><p className={style.num}>X{item.num}</p></div>} align="top" thumb={item.imgs} >
                                    <div className={style.name}>{item.name}</div>
                                </Item>
                            ))}
                            {!specifiedMachine() &&
                            <div><DatePicker
                                value={start_pick}
                                onChange={date => dispatch({type:'orderPay/setValue',start_pick:date,end_pick:new Date(date.getTime() + 60 * 60 * 24 * 1000)})}
                                minDate={start_pick ? start_pick : new Date(Date.now())}

                            >
                                <List.Item   arrow="horizontal">送货开始时间</List.Item>
                            </DatePicker>
                            <DatePicker
                                disabled
                                value={end_pick}
                            >
                                <List.Item arrow="horizontal">送货结束时间</List.Item>
                            </DatePicker>
                            </div>
                            }

                            {entry && entry == 'devices' && <Item align="middle"  >
                                提货时间<span className={style.pickUpNoticeTextStyle}>(您可在24小时内提货)</span>
                            </Item>}

                            {/*<Item extra={<div><Brief className={style.price}>￥1.00</Brief><p>普通快递</p></div>} align="middle" arrow="horizontal" >*/}
                            {/*配送方式*/}
                            {/*</Item>*/}
                            {/*<Item align="middle"  >*/}
                            {/*买家留言<InputItem style={{display:'inline-block'}}/>*/}
                            {/*</Item>*/}

                            {/*<Item align="middle"  extra={<div><Brief className={style.price}>￥1.00</Brief><Brief className={style.price}>￥1.00</Brief></div>} >*/}
                            {/*<p>商品金额</p>*/}
                            {/*<p>运费</p>*/}
                            {/*</Item>*/}
                        </List>
                    </div>
                    <div className={style.otherInfo}>

                    </div>
                    <div className={style.footer}>
                        <Flex>
                            <FlexItem style={{flex:0.5}}/>
                            <FlexItem>
                                <Flex>
                                    <FlexItem className={style.total}><p className={style.price}>合计：￥{getPrice(total)}</p></FlexItem>
                                    <FlexItem className={style.clearing+' '+(disable && style.disabled)}><Button onClick={() => onOrderPayClick()}>{disable ? '正在提交':'提交订单'}</Button></FlexItem>
                                </Flex>
                            </FlexItem>
                        </Flex>
                    </div>

                    {book && <ShowDevices {...actionprops}/> }
                </div>:<Result
                    img={myImg('https://gw.alipayobjects.com/zos/rmsportal/GIyMDJnuqmcqPLpHCSkj.svg')}
                    title="暂无可支付订单"
                />}
                
                

        </div>
    )
}

export default connect(({orderPay}) => ({orderPay}))(OrderForm)
