import {getString,noCard} from '../utils/helper'
import { getAccessOpendId,setAccessCNO,getAccessCNO} from '../models/validator'
import {api_card,history} from "../config";
import { request } from "../utils/request";
import {Toast} from 'antd-mobile'

const registered = sessionStorage.getItem('hasRegister');
export default {
    namespace: 'card',
    state: {
        visible:false,
        list:[],
        loading:false,
        jsdk_config:{},
        hasConfiguration:true,
        visibleEwm:false,
        hasRegister:location.search && location.search.indexOf('hasRegister') > -1 && registered != '1'
    },
    subscriptions: {
        setup({dispatch, history}) {
            history.listen(locations => {

                const path =  locations.pathname;
                if(path=='/cards/'){
                    let openid = locations.query.openid ? locations.query.openid : getAccessOpendId();
                    dispatch({type:'fetchCards',payload:{openid}})
                    let url = encodeURI(location.href);
                    let payload = {url};
                    dispatch({type:'fetchWXSDK',payload})
                }
            })
        }
    },
    effects: {
        *fetchWXSDK({payload}, {call, put}) {
            const data = yield call(request, api_card + 'jsdk_config', {method: 'get', body:payload });
            yield put({type:'fetchWXSDKResponse',jsdk_config:data})
        },
        *fetchCards({payload}, {call, put}) {
            yield put({type:'fetchRequest'})
            const data = yield call(request, api_card + 'card_balance', {method: 'post', body: payload});
            if(data.code && data.code == '20081'){
                location.href = '/cards/noCard';
            }
            if(data.cno){
                yield put({type: 'record/fetchRecord',cno:data.cno})
                yield put({type:'fetchCardsResponse',list:data})
            }
        },
        *recharge({}, {call, put}) {
            const data = yield call(request, api_card + 'card_recharge', {method: 'post', body: {openid : getAccessOpendId(),cno:getAccessCNO(),price:'30000',sourceType:'d'}});
            if(data.payUrl){
                window.location.href = data.payUrl;
            }else{
                Toast.fail(getString('rechargeFail'));
            }
        },
    },
    reducers: {
        fetchWXSDKResponse(state,action){
           let jsdk_config = {}
            if(action.jsdk_config){
                jsdk_config = action.jsdk_config;
            }
            return {...state,jsdk_config}
        },
        fetchRequest(state){
            return {...state,loading:true}
        },
        showModal(state,action){
            return {...state,visible:true}
        },
        hideModal(state,action){
            return {...state,visible:false,visibleEwm:false,hasRegister:false}
        },
        setQuest(state,action){
            return {...state,...action}
        },
        fetchCardsResponse(state,action){
            if (action.list.code) {
                Toast.fail(action.list.code+':'+action.list.message);
                return {...state, loading: false, list: []}
            } else {
                setAccessCNO(action.list.cno);
                return {...state, loading: false, list:action.list}
            }

        },

    },
}
