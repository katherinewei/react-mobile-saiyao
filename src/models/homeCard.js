import { initWeiXinConfig} from '../utils/helper'
import {setAccessOpendId, getAccessOpendId,getAccessSN,setAccessSN} from '../models/validator'
import {api} from "../config";
export default {     
    namespace: 'homeCard',
    state: {

    },
    subscriptions: { 
        setup({dispatch, history}) {
            history.listen(location => {

                 //设置sn
                if(location.pathname.indexOf('/cards') >  -1){

                    //document.title = '宝达易购';

                    if(location.pathname.indexOf('/register') > -1 ){
                        if(location.query.sn){
                            setAccessSN(location.query.sn)
                        }else{
                            const token = getAccessSN();
                            if(!token){
                                window.location.href =  '/cards/register';
                            }
                        }
                    }
                    //设置openid
                    if(location.query.openid){
                        setAccessOpendId(location.query.openid)
                    }else{
                        const token = getAccessOpendId();
                        if(!token){
                            window.location.href =  '/cards/register';
                        }
                    }
                }
                initWeiXinConfig();
            })
        }
    },
    effects: {

    },
    reducers: {
       
    },
}
