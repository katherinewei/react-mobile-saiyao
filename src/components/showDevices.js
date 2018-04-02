import React from "react";
import { Icon, Card, WhiteSpace, Result,Modal} from 'antd-mobile';
import styles from '../routes/Vendings.less';
import { history } from '../config';

const Devices = ({dispatch, nearby_Devices, current,visible,onHandleClick,onClose}) => {


    const showDevice = () => {

        const nearbyLogoImgUrl = require('../assets/staticIcon/nearbyVendingLogo.png');
        const imgUrl = require('../assets/staticIcon/vendingLogo.png');
        let nearbyData = nearby_Devices.device;
        const currentText = current == 'history' ?  '最近使用' : '搜索';
        const currentResultText = current == 'history' ?  '暂无历史记录' : '没有找到相关的机台';
        //dispatch({type: 'devices/fetchDevicesItems'})
        let history_Devices  = localStorage.getItem('nearby_Devices')
        history_Devices = history_Devices ? JSON.parse(history_Devices) : [];
        return  <div style={{marginTop: '20px'}}>
                <span
                    style={{
                        position: 'absolute', right: 12, top: 10,color:'#999',border: '1px solid #999',borderRadius:'50%'
                    }}
                    onClick={() => onClose()}
                >
                    <Icon type="cross" />
                  </span>
            <div className={styles.navItemContainerStyle}>
                <div className={styles.navContentNearbyStyle}>
                    <img src={'/'+nearbyLogoImgUrl} className={styles.nearbyVendingLogoStyle}/><span
                    className={styles.nearbyVendingTextStyle}>{currentText}</span>
                </div>
            </div>
            <WhiteSpace size="sm" />

            <Card full>
                {history_Devices.length ? history_Devices.map((device) => (
                        <Card.Body key={device.object_id}>
                            <div className={styles.vendingInfoContentStyle} onClick={()=> onHandleClick(device)}>
                                <div className={styles.imgContainerStyle}>
                                    <img src={'/'+imgUrl} alt="" className={styles.imgStyle}/>
                                </div>
                                <div className={styles.textContainerStyle}>
                                    <div className={styles.vendingNameTextStyle}>
                                        {device.area}
                                    </div>
                                    <div className={styles.addressTextStyle}>{device.address}</div>

                                    <div className={styles.distanceAndTextStyle}>
                                        <span className={styles.textStyle}>N0. {device.number}</span>
                                    </div>

                                    <div className={styles.nameTextStyle}>
                                        商户名: {device.name}
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    )):
                    <Result
                        imgUrl="https://zos.alipayobjects.com/rmsportal/NRzOqylcxEstLGf.png"
                        title={currentResultText}
                    />
                }
            </Card>
            <WhiteSpace size="sm" />
            <div className={styles.navItemContainerStyle}>
                <div className={styles.navContentNearbyStyle}>
                    <img src={'/'+nearbyLogoImgUrl} className={styles.nearbyVendingLogoStyle}/><span
                    className={styles.nearbyVendingTextStyle}>附近机台</span>
                </div>
            </div>
            <WhiteSpace size="sm" />

            <Card full>
                {nearbyData ? nearbyData.map((device) => (
                        <Card.Body key={device.object_id}>
                            <div className={styles.vendingInfoContentStyle} onClick={()=> onHandleClick(device)}>
                                <div className={styles.imgContainerStyle}>
                                    <img src={'/'+imgUrl} alt="" className={styles.imgStyle}/>
                                </div>
                                <div className={styles.textContainerStyle}>
                                    <div className={styles.vendingNameTextStyle}>
                                        {device.area}
                                    </div>
                                    <div className={styles.addressTextStyle}>{device.address}</div>
                                    <div className={styles.distanceAndTextStyle}>
                                        <span className={styles.textStyle}>N0. {device.number}</span>
                                        <span className={styles.distanceTextStyle}>{device.distance}</span>
                                    </div>
                                    <div className={styles.nameTextStyle}>
                                        商户名: {device.name}
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    )):
                    <Result
                        imgUrl="https://zos.alipayobjects.com/rmsportal/NRzOqylcxEstLGf.png"
                        title="暂无附近机台"
                    />
                }
            </Card>
        </div>
    }

    return (
        <div>
            <Modal
                popup
                visible={visible}
                animationType="slide-up"
                maskClosable={false}
                className="showDeviceModal"
            >
                {showDevice()}
            </Modal>
        </div>
    )
}

export default Devices
