import React from "react";
import { Badge,Icon, Card, WhiteSpace, Result,Modal} from 'antd-mobile';
import styles from './Vendings.less';
import style from './index.less'
import Spin from '../components/Spin';
import {connect} from "dva";
import {Link} from "dva/router";
import { history } from '../config';
import ProductList from './List'
import ShowDevices from '../components/showDevices'
import {setAccessDeviceId} from '../models/validator'

const Classified = ({dispatch,home:{cartNum}, devices:{ nearby_Devices, current,currentDevice,visible}, items:{loading}}) => {


    function onDevicesClick() {

        dispatch({type:'devices/setQuery',visible:true})

    }

    function onHandleClick(device) {
        let nearby_Devices  = localStorage.getItem('nearby_Devices')
        setAccessDeviceId(device.object_id);
        if (!nearby_Devices) {
            let deviceItem = []
            deviceItem.push(device);
            localStorage.setItem('nearby_Devices', JSON.stringify(deviceItem))
        }else{
            nearby_Devices  = JSON.parse(localStorage.getItem('nearby_Devices'))
            let deviceItem = [];
            deviceItem.push(device)
            for(let i in nearby_Devices) {
                if(nearby_Devices[i].object_id == device.object_id){
                }else{
                    deviceItem.push(nearby_Devices[i])
                }
            }
            if(deviceItem.length > 2){
                deviceItem.pop();
            }
            localStorage.setItem('nearby_Devices', JSON.stringify(deviceItem))
        }

        history.push("/micro/market/classified/" +device.object_id);

        // dispatch({type: 'items/fetchDevicesItems', deviceId: device.object_id})
        dispatch({type: 'devices/setQuery', currentDevice: device})
        localStorage.removeItem('cart');
        dispatch({type:'home/getCartNum',cartNum: 0});
        onClose();

    }

    function onClose() {
        dispatch({type:'devices/setQuery',visible:false})
    }

    const logo = require('../assets/staticIcon/vendingLogo.png');
    const placeholderLogo = require('../assets/staticIcon/placeholderLogo.png');

    const actionprops = {
        dispatch,
        nearby_Devices,
        current,
        visible,
        onHandleClick,
        onClose
    }
    return (
        <div>
            {
                loading == true ? <Spin /> : ''
            }

            <div className={styles.devicesContent}  onClick={()=> onDevicesClick()}><span>{currentDevice && currentDevice.name}<Icon type="down" size="xxs" /></span></div>

            <ProductList />
            <Link className={style.positionCartStyle} to="/micro/cart"><b  dangerouslySetInnerHTML={{__html: '&#xe641;'}} /><Badge text={cartNum} hot /></Link>

            <ShowDevices {...actionprops}/>

        </div>
    )
}

export default connect(({items,home,devices}) => ({items,home,devices}))(Classified)
