import {getString} from '../utils/helper'
import {getAccessCNO, getAccessOpendId} from '../models/validator'
import {api_card,history} from "../config";
import pathToRegexp from 'path-to-regexp';
import { request } from "../utils/request";
import {Toast} from 'antd-mobile'
export default {
    namespace: 'recharge',
    state: {
        checkValue:0,
        card:{},
        discounts:[],
        loading:false
    },
    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
                const pathname = location.pathname;
                const action = pathToRegexp(`/cards/recharge`).exec(pathname);
                if(action){
                    dispatch({type: 'fetchCards'})

                }
            })
        }
    },
    effects: {
        *fetchCards({}, {call, put}) {
            yield put({type:'fetchRequest'})
            const data = yield call(request, api_card + 'card_balance', {method: 'post', body: {openid : getAccessOpendId()}});
            if(data.code && data.code == '20081'){
                location.href = '/cards/noCard';
            }else{
                yield put({type:'fetchDiscounts'})
                yield put({type:'fetchCardsResponse',card:data})
            }

        },
        *fetchDiscounts({}, {call, put}) {
            const data = yield call(request, api_card + 'card_recharge_settings', {method: 'post', body: {openid : getAccessOpendId(),cno:getAccessCNO()}});
            yield put({type:'fetchDiscountsResponse',discounts:data})
        },
        *recharge({price}, {call, put}) {
            const data = yield call(request, api_card + 'card_recharge', {method: 'post', body: {openid : getAccessOpendId(),cno:getAccessCNO(),price,sourceType:'c'}});
            if(data.payUrl){
                window.location.href = data.payUrl;
            }else{
                Toast.fail(getString('rechargeFail'));
            }
        },

    },
    reducers: {
        fetchRequest(state){
            return{...state,loading:true}
        },
        setQuest(state,action){
            return {...state,...action}
        },
        fetchCardsResponse(state,action){
            if (action.card.code) {
                Toast.fail(action.card.code+':'+action.card.message);
                return {...state, loading: false, card: []}
            } else {
                return {...state, loading: false, card:action.card}
            }
        },
        fetchDiscountsResponse(state,action){
            if (action.discounts.code) {
                Toast.fail(action.discounts.code+':'+action.discounts.message);
                return {...state, discounts: []}
            } else {
                return {...state, ...action.discounts}
            }
        },
    },
}
