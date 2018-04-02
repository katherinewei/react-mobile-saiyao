import { request } from "../utils/request";
import {parse} from "qs";
import { Toast } from 'antd-mobile';
import {api, history} from "../config";
import pathToRegexp from 'path-to-regexp'
import {getAccessDeviceId,setAccessDeviceId} from '../models/validator'

export default {  
    namespace: 'items',
    state: {
        loading: false,
        products: [],
        devices: [],
        item:{},
        c:false,
        currentItem:{},
        buyType:'',

    },
    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
                const deviceId = pathToRegexp('/micro/market/classified/:deviceId').exec(location.pathname)

                if (deviceId) {
                    setAccessDeviceId(deviceId[1]);
                   // dispatch({type: 'fetchDeviceDetail', deviceId: deviceId[1]})
                    dispatch({type: 'fetchDevicesItems', deviceId: deviceId[1]})

                }

            })
        }
    },
    effects: {
        *fetchDeviceDetail({deviceId}, {call, put}) {
            yield put({type: 'fetchItemsRequest'})
            const data = yield call(request, api + 'devices/'+deviceId, {method: 'get', body: "", isToken: false})
            yield put({type: 'fetchDeviceDetailResponse', devices: data})
        },
        *fetchDevicesItems({deviceId}, {call, put}) {
            const data = yield call(request, api + 'devices/'+deviceId+'/items/', {method: 'get', body: {}, isToken: false})
            yield put({type: 'fetchDevicesItemsResponse', products: data})
        },
        *cartItems({payload}, {call, put, select}) {
            const body = {
                quantity: payload.quantity,
                product_id: payload.product_id,
                device_id: payload.device_id
            }

            const data = yield call(request, api + 'cart_items/', {method: 'post', body: parse(body)})
            if(data.code){
                Toast.fail(data.message, 1);
            }else{
                let state = yield select(state => state)
                state.orderPay.cart_item_id = data.object_id;
                state.orderPay.quantity = parseInt(payload.quantity);
                state.orderPay.devices = payload.devices;
                state.orderPay.items = payload.items;
                history.push("/market/orderform");
            }

        },
        // *getItem({url,id}, {call, put, select}) {
        //
        //     let url_q = url.replace('{0}', id);
        //     const data = yield call(request, url_q, {method: 'get'})
        //     if(data.code){
        //         Toast.fail(data.message, 1);
        //     }else{
        //         yield put({type: 'fetchDetailResponse', item: data})
        //     }
        // }
    },
    reducers: { 
        fetchItemsRequest(state) { 
            return {...state, loading: true}
        },
        fetchDeviceDetailResponse(state, action) {   
            if (action.devices.code) {
                Toast.fail('加载失败!!!'+ action.devices.code, 1);
                return {...state, loading: false, devices: []}
            } else {
                return {...state, loading: false, devices: action.devices}
            }
        },
        fetchDevicesItemsResponse(state, action) {       
            if (action.products.code) {
                Toast.fail('加载失败!!!'+ action.products.code, 1);
                return {...state, products: []}
            } else {
                //更新购物车信息
                // const items = action.products.items;
                // const localCart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
                // if(items.length > 0 && localCart.length > 0){
                //     items.map(item => {
                //         for(let i=0,flag=true,len=localCart.length;i<len;flag ? i++ : i){
                //             if(item.name == localCart[i].name){
                //                 localCart[i] = item;
                //             }
                //             if(item.name == localCart[i].name && item.valid_stock - item.lock_stock == 0){
                //                 localCart.splice(i,1);
                //                 flag = false;
                //             } else {
                //                 flag = true;
                //             }
                //         }
                //     })
                // }
                return {...state, products: action.products.items}
            }
        },
        getItem(state, action){
            return {...state, ...action}
        },
        fetchDetailResponse(state, action){
            return {...state, ...action}
        },
    },
}
