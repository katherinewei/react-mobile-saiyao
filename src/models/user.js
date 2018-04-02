import {getString} from '../utils/helper'
import { UserId} from '../models/validator'
import {api,history} from "../config";
import { request } from "../utils/request";
import {Toast} from 'antd-mobile'
import {parse} from 'qs'
import {getAccessDeviceId,setAccessDeviceId} from '../models/validator'

export default {
    namespace: 'user',
    state: {
        loading:false,
        user:{},
        orderTotal:0,
        isEdit:false
    },
    subscriptions: {
        setup({dispatch, history}) {
            history.listen(locations => {
                const pathname = location.pathname;
                if(pathname == '/micro/user'){
                    dispatch({type:'fetchUser'})
                    dispatch({type:'fetchOrders'})

                }
            })
        }
    },
    effects: {
        *fetchUser({}, {call, put}) {
            yield put({type:'fetchRequest'})
            const data = yield call(request, api + 'users/'+UserId(), {method: 'get'});
            if(data.code){
                Toast.fail(data.message, 1);
            }else{
                yield put({type:'fetchUserResponse',user:data})
            }
        },
        *editHeader({payload}, {call, put}) {
            yield put({type:'fetchRequest'})

            const data = yield call(request, api + 'users/'+UserId(), {method: 'put',body: parse(payload)});
            if(data.code){
                Toast.fail(data.message, 1);
            }else{
                yield put({type:'fetchUser'})
                yield put({type:'fetchUserResponse',user:data})
            }
        },
        *fetchOrders({}, {call, put}) {
            yield put({type: 'fetchRequest'})
            const data = yield call(request, api + 'orders/', {method: 'get'})
            yield put({type: 'fetchOrdersResponse', orderTotal: data.total})

        },

    },
    reducers: {
        fetchRequest(state,action){
            return{...state,loading:true}
        },
        fetchUserResponse(state,action){
            return{...state,...action.user}
        },
        fetchOrdersResponse(state,action){
            return{...state,orderTotal:action.orderTotal}
        },
        setQuest(state,action){
            return{...state,...action}
        }
    },
}
