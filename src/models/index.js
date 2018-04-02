import {getString, initWeiXinConfig} from '../utils/helper'
import {setAccessToken, getAccessToken} from '../models/validator'
import {api} from "../config";


export default {
    namespace: 'index',
    state: {
        height:200,
    },
    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
                //设置token

            })
        }
    },
    effects: {

    },
    reducers: {
        setHeight(state,action){
            return{...state,...action};
        }
    },
}
