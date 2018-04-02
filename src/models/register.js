import { getAccessOpendId,getAccessSN} from '../models/validator'
import {api_card, history} from "../config";
import { request } from "../utils/request";
import {Toast} from 'antd-mobile'

export default {
    namespace: 'register',
    state: {
         hasErrors:[false,false],
         canClick:true,
         nextPage:false,
         name:'',
         hasRegister:false
    },
    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {

            })
        }
    },
    effects: {
        *register({payload}, {call,put}) {
            payload.openid = getAccessOpendId();
            payload.deviceSn = getAccessSN();
            const data = yield call(request, api_card + 'card_activate', {method: 'post', body: payload});
            if(data.code) {
                Toast.fail(data.message, 1);
            }else{
               yield put({type:'setQuest',hasRegister:true});
                location.href = '/cards/'+location.search+'&hasRegister=1';
                //location.href = 'https://api.saiyaoyun.com/v2/bind/?saiyao_action=MemberCard'
            }
        },
    },
    reducers: {
        setQuest(state,action){

            return {...state,...action}
        },

    },
}
