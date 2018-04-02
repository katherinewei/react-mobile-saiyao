import React from "react";
import {Flex,Button,Modal,Icon,Toast } from 'antd-mobile';
import {Link} from "dva/router";
import styles from './cards.less';
import {connect} from "dva";
import { history } from '../config'
import { createForm } from 'rc-form';
import {getPrice,getString} from '../utils/helper'
import Spin from '../components/Spin'
import Record from '../components/Record';
import CustomIcon from '../components/CustomIcon'
const Cards =({dispatch,card:{visible,list,loading,jsdk_config,hasConfiguration,hasRegister}}) =>{

    function showModal() {
        if(list.deposit){
            localStorage.removeItem('tips');
        } else{
            localStorage.setItem('tips', 2);

        }
        dispatch({type:'card/showModal'});
    }
    function hideModal() {
        dispatch({type:'card/hideModal'});
    }
    function deposit() {
        dispatch({type:'card/recharge'});
    }

    function Tip() {

        location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzIxMTQyOTI0OQ==&scene=110#wechat_redirect'
        // Toast.success(`您已成功领取${getString('title')}的会员卡`);
        // dispatch({type:'card/setQuest',hasRegister:false});
    }

    function getUnread() {
        let flag = localStorage.getItem('tips');
        flag =  flag == '1';
        return flag;
    }

    if(hasRegister){
        sessionStorage.setItem('hasRegister',1);
        localStorage.setItem('tips',1);
    }

    if(list.deposit && localStorage.getItem('tips') == '2'){
        localStorage.setItem('tips',1);
    }

    if(jsdk_config.params && document.getElementById('scanCard')){
        document.getElementById('scanCard').onclick = function(){
        if(hasConfiguration){
            dispatch({type:'card/setQuest',hasConfiguration:false})
            let params = jsdk_config.params;
            wx.config({
                debug: false,
                appId: params.appId,
                timestamp:  params.timestamp,
                nonceStr: params.nonceStr,
                signature: params.signature,
                jsApiList: ['scanQRCode']
            });
        }
        wx.ready(function() {
            wx.hideOptionMenu();
                    wx.scanQRCode({
                        desc: 'scanQRCode desc',
                        needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                        success: function (res) {
                            // 回调
                        },
                        error: function(res){
                            if(res.errMsg.indexOf('function_not_exist') > 0){
                                alert('版本过低请升级')
                            }
                        }
                    });
        });
        wx.error(function(res) {
            alert('wx error: ' + res);
        });
        }
    }
    const depositTxt = list.deposit ? <div><p>1、请致电客服：<span>020 39186047</span>   申请押金退还服务；</p><p> 2、申请成功后，将在  <span>7 个工作日</span>   内返还卡上押金到您的微信账号上；</p><p>3、押金返还仅限会员卡押金，不包括会员卡上的余额；</p></div> :  <div><p>1、押金充值用于无人超市开门服务。</p><p>2、押金能使客户购物时进行透支，透支额度不得超过超过押金。</p><p>3、充值余额后，余额会自动抵扣透支的金额。 </p><p>4、若不充值余额，直接申请退还押金，返回的押金将是抵扣透支金额后的余额。</p></div>;

    const ewm = require('../assets/staticIcon/ewm.jpg');
    return (
        <div className={styles.cardList}>
           <div className={styles.card}>

                        <div key={1} className={styles.cards} style={{backgroundImage: `url(/${require("../assets/staticIcon/bgCard3.png")})`}}>
                       {/*<Link to="/record/consumption" className={styles.cardsA}>*/}
                           <div className={styles.rowText}>
                               <h3>{getString('title')} <span className={styles.more} onClick={() => showModal()}><CustomIcon type={require('../assets/svgDirs/more.svg')}/>{getUnread() &&  <b/>}</span></h3>
                               <p className={styles.cno}>No.{list.cno}</p>
                               <Flex className={styles.msg} align="stretch">
                                   <Flex.Item >
                                       <div>
                                          <span className={styles.balance}>{getString('cards_balance')}：￥{getPrice(list.balance)}</span>
                                           <Link to="/cards/recharge"  className={styles.recharge}><Button  className={styles.btn} type="primary" size="small" inline >{getString('cards_recharge')}</Button></Link>

                                       </div>
                                       </Flex.Item>
                               </Flex>

                           </div>
                           <p className={styles.scan} id="scanCard" > <CustomIcon type={require('../assets/svgDirs/scan.svg')}/><span>{getString('cards_scan')}</span></p>

                        {/*</Link>*/}
                       </div>
           </div>
            <div className="whitespace"></div>
            <div className={styles.myRecord}>
                <p className={styles.title}>{getString('record_my')}</p>
                <Record />
            </div>

            <Modal
                transparent
                maskClosable={true}
                visible={visible}
                className='modalBody'
                closeable={false}
                style={{width:'70%'}}
                onClose={()=> hideModal()}
            >
               <div className={styles.pop}><div className={styles.iconTit}></div><Icon onClick={()=> hideModal()} className={styles.close} type="cross" /> <div className={styles.content}><h3>{getString('cards_deposit',list.deposit ? getString('cards_back') : getString('cards_recharge'))}</h3>{depositTxt}</div><div className={styles.footer}><span>押金：￥{list.deposit ? '300.00' : '0.00'}</span><Button  onClick={()=> list.deposit ? hideModal() : deposit()}  className={styles.btn} type="primary" size="small" inline >{getString(list.deposit ?  'i_know' : 'cards_recharge' )}</Button></div> </div>

            </Modal>


            <Modal
                transparent
                maskClosable={true}
                visible={hasRegister}
                className='modalBody'
                closeable={false}
                style={{width:'70%'}}
            >
                <div className={styles.pop +' ' + styles.popEwm}><div className={styles.iconTit}></div><Icon onClick={()=> hideModal()} className={styles.close} type="cross" /> <div className={styles.content}><img src={'/' + ewm} /> <p>长按识别关注</p></div><div className={styles.footer}><Button  onClick={()=>  Tip()}  className={styles.btn} type="primary" size="small" inline >马上关注</Button></div> </div>

            </Modal>

        </div>
    )
}
export default createForm()(connect(({card}) => ({card}))(Cards))