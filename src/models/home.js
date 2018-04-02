import {setAccessToken, getAccessToken,setAccessDeviceId,getAccessOperatorId,setAccessOperatorId} from '../models/validator'
import {api} from "../config";
import pathToRegexp from 'path-to-regexp'
import {specifiedMachine} from '../utils/helper'
export default {     
    namespace: 'home',
    state: {
        cartNum:0
    },
    subscriptions: { 
        setup({dispatch, history}) {
            history.listen((locationMy) => {
                 //设置token
                const devices = location.pathname.indexOf('/micro/market') > -1;
                if(locationMy.pathname.indexOf('/micro') > -1){

                    let pathname = location.href;
                    const path = locationMy.query;
                    pathname = pathname.split('?')[0];
                    if(path &&  path.deviceId){         //线上
                        setAccessDeviceId(path.deviceId);
                        pathname = pathname + '?deviceId='+path.deviceId;
                    }
                    if(path &&  path.oid){     //多个机台
                        // sessionStorage.setItem('IsOperation',true);
                        path.oid && setAccessOperatorId(path.oid);
                        pathname = pathname + '?oid='+path.oid;
                    }

                    if(path &&  path.fixed){     //特定机台
                        sessionStorage.setItem('specifiedMachine',true)
                    }

                    if(path &&  path.preview){     //预览
                        pathname += '&preview=1'
                    }

                    //let saveTokenTime = localStorage.getItem('saveTokenTime');

                    if(path.token && !(getAccessToken() && getAccessToken() === path.token)){

                        localStorage.setItem('saveTokenTime',new Date().getTime());
                        setAccessToken(path.token);
                    }

                    let saveTokenTime = localStorage.getItem('saveTokenTime');



                     if(!getAccessToken() || !saveTokenTime || (saveTokenTime && new Date().getTime() - saveTokenTime > 5 * 24 * 60 * 60 * 1000)) {
                        setTimeout(()=>{
                            location.href = api + 'bind/micro_shop/?redirect_url='+encodeURIComponent(pathname);
                        },100)
                    }
                    //else{
                        let time = localStorage.getItem('cartTime');
                        let entry = localStorage.getItem('entry');
                        if(time){
                            time = JSON.parse(time);
                        }
                        const deviceIdOnline = location.pathname == '/micro'  || location.pathname == '/micro/home';

                        if(deviceIdOnline) {
                            localStorage.setItem('entry', 'device');
                        }
                        if(devices){
                            localStorage.setItem('entry', 'devices');
                        }
                        if(time && ((time.time  && new Date().getTime() - time.time >= 12*60*60*1000) || (time.source && time.source !== entry))){
                            localStorage.removeItem('cart');
                            localStorage.removeItem('cartOnline');
                        }
                   // }
                }
                let num = devices || specifiedMachine() ? localStorage.getItem('cart') : localStorage.getItem('cartOnline');
                dispatch({type:'getCartNum',cartNum: num ? JSON.parse(num).length : 0});
            })
        }
    },
    effects: {

    },
    reducers: {
       getCartNum(state,action){
           return{...state,...action}
       }
    },
}
