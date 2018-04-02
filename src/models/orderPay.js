import { request } from "../utils/request";
import {parse} from "qs";
import { Toast } from 'antd-mobile';
import {api,api_card, history, redirect} from "../config";
import {specifiedMachine,timeStringFormat} from '../utils/helper'
import {getAccessOperatorId} from './validator'
export default {
    namespace: 'orderPay',
    state: {
        loading: false,
        items: null,
        devices: null,
        cart_item_id: null,
        quantity: null,
        orderOnline:[],
        visible:false,
        address_id:null,
        address:null,
      //  showWay:!(sessionStorage.getItem('IsOperation') == 'true'),
        wayValue:'',
        start_pick:'',
        end_pick:'',
        near_devices:[]
    },
    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
                const pathname = location.pathname;
                if(pathname == '/micro/orderformOnline'){
                    let order = localStorage.getItem('order');
                    dispatch({type: 'shop/fetchPage',notHome:true})
                    if(order){
                        order = JSON.parse(order);
                        let {start_time,pick_start_time,pick_end_time,postponed} = order[0]
                        if(start_time){
                            let now = Date.now();
                            let now_date =  timeStringFormat(Date.now() / 1000 ,'yyyy/MM/dd');
                            let end = now;
                            let end_date = now_date;
                            if(new Date('2017-08-01 '+pick_start_time.replace(/\-/g,'/')).getTime() >= new Date('2017-08-01 '+pick_end_time.replace(/\-/g,'/')).getTime()){
                                end = (Date.now() + ( 24 * 60 * 60 * 1000))
                            }
                            if(postponed){
                                now_date =  timeStringFormat((now + ( postponed * 24 * 60 * 60 * 1000))  / 1000 ,'yyyy/MM/dd');
                                end_date =  timeStringFormat((end + ( postponed * 24 * 60 * 60 * 1000))  / 1000 ,'yyyy/MM/dd');
                            }
                            let start_pick = new Date(now_date + ' ' + pick_start_time.replace(/\-/g,'/'))
                            let end_pick = new Date(end_date + ' ' + pick_end_time.replace(/\-/g,'/'))

                            dispatch({type:'setValue',start_pick,end_pick})
                        }
                        dispatch({type:'getOrder',orderOnline:order})

                    }
                    const entry = localStorage.getItem('entry');
                    if(entry && entry == 'device' && !specifiedMachine()){
                        let url = encodeURI(window.location.href);
                        let book = location.query && location.query.book;
                        let payload = {url};
                        dispatch({type: 'fetchWXSDK',payload,book,dispatch})
                    }

                    // if(location.query && location.query.book){
                    //     dispatch({type:'getOrder',orderOnline:order})
                    // }
                }
            })
        }
    },
    effects: {
        *fetchWXSDK({payload,book,dispatch}, {call, put}) {
            const data = yield call(request, api_card + 'jsdk_config', {method: 'get', body:payload });
            let params = data.params;
            wx.config({
                debug: false,
                appId: params.appId,
                timestamp:  params.timestamp,
                nonceStr: params.nonceStr,
                signature: params.signature,
                jsApiList: ['openAddress','openLocation','getLocation']
            });
            // dispatch({
            //     type: 'fetchNearbyDevicesItems',
            //     payload: {
            //         longitude: '113.333243',
            //         latitude: '22.995782',
            //     },
            // });
            wx.ready(function() {
                if(book){
                    Toast.loading('正在获取定位',0);

                    wx.getLocation({
                        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                        success: function (res) {
                            Toast.hide();
                            const latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                            const longitude = res.longitude ; // 经度，浮点数，范围为180 ~ -180。
                            // alert(latitude);
                            dispatch({
                                type: 'fetchNearbyDevicesItems',
                                payload: {
                                    longitude: longitude,
                                    latitude: latitude
                                },
                            });
                        },
                        fail:function (err) {
                            Toast.fail("位置服务被拒绝,请确保允许微信获取定位",2);
                            alert(' ' + JSON.stringify(err));
                        }
                    });
                }

                wx.error(function(res) {
                      alert('wx error: ' + JSON.stringify(res));
                });
            })

            // wx.error(function(res) {
            //     alert('wx error: ' + JSON.stringify(res));
            // });
        },
        *cartOrders({payload,book}, {call, put}) {

            yield put({type: 'createOrderRequest'})
            const entry = localStorage.getItem('entry');

            let url = 'orders/';
            if(entry == 'device' && !specifiedMachine() && !book){
                url = 'store/orders';
            }
            let data = yield call(request, api + url, {method: 'post', body: parse(payload)})

            if(data.code){
                Toast.fail(data.message, 1);
                yield put({type: 'setValue', disable:false,loading:false})
                setTimeout(() => {
                    Toast.hide();
                },1000)

            }
            else{
                const entry = localStorage.getItem('entry');
                let cart_local = entry == 'device' ? 'cartOnline' :'cart';
                const pay = yield call(request, api + 'pay/', {method: 'post', body: {order_id: data.object_id, redirect: redirect}});
                let cart =  localStorage.getItem(cart_local) ? JSON.parse(localStorage.getItem(cart_local)) : [];

                let orderOnline =  localStorage.getItem('order') ? JSON.parse(localStorage.getItem('order')) : [];
                for(let i=0,flag=true,len=cart.length;i<len;flag ? i++ : i){
                    for(let j =0;j< orderOnline.length;j++){
                        if( cart[i] && cart[i].name && cart[i].name  == orderOnline[j].name){
                            cart.splice(i,1);
                            flag = false;
                        }else{
                            flag = true;
                        }
                    }
                }
                if(cart.length == 0){
                    localStorage.removeItem(cart_local)
                }else{
                    localStorage.setItem(cart_local,JSON.stringify(cart))
                }
                localStorage.removeItem('order');
                if(pay.code) {
                    Toast.fail(pay.message, 1);
                }else{
                    window.location.href = pay.payUrl;
                }
            }
        },
        *fetchNearbyDevicesItems({payload}, {call, put,select}) {
            yield put({type: 'fetchItemsRequest'})
            // let oid = yield  select(state => state);
            payload.oid = getAccessOperatorId();
            // payload.ignore = oid.devices.ignore;
            const data = yield call(request, api + 'devices/', {method: 'get', body: parse(payload), isToken: false});
            Toast.hide();

            yield put({type: 'fetchNearbyItemsResponse', nearby_Devices: data})
        },
    },
    reducers: {
        createOrderRequest(state) {
            Toast.loading('正在提交订单...',0);
            return {...state, loading: true,disable:true}
        },

        setAddress(state,action){
            return{...state,address:action.address};
        },
        fetchItemsRequest(state) { 
            return {...state, loading: true}
        },
        getOrder(state,action){
            return{...state,orderOnline:action.orderOnline};
        },
        hideModal(state,action){
            return{...state,visible:false};
        },
        showModal(state,action){
            return{...state,visible:true};
        },
        selectAddressId(state,action){
            return{...state,address_id:action.id};
        },
        setValue(state,action){
            return{...state,...action};
        },
        fetchNearbyItemsResponse(state, action) {
            if (action.nearby_Devices.code) {
                Toast.fail('加载失败!!!'+ action.nearby_Devices.code, 1);
                return {...state, loading: false, Devices: []}
            } else {

                let devices =  action.nearby_Devices;
                sessionStorage.setItem('nearby_Devices_service',JSON.stringify(devices));
                // let list = [];
                // console.log(devices)
                // devices.device.map(item => {
                //     list.push({label:item.name,value:item.object_id})
                // })
                return {...state, loading: false, near_devices: devices}
            }
        },
    },
}
