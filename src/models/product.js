import {getString} from '../utils/helper'
import { getAccessOpendId,setAccessCNO,getAccessCNO} from '../models/validator'
import {api,history} from "../config";
import { request } from "../utils/request";
import {Toast} from 'antd-mobile'
import {getAccessDeviceId,setAccessDeviceId,getAccessOperatorId} from '../models/validator'
import {parse} from "qs";
import {specifiedMachine} from '../utils/helper'
String.prototype.replaceAll = function(s1,s2){
    return this.replace(new RegExp(s1,"gm"),s2);
}


export default {
    namespace: 'product',
    state: {
        loading:false,
        marketing:[],
        itemProduct:{},
        ordinaryProduct:{},
        dataError:false,
        activityStatus:1
    },
    subscriptions: {
        setup({dispatch, history}) {
            history.listen(locations => {
                const pathname = locations.pathname;

                const id = locations.query.id;
                if(pathname.indexOf('/product') > -1 ){
                   // location.href = api + encodeURIComponent(location.href);

                    if(id){
                        if(locations.query.activity){        //获取团购
                            locations.query.activity == 'bulk'&&  dispatch({type: 'fetchMarketingDetail', mid: id});
                            dispatch({type: 'fetchProduct', pid: id,market:true})
                        }
                    }
                }
                if(pathname.indexOf('/detail') > -1 ){

                    if(locations.query.hotItem){

                        dispatch({type: 'setQuest', ordinaryProduct: JSON.parse(localStorage.getItem('hotItem'))});
                    }else{

                        dispatch({type: 'fetchProduct', pid: id});
                    }
                }
            })
        }
    },
    effects: {
        *fetchProduct({pid,market}, {call, put}) {
            yield put({type:'fetchRequest'})
            const entry = localStorage.getItem('entry');
            let url = api + 'devices/'+getAccessDeviceId()+'/items/?product_id='+pid;

            let isMicro = entry == 'device';

            isMicro = isMicro && !specifiedMachine();
            if(isMicro){
                url = api +'store/product/'+pid+ '?operator_id='+getAccessOperatorId();
            }
            if(market){
                url = api +'store/marketing/'+pid+ '?operator_id='+getAccessOperatorId();
            }
            const data = yield call(request, url, {method: 'get'});
            Toast.hide()
            if(data.code){
                //Toast.fail(data.message, 1);
                yield put({type:'setQuest',dataError:true})

            }else{
                yield put({type:'fetchProductResponse',itemProduct:data,isMicro})
            }
        },
        *fetchMarketingDetail({mid}, {call, put}) {
            yield put({type:'fetchRequest'})
            const data = yield call(request, api + 'store/group_buy?operator_id='+getAccessOperatorId() + '&marketing_id='+mid, {method: 'get'});
            Toast.hide()
            if(data.code){
              //  Toast.fail(data.message, 1);
            }else{
                yield put({type:'fetchMarketingDetailResponse',marketing:data})
            }
        }
    },
    reducers: {
        fetchRequest(state,action){
            Toast.loading('正在加载中...',0);
            return{...state,loading:true}
        },
        fetchMarketingDetailResponse(state,action){
            return{...state,...action.marketing}
        },
        fetchMarketingResponse(state,action){
            return{...state,itemProduct : action.itemProduct.results[0]}
        },
        fetchProductResponse(state,action){
            //alert(JSON.stringify(action.itemProduct))
            if(action.dataError){
                return{...state,ordinaryProduct : action.dataError}
            }
           let activityStatus = 1;
           let data = action.itemProduct;
            if(!action.isMicro){
                data = action.itemProduct.items[0]
            }else{
                const formatTime = new Date(nowTime).getTime() / 1000 ;

                if(formatTime >= data.end){  // 结束
                    activityStatus = 0;
                }
                if(formatTime < data.start){  //未开始
                    activityStatus = -1;
                }
            }
            return{...state,ordinaryProduct : data,activityStatus}
        },
        setQuest(state,action){
            return{...state,...action}
        }
    },
}
