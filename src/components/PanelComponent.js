import React from "react";
import { Modal } from 'antd-mobile';
import styles from './PanelComponent.css'
import { getQRImage } from '../utils/helper'

const Panel = React.createClass({

    render() {
        let imgUrl = getQRImage(this.props.pick_number)
        return (
            <div style={{display: this.props.visible}}>
                <Modal
                    transparent
                    onClose={this.props.onClose}
                    visible={this.props.visible}
                    closable={true}
                >
                    <div className = {styles.constentStyle}>

                        <div className = {styles.contentContainerStyle}>
                            <div className={styles.containerStyle}>
                                <div className={styles.positionContainerStyle}>
                                    <div className={styles.vendingNameContainerStyle}>
                                        <div className={styles.positionImgStyle}
                                             dangerouslySetInnerHTML={{__html: '&#xe632;'}}/>
                                        <span className={styles.areaStyle}>{this.props.device.area}</span>
                                    </div>
                                    <div className={styles.addressContainerStyle}>
                                        <span className={styles.addressStyle}>{this.props.device.address}</span>
                                    </div>
                                </div>
                                <div className={styles.imgContainerStyle}>
                                    <img src={imgUrl} alt="" className={styles.imgStyle}/>
                                </div>
                                <span className={styles.pickNumberContainerStyle}>{this.props.pick_number}</span>
                                <span className={styles.pickTextStyle}>{'扫描二维码提货'}</span>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    },
});
export default Panel;