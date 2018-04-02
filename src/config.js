import { browserHistory } from 'dva/router'

const common = { 
    history: browserHistory,
    //image_cloud: 'http://web.file.myqcloud.com/files/v1/10053145/saiyao/v1/images/',
    image_cloud: 'http://up-z2.qiniu.com/',
    image_cloud_url: 'http://or7yq6py3.bkt.clouddn.com/',
}

const config = {
    development: {
       // api:'http://d932f2a0.ngrok.io/v2/',
      // api: 'http://192.168.2.105:5000/v2/',
      //api: 'https://api.saiyaoyun.com/rc/',
       api: 'http://192.168.2.111:5020/v2/',
        redirect: 'https://shop.saiyaoyun.com/micro/order',
        api_card: 'https://api.saiyaoyun.com/v2/bind/wx/',
        //api_card: 'http://192.168.2.111:5020/v2/bind/wx/',
        redirect_card: 'https://api.saiyaoyun.com/cards/',
        //redirect_card: 'http://192.168.2.111:5020/v2/',
        //api_card: 'https://api.saiyaoyun.com/v2/bind/wx/',
        //redirect_card: 'https://api.saiyaoyun.com/v2/',
    },
    production: {
        api: 'https://api.saiyaoyun.com/rc/',
        redirect: 'https://shop.saiyaoyun.com/micro/order',
        api_card: 'https://api.saiyaoyun.com/v2/bind/wx/',
        redirect_card: 'https://api.saiyaoyun.com/cards/',
    },
}

const mode = process.env.NODE_ENV || 'development'
const result = {...common, ...config[mode]}
export default result