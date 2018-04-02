import { request } from "../utils/request";
import {parse} from "qs";
import { Toast } from 'antd-mobile';
import {api, history,api_card} from "../config";
import {getAccessOperatorId,getAccessDeviceId,getAccessToken} from './validator'

export default { 
    namespace: 'devices',
    state: {
        loading: false,
        devices: [],
        nearby_Devices: [],
        current: 'history',
        oid:'',
        currentDevice:{},
        visible:false
    },
    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
                let query = location.query;

                //const action = pathToRegexp('/micro/market/classified/:deviceId').exec(location.pathname);
                if (location.pathname === '/micro/market/' || location.pathname === '/micro/market' || location.pathname === '/micro/market/home' || location.pathname.indexOf('market/classified') > -1) {

                    localStorage.setItem('entry','devices');
                    dispatch({type: 'shop/fetchPage',notHome:true})

                    dispatch({
                        type: 'fetchDevicesItems'
                    });

                    if(query && (query.oid)){
                        dispatch({
                            type: 'setQuery',oid: getAccessOperatorId()
                        });
                    }
               }
                let saveTokenTime = localStorage.getItem('saveTokenTime');
                console.log( getAccessOperatorId() , getAccessToken() , (saveTokenTime , new Date().getTime() - saveTokenTime < 5 * 24 * 60 * 60 * 1000))
                if ((location.pathname === '/micro/market/' || location.pathname === '/micro/market' || location.pathname === '/micro/market/home' || location.pathname.indexOf('market/classified') > -1)) {

                    if(!sessionStorage.getItem('nearby_Devices_service')){

                        // dispatch({
                        //     type: 'fetchNearbyDevicesItems',
                        //     payload: {
                        //         longitude: '113.333243',
                        //         latitude: '22.995782',
                        //     },
                        // });
                        let url = encodeURI(window.location.href);
                        let payload = {url};
                        dispatch({type: 'fetchWXSDK',payload,dispatch})
                    }
                    else{
                        dispatch({type: 'fetchDevicesItemsService'})
                    }
                }
            })
        }
    },
    effects: {
        *fetchWXSDK({payload,dispatch}, {call, put}) {
            const data = yield call(request, api_card + 'jsdk_config', {method: 'get', body:payload });
            let params = data.params;

            wx.config({
                // debug: true,
                appId: params.appId,
                timestamp:  params.timestamp,
                nonceStr: params.nonceStr,
                signature: params.signature,
                jsApiList: ['openLocation','getLocation']
            });
            wx.ready(function() {
                Toast.loading('正在获取定位',0);
                wx.getLocation({
                    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: function (res) {
                        Toast.hide();
                        const latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                        const longitude = res.longitude ; // 经度，浮点数，范围为180 ~ -180。
                       // alert(latitude);
                        dispatch({
                            type: 'fetchNearbyDevicesItems',
                            payload: {
                                longitude: longitude,
                                latitude: latitude
                            },
                        });
                    },
                    fail:function (err) {
                        Toast.fail("位置服务被拒绝,请确保允许微信获取定位",2);
                        alert(' ' + JSON.stringify(err));
                    }
                });
                wx.error(function(res) {
                  //  alert('wx error: ' + res);
                });
            })
        },
        *fetchNearbyDevicesItems({payload}, {call, put,select}) {
           yield put({type: 'fetchItemsRequest'})
           // let oid = yield  select(state => state);
            payload.oid = getAccessOperatorId();
           // payload.ignore = oid.devices.ignore;
            const data = yield call(request, api + 'devices/', {method: 'get', body: parse(payload), isToken: false});
            Toast.hide();

            yield put({type: 'fetchNearbyItemsResponse', nearby_Devices: data})
        },

        *fetchDevicesItems({}, {put}) {         
            var nearby_Devices  = localStorage.getItem('nearby_Devices')
            const devices = nearby_Devices ? JSON.parse(nearby_Devices) : []

            yield put({type: 'fetchDevicesItemsResponse', devices, current: 'history',})
        },
        *fetchDevicesItemsService({}, {put}) {
            var nearby_Devices  = sessionStorage.getItem('nearby_Devices_service');
            const devices = nearby_Devices ? JSON.parse(nearby_Devices) : [];
            yield put({type: 'fetchNearbyItemsResponse', nearby_Devices: devices})
        }
    },
    reducers: {
        setQuery(state, action){
            return {...state, ...action}
        },
        fetchItemsRequest(state) {
            Toast.loading('正在加载中...',0);
            return {...state, loading: true}
        },
        fetchNearbyItemsResponse(state, action) {
            if (action.nearby_Devices.code) {
                Toast.fail('加载失败!!!'+ action.nearby_Devices.code, 1);
                return {...state, loading: false, device: []}
            } else {
               // console.log(action.nearby_Devices)
                //sessionStorage.setItem('currentDevice',JSON.stringify(action.nearby_Devices.device[0]));

                const DeviceId = getAccessDeviceId();
                let devices =  action.nearby_Devices;
                sessionStorage.setItem('nearby_Devices_service',JSON.stringify(devices));
                let currentDevice = devices[0];
                if(DeviceId){
                    devices.device.map(item => {
                        if(item.object_id == DeviceId){
                            currentDevice = item;
                        }
                    })
                }

                return {...state, loading: false, nearby_Devices: devices,currentDevice}
            }
        },
        fetchDevicesItemsResponse(state, action) {
            return {...state, devices: action.devices, current: action.current}
        },
    },
}
