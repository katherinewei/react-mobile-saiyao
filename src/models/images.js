import {request} from "../utils/request";
import {Toast} from "antd-mobile";
import {getString, getReplUrl} from '../utils/helper'
import {image_cloud_url, image_cloud} from '../config'
import { loadValidator } from './validator'
import {api,history} from "../config";

export default {
    namespace: 'images',
    state: { 
        loading: false,
        images: {},
    },
    subscriptions: {},
    effects: {
        *uploadImage({payload, url, uid, onUpload}, {call, put}) {
            yield put({type: 'uploadImageRequest'});
            /**
             * 七牛上传模块
             * @type {Number|number}
             */
            let index = url.lastIndexOf("\/");
            //let validator = loadValidator();
           // let template = validator['image_token_url'];
            let token_url = url.substring(index + 1, url.length);


            let data = yield call(request, api +'images/token/?file='+token_url, {method: 'get'});
            if (data.code) {
                Toast.fail(data.code+':'+data.message);
               // yield put({type: 'uploadImageResponse', uid, data})
                return
            }


            if(data.is_exist === true){
                onUpload(uid, image_cloud_url + url.substring(index + 1, url.length))
                yield put({type: 'uploadImageResponse', uid, data})
            }else{
                payload.append('key', url.substring(index + 1, url.length));
                payload.append('token', data.token);

                let uploadData = yield call(request, url, {method: 'post', body: payload, isToken: false});

                if(uploadData.key){
                    onUpload(uid, image_cloud_url + url.substring(index + 1, url.length))
                    yield put({type: 'uploadImageResponse', uid, data})
                }else{
                    Toast.fail('上传失败');
                    //return
                }
            }
            /**
             * 腾讯云上传模块
             */
            // const data = yield call(request, 'image_token_url', {method: 'get'})
            // if (data.code) {
            //     yield put({type: 'uploadImageResponse', uid, data})
            //     return
            // }
            // const headers = {Authorization: data.upload_token}
            // yield put({type: 'fetchImage', payload, url, headers})
            // const uploadData = yield call(request, url, {method: 'post', headers, body: payload, isToken: false})
            // /**
            //  * 2017/06/08
            //  * 判断上传图片是否成功
            //  */
            // if(uploadData.code == '-177'){
            //     var index = url.lastIndexOf("\/");
            //     onUpload(uid, image_cloud_url+ url.substring(index + 1, url.length))
            // } else if (uploadData && uploadData.data && uploadData.data.access_url) {
            //     onUpload(uid, uploadData.data.access_url)
            // }else{
            //     message.error(getString(uploadData.code || 'unknown'))
            // }
            // yield put({type: 'uploadImageResponse', result: uploadData, uid})
            // if (uploadData && uploadData.data && uploadData.data.access_url) {
            //     onUpload(uid, uploadData.data.access_url)
            // }
            // yield put({type: 'fetchImage', payload, url, headers})
            // const queryData = yield call(request, url, {method: 'get', headers, body: {op: 'stat'}, isToken: false})
            // if (queryData && queryData.data && queryData.data.access_url) {
            //     yield put({type: 'uploadImageResponse', result: queryData, uid})
            //     onUpload(uid, queryData.data.access_url)
            // } else {
            //     const uploadData = yield call(request, url, {method: 'post', headers, body: payload, isToken: false})
            //     yield put({type: 'uploadImageResponse', result: uploadData, uid})
            //     if (uploadData && uploadData.data && uploadData.data.access_url) {
            //         onUpload(uid, uploadData.data.access_url)
            //     }
            // }
        },
    },
    reducers: {
        uploadImageRequest(state) {
            Toast.loading('正在上传中...');
            return {...state, loading: true}
        },
        uploadImageResponse(state, action) {
            // if (action.result && action.result.data) {
            //     let images = {...state.images};
            //     images[action.uid] = action.result.data.access_url;
            //     return {...state, loading: false, images}
            // } else {
            //     Toast.fail(getString(action.result && action.result.code || 'unknown'));
            //     return {...state, loading: false}
            // }
            Toast.hide();
            return {...state, loading: false}
        },
    },
}