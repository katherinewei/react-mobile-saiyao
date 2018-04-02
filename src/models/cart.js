import {specifiedMachine} from '../utils/helper'
import {setAccessToken, getAccessToken} from '../models/validator'
import {api} from "../config";


export default {
    namespace: 'cart',
    state: {
        checked:[],
        status:false,
        cart:[],
        nums:[],
        total:0,
        checkLength:0,
        checkedAll:false,
    },
    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {

                const pathname = location.pathname;
                if(pathname == '/micro/cart'){
                    const entry = localStorage.getItem('entry');
                   let cart = entry == 'devices' || specifiedMachine() ? localStorage.getItem('cart') : localStorage.getItem('cartOnline');
                    if(cart){
                        let localCart = JSON.parse(cart),checked = [];
                        dispatch({type:'getCart',cart:localCart})
                        for(let i in localCart){
                            checked.push(false);
                        }
                        dispatch({type:'setStatus',checked:checked})
                    }
                    dispatch({type:'setNums'})
                }
            })
        }
    },
    effects: {
        *setNums({}, {put,select}){
            const data  = yield select(state => state.cart.cart);
            let nums = [];
            data.map(item =>{
                nums.push(item.num);
            });
            yield put({type:'setNumsResponse',nums:nums})
        }
    },
    reducers: {
        setStatus(state,action){

            return{...state,...action};
        },
        setNumsResponse(state,action){

            return{...state,nums:action.nums};
        },
        getCart(state,action){
            return{...state,cart:action.cart};
        }
    },
}
