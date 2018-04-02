import { getAccessOpendId,getAccessCNO} from '../models/validator'
import {api_card} from "../config";
import {Toast} from 'antd-mobile'
import pathToRegexp from 'path-to-regexp';
import { request } from "../utils/request";
export default {
    namespace: 'record',
    state: {
        activeKey:'',
        recharge:[],
        consumption:[],
        records:[],
        loading:false,
        refreshing:false,
        cost:[]
    },
    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
                const pathname = location.pathname;
                const action =   pathToRegexp(`/record/:action`).exec(pathname);

                //if(action){
                  //  dispatch({type: 'setQuest', activeKey:action[1]})
                    //if(action[1] == 'consumption'){
                        //dispatch({type: 'fetchRecord',consumption:true})
                    //}
                    // else{
                    //     dispatch({type: 'fetchRecord'})
                    // }
                //}
                // if(pathname == '/b'){
                //     dispatch({type: 'fetchRecord'})
                // }
            })
        }
    },
    effects: {
        *fetchRecord({refreshing,page,cno}, {call, put,select}) {
            yield put({type:'fetchRequest'})
            let url = 'card_record'
            const result = yield call(request, api_card + url, {method: 'post', body: {openid : getAccessOpendId(),cno:cno ? cno : getAccessCNO() ,page:page}});
            let state = yield select(state => state)
            const data =  state.record.records;
            if(!refreshing){
                result.records.map((row,i) =>{
                    data.push(row);
                })
                result.records = data;
            }
            yield put({type: 'fetchListResponse',result})
        },
        *fetchCost({source_id}, {call, put,select}) {
            const result = yield call(request, api_card + 'card_cost_order', {method: 'post', body: {source_id}});
            const state = yield select(state => state);
            let cost = state.record.cost;
            if(cost){
                for(let key in cost){
                    cost[key].state = false;
                }
            }
            cost['res' +source_id] = {result:result.results,state:true};
            yield put({type: 'fetchCostResponse',cost})
        },
    },
    reducers: {
        fetchRequest(state){
            return{...state,loading:true,refreshing:true}
        },
        setQuest(state,action){
            return {...state,...action}
        },
        fetchListResponse(state,action){
            const data =  action.result;
            const val = {...state, loading: false,refreshing:false,...data};
            if (data.code) {
                Toast.fail(data.code+':'+data.message);
            }
            return {...val}
        },
        fetchCostResponse(state,action){
            return{...state,cost:action.cost}
        },
    },
}
