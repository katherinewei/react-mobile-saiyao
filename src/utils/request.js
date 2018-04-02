import fetch from "dva/fetch";
import { Toast } from "antd-mobile";
import config from '../config'
import { loadValidator, getAccessToken } from '../models/validator'
import {getString,GetQueryString} from './helper'

const BASE_URL = config.api

function generateUrl(url) {
    if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
        return url;
    }
    return joinUrl(BASE_URL, url);
}

function joinUrl(host, spec) {
    return host + spec;
}

function queryUrl(url, items) {
    let str = [];
    for (let key in items) {
        if (items.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key) + '=' + encodeURIComponent(items[key]));
        }
    }
    const query = str.join('&');
    if (query.length > 0) {
        return url + '?' + query;
    }
    return url;
}

function parseJSON(response) {
    nowTime =  response.headers.get('Server-Time');
    return response.json();
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;

    throw error;
}

/**
 * 网络连接失败
 */
function errorRequest(err) {
    //alert(err)
    Toast.fail('网络请求失败:' + err);
}

function getTargetUrl(url) {
    if (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'))) {
        return url
    }
    const key = typeof url === 'object' ? url.key: url
    let validator = loadValidator()
    const template = validator[key]
    if (template && typeof url === 'object' && url.args.length > 0) {
        return getString(template, ...url.args)
    }
    return template
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export async function request(url, items) {
    let target = getTargetUrl(url)
    let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    if (items.isToken === undefined || items.isToken) {
        let token = getAccessToken()
        if(!token){
            token = GetQueryString('token')
        }
        headers.Authorization = 'JWT ' + token;
    }
    headers = {...headers, ...items.headers};
    let data = {
        method: items.method,
        headers,
    };
    if (items.body) {
        if (data.method === 'post' || data.method === 'put') {
            if (items.body instanceof FormData) {
                data.body = items.body
                delete headers['Content-Type']
            } else {
                data.body = JSON.stringify(items.body || {});
            }
        } else {
            target = queryUrl(target, items.body);
        }
    }

    return fetch(target, data)
        .then(checkStatus)
        .then(parseJSON)
        .then((data) => (data))
        .catch((err) => (errorRequest(err)));
}
