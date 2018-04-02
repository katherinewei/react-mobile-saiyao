import { request } from "../utils/request";
import {parse} from "qs";
import { Toast } from 'antd-mobile';
import {api, history, redirect} from "../config";

export default {  
    namespace: 'order',
    state: {
        loading: false,
        orders: [],
        visible: false,
        number: null,
        device: null,

        currentOrder:{}
    },
    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {

                if(location.pathname == '/micro/order'){
                    const status = location.query.type;
                    let payload = {}
                    if(status){
                        payload = {status }
                    }
                    dispatch({type: 'order/setState', orders:[],status })
                    dispatch({type: 'hideModal'})
                    dispatch({type: 'fetchOrders',payload})
                }
            })
        }
    },
    effects: {
        *fetchOrders({payload,refreshing}, {call, put, select}) {
            yield put({type: 'fetchOrdersRequest'})
            const result = yield call(request, api + 'orders/', {method: 'get', body: parse(payload)})
            let state = yield select(state => state)
            const data =  state.order.orders;
            if(!refreshing){
                result.orders.map((row,i) =>{
                    data.push(row);
                })
                result.orders = data;
            }

            yield put({type: 'fetchOrdersResponse',  result})
        },
        *ordersPay({id}, {call}) {
            Toast.loading('正在跳转支付中...',0);
            const pay = yield call(request, api + 'pay/', {method: 'post', body: {order_id: id, redirect: redirect}});
            if(pay.code) {
                Toast.fail(pay.message, 1);
            }else{ 
                window.location.href = pay.payUrl;
            }
        },
        *delete({id,del_cb,state}, {call, put}) {
            const data = yield call(request, api + 'orders/'+id, {method: 'delete', body: {state:state}});
            if(data.code) {
                Toast.fail(data.message, 1);
            }else{
                if(del_cb){
                    del_cb(id)
                }
            }
        },
        *showModal({number,device_id}, {call,put}) {
            const data = yield call(request, api + 'devices/'+device_id, {method: 'get', body: "", isToken: false})
            yield put({type: 'showModalResponse', device: data, number: number})
        }
    },
    reducers: {
        fetchOrdersRequest(state) {
            return {...state, loading: true}
        },
        fetchOrdersResponse(state, action) {

            const data =  action.result;
            const val = {...state, loading: false,refreshing:false,...data};

            if (data.code) {
                Toast.fail('加载失败!!!'+ data.code, 1);
                return {...state, orders: []}
            }
            return {...val}
        },
        showModalResponse(state, action) {
            if (action.device.code) {
                Toast.fail('加载失败!!!'+ action.device.code, 1);
                return { ...state, visible: false, number: null};
            } else {
                return { ...state, number:action.number, visible:true,device: action.device};
            }
        },
        hideModal(state) {
            return { ...state, visible: false, number: null};
        },
        setState(state, action){
            return {...state, ...action}
        }

    },
}
