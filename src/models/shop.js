import React from "react";
import {api,history} from "../config";
import { request } from "../utils/request";
import {Toast} from 'antd-mobile'
import {setAccessOperatorId,getAccessOperatorId} from '../models/validator'
import {specifiedMachine,ImgUrlChange} from '../utils/helper'
import pathToRegexp from "path-to-regexp";
import {parse} from "qs";
export default {
    namespace: 'shop',
    state: {
        loading:false,
        currentCate:0,
        currentSort:0,
        isPriceStatus:false,
        priceStatus:true,
        currentCategoryId:'',
        height:120,
        categories:[],
        cate:{name:<div><i dangerouslySetInnerHTML={{__html: '&#xe602;'}} /><div>全部</div></div>, id:'1'},
        cateItems:[],
        hotItems:[],
        bookItems:[],
        config: [],
        spellGroups:[],
        secondKill:[],
        pages:[
            {   title:'店铺首页',
                key:'home',
                icon:require('../assets/staticIcon/homeUp.png'),
                selectIcon:require('../assets/staticIcon/homeDown.png'),
            },
            {title:'机台自提',
                key:'market',
                icon:require('../assets/staticIcon/activityUp.png'),
                selectIcon:require('../assets/staticIcon/activityDown.png'),
            },
            {
                title:'个人中心',
                key:'user',
                icon:require('../assets/staticIcon/userUp.png'),
                selectIcon:require('../assets/staticIcon/userDown.png'),
            }
        ],
        visible_addCart:false
    },
    subscriptions: {
        setup({dispatch, history}) {
            history.listen(locations => {
                const pathname = location.pathname;
                const action = pathToRegexp('/micro/home').exec(pathname);
                if(action || pathname == '/micro' ){
                   // dispatch({type: 'fetchHotItems', did:action[1]})
                    //setAccessDeviceId(action[1]);

                    dispatch({type: 'fetchPage',preview:locations.query.preview})

                   // dispatch({type: 'activity/fetchMarketing', did:action[1]})
                }
                if(pathname == '/micro/' && specifiedMachine()){
                    const id = locations.query.deviceId;
                    dispatch({type: 'fetchDevicesItems',deviceId:id})
                }
            })
        }
    },
    effects: {

        *fetchPage({preview,notHome}, {call, put}) {
            yield put({type:'fetchRequest'})
            let operator_id = getAccessOperatorId();
            if(!operator_id){
                operator_id =  '836ed2a4eb534ba7a4e79df2bd61c959';
                setAccessOperatorId(operator_id);
            }
            const payload = {operator_id};
            const data = yield call(request, api +'store/page', {method: 'get', body: parse(payload)});
            Toast.hide();
            let page_c = preview ? data.demo : data.page;

            if(!data.code){
                let page = page_c && page_c !== 'object' && JSON.parse(page_c);
                page = page instanceof Array  ? page : [];
                const products = page.filter(item => item.type=='products');
                const historyHot = page.filter(item => item.type=='historyHot');
                const secondKill = page.filter(item => item.type=='secondKill');
                const spellGroup = page.filter(item => item.type=='spellGroup');
                const preProduct = page.filter(item => item.type=='preProduct');
                if(!notHome){
                    if(products.length > 0){
                        yield put({type: 'fetchCategories'});
                        yield put({type: 'fetchCategoriesItems', index:0})
                    }
                    if(historyHot.length > 0){
                        yield put({type: 'fetchHotItems'})
                    }
                    if(preProduct.length > 0){
                        yield put({type: 'fetchBookItems'})
                    }

                    if(spellGroup.length > 0 && spellGroup[0].way === 2){
                        const {number,type} = spellGroup[0];

                        yield put({type: 'fetchMarketing',marketing_type:type,number})
                    }
                    if(secondKill.length > 0 && secondKill[0].way === 2){
                        const {number,type} = secondKill[0];
                        yield put({type: 'fetchMarketing',marketing_type:type,number})
                    }
                }

            }

            yield put({type:'fetchPageResponse',config:data})

        },


        *fetchBookItems({page}, {call, put,select}) {
            yield put({type:'fetchRequest'});
            const data = yield call(request, api +'store/pre?operator_id='+getAccessOperatorId(), {method: 'get'});
            Toast.hide();
            if(data.code){
                Toast.fail(data.message, 1);
            }else{
                let {bookItems} = yield select(state => state.shop);
                if(page){
                    data.results.map(item =>{
                        bookItems.push(item);
                    })
                }
                else{
                    bookItems = data.results;
                }
                yield put({type:'fetchBookItemsResponse',bookItems,page:data.page,pages:data.pages,noMore:data.results.length == 0})
            }
        },

        *fetchHotItems({}, {call, put}) {
            yield put({type:'fetchRequest'});
            const data = yield call(request, api +'store/hot?operator_id='+getAccessOperatorId(), {method: 'get'});
            Toast.hide();
            if(data.code){
                Toast.fail(data.message, 1);
            }else{
                yield put({type:'fetchHotItemsResponse',hotItems:data})
            }

        },
        *fetchCategories({}, {call, put,select}) {
            yield put({type:'fetchRequest'});
            const data = yield call(request, api +'categories/', {method: 'get'});

            Toast.hide();
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
        *fetchCategoriesItems({index,id,order_by,asc,page}, {call, put,select}) {
            yield put({type:'fetchRequest'})
            yield put({type:'setStatus',currentCate:index})
            let url = api +'store/product/';
            let payload = {
                operator_id : getAccessOperatorId()
            }
            if(page){
                payload.page = page;
            }
            if(id){
                payload.category_id = id;
            }
            if(order_by){
                payload.order_by = order_by;
                if(asc){
                    payload.asc = asc;
                }
            }

            const data = yield call(request, url, {method: 'get',body:payload});
            let {cateItems} = yield select(state => state.shop);


            Toast.hide();
            if(data.code){
                Toast.fail(data.message, 1);

            }else{
                if(page){
                    data.results.map(item =>{
                        cateItems.push(item);
                    })
                }
                else{
                    cateItems = data.results;
                }

                yield put({type:'fetchCategoriesItemsResponse',cateItems:cateItems,page:data.page,pages:data.pages,noMore:data.results.length == 0})
            }
        },
        *fetchMarketing({marketing_type,number}, {call, put}) {
            yield put({type:'fetchRequest'})
            let url = api +'store/marketing?operator_id='+getAccessOperatorId();
            if(marketing_type){
                const m_type =  marketing_type == 'spellGroup' ? 'group' : 'discount';
                url += '&marketing_type=' + m_type;
            }
            if(number){
                url += '&per_page=' + number;
            }
            const data = yield call(request, url, {method: 'get'});
            Toast.hide();
            if(data.code){
                Toast.fail(data.message, 1);
            }else{
                data.m_type = marketing_type;
                yield put({type:'fetchMarketingResponse',data,marketing_type})
            }

        },
        *fetchDevicesItems({deviceId}, {call, put}) {
            const data = yield call(request, api + 'devices/'+deviceId+'/items/', {method: 'get', body: {}, isToken: false})
            yield put({type:'fetchCategoriesItemsResponse',cateItems:data.items})
        },
    },
    reducers: {
        fetchRequest(state,action){
            Toast.loading('正在加载中...',0);
            return{...state,...action};
        },
        setStatus(state,action){
            return{...state,...action};
        },
        fetchCategoriesResponse(state,action){

            return{...state,categories:action.categories};
        },
        fetchCategoriesItemsResponse(state,action){
           // console.log(action.cateItems.items)

            return{...state,cateItems:action.cateItems,Item_Page:action.page,Item_Pages:action.pages,Item_noMore:action.noMore};
        },
        fetchPageResponse(state,action){



          //  new_menu[1].icon = require('../assets/staticIcon/activityUp.png');
           // new_menu[1].selectIcon = require('../assets/staticIcon/activityDown.png');


          // alert(JSON.stringify(action.config));
            if(action.config.code){
                Toast.fail(action.config.message, 1);
                return {...state, loading: false, config: []}
            }else {
                const {menu} = action.config;
                const new_menu = JSON.parse(menu);

                const pages = [
                    {   title:'店铺首页',
                        key:'home',
                        icon:require('../assets/staticIcon/homeUp.png'),
                        selectIcon:require('../assets/staticIcon/homeDown.png'),
                    },
                    {title:'机台自提',
                        key:'market',
                        icon:require('../assets/staticIcon/activityUp.png'),
                        selectIcon:require('../assets/staticIcon/activityDown.png'),
                    },
                    {
                        title:'个人中心',
                        key:'user',
                        icon:require('../assets/staticIcon/userUp.png'),
                        selectIcon:require('../assets/staticIcon/userDown.png'),
                    }
                ]
                new_menu.map((item,i) => {
                    // item.title = item.name;
                    // item.icon = item.img;
                    // item.selectIcon =  item.imgActive;

                    pages[i].title = item.name || pages[i].title;
                    pages[i].icon = ImgUrlChange( item.img) || pages[i].icon;
                    pages[i].selectIcon = ImgUrlChange( item.imgActive) || pages[i].selectIcon;
                    // return item
                })
                return {...state, config:action.config,pages:pages};
            }
        },
        fetchHotItemsResponse(state,action){
            return {...state, hotItems:action.hotItems.results};
        },
        fetchBookItemsResponse(state,action){
            const {bookItems,page,pages,noMore} = action;
            return {...state, bookItems:bookItems,bookItem_Page:page,bookItem_Pages:pages,bookItem_noMore:noMore};
        },
        fetchMarketingResponse(state,action){


            if(action.marketing_type == 'secondKill'){
                return {...state, secondKill:action.data};
            }
            else{
                return {...state, spellGroups:action.data};
            }
        },
    },
}