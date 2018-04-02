import React from "react";
import {api} from "../config";
import { request } from "../utils/request";
import {Toast} from 'antd-mobile'
import {getAccessDeviceId} from '../models/validator'
import {isTestPage} from '../utils/helper'
export default {
    namespace: 'indexOnline',
    state: {
        loading:false,
        currentCate:0,
        currentSort:0,
        isPriceStatus:false,
        priceStatus:false,
        height:120,
        categories:[],
        cate:{name:<div><i dangerouslySetInnerHTML={{__html: '&#xe602;'}} /><div>全部</div></div>, id:'1'},
        cateItems:[]
    },
    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
                const pathname = location.pathname;
                if(pathname == '/micro/') {
                    //if(isTestPage()){

                        dispatch({type: 'fetchCategoriesItems', index:0})
                    //}
                    if(isTestPage()) {
                        dispatch({type: 'fetchCategories'})
                        dispatch({type: 'activity/fetchMarketing', did: getAccessDeviceId()})
                    }
                }
            })
        }
    },
    effects: {
        *fetchCategories({}, {call, put,select}) {
            yield put({type:'fetchRequest'})
            const data = yield call(request, api +'categories/', {method: 'get'});
            if(data.code){
                Toast.fail(data.message, 1);
            }else{
                let state = yield select(state => state);
                let categories = data.categories;

                if(categories.length > 0){
                    categories.unshift(state.indexOnline.cate);
                }

                yield put({type:'fetchCategoriesResponse',categories:categories})
            }
        },
        *fetchCategoriesItems({index,id}, {call, put}) {
            yield put({type:'setStatus',currentCate:index})
            let url = api +'devices/'+getAccessDeviceId()+'/items/';
            if(id){
                url += '?category_id='+id;
            }
            const data = yield call(request, url, {method: 'get'});
            if(data.code){
                Toast.fail(data.message, 1);
            }else{
                yield put({type:'fetchCategoriesItemsResponse',cateItems:data})
            }
        },
    },
    reducers: {
        setStatus(state,action){
            return{...state,...action};
        },
        fetchRequest(state,action){
            return{...state,loading:true};
        },
        fetchCategoriesResponse(state,action){

            return{...state,categories:action.categories};
        },
        fetchCategoriesItemsResponse(state,action){

            return{...state,cateItems:action.cateItems.items};
        },
    },
}
