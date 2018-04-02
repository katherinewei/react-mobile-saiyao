import React from "react";
import {Button,List, Stepper ,Icon , Toast,Modal} from 'antd-mobile';
import {connect} from "dva";
import {Link} from 'dva/router'
import { getPrice,specifiedMachine } from '../utils/helper'
import style from '../routes/index.less'
import style_C from '../routes/classified.less';
import { history } from '../config'
const AddCart = ({dispatch,isBook,currentItem,btn_type,visible}) => {


    /**
     * 创建购物车
     * @param items
     */
    function onCartItemsClick(){
        var quantity = document.getElementsByClassName('am-stepper-input');
        const entry = localStorage.getItem('entry');

        const devices = entry == 'devices' || specifiedMachine();
        let item = currentItem;
        item.num = quantity[0].value;
        item.product_id = devices ? currentItem.object_id :currentItem.product_id
        item.stock = currentItem.num;

        // let item = {name:currentItem.name,img:currentItem.imgs,price:currentItem.price,num:quantity[0].value,product_id:devices ? currentItem.object_id :currentItem.product_id,stock:currentItem.num};
        // if(currentItem.start_time){
        //     item.start_time =
        // }
        if(btn_type === 'buy'){
            const order = [item];
            localStorage.setItem('order',JSON.stringify(order));
            let book = '';
            if(isBook){
                book = '?book=1'
            }
            const url = '/micro/orderformOnline'+book;
            //  history.push(url)
            window.location.href=url;

        }else {

            let flag = devices ? 'cart' : 'cartOnline';
            let cart = localStorage.getItem(flag);
            let data = [];
            if(cart){
                cart= JSON.parse(cart);
                let flag = true;
                //console.log(cart)
                cart.map(item=>{
                    if(item.name == currentItem.name){
                        item.num = quantity[0].value;
                        flag = false;
                        return
                    }
                })
                if(flag){
                    cart.push(item);
                }
                data = cart;
            }
            else{
                data.push(item);
            }
            dispatch({type:'home/getCartNum',cartNum:data.length})
            localStorage.setItem(flag,JSON.stringify(data));
            const cartInfo = {time:new Date().getTime(),source:entry};
            localStorage.setItem('cartTime',JSON.stringify(cartInfo));

            Toast.success('添加成功！',1);
        }
        onClose();
    }
    function onClose(){
        dispatch({type:'shop/setStatus',visible_addCart:false})
    }

    return <Modal
            popup
            visible={visible}
            animationType="slide-up"
            maskClosable={false}
            className="addCartModal"
        >
           <div>
            <List renderHeader={() => (
                <div style={{ position: 'relative',height:"0.4rem" }}>
                  <span
                      style={{
                          position: 'absolute', right: 3, top: -5,
                      }}
                      onClick={() => onClose('cancel')}
                  >
                    <Icon type="cross" />
                  </span>
                </div>)}
                  className="popup-list"
            >
            </List>
            <div className={style_C.muiCover}>
                <div className={style_C.summary}>
                    <div className={style_C.summaryImg}>
                        <img src={currentItem.imgs} alt="" className={style_C.imgs}/>
                    </div>
                    <div className={style_C.summaryMain}>
                        <div className={style_C.summaryName}>
                            <span>{currentItem.name}</span>
                        </div>
                        <div className={style_C.summaryPriceContainer}>
                            <span><span className={style_C.priceCode}>¥</span>{getPrice(currentItem.price)}</span>
                        </div>
                        <div className={style_C.stockControl}>
                            <span className={style_C.stock}><label className={style_C.stockName}>库存</label>
                                {currentItem.num}件
                            </span>
                        </div>
                    </div>
                    <div className={style_C.clearFix}></div>
                </div>
            </div>
            <List className={style_C.list} >
                <List.Item  className={style_C.listItem}  extra={
                    <Stepper
                        style={{ width: '100%', minWidth: '2rem' }}
                        showNumber max={currentItem.num} min={1} step={1} defaultValue={1}
                    />}
                >
                    数量
                </List.Item>
            </List>
            <Button type="primary" className={style_C.primaryClassifiedBut}  onClick={() => onCartItemsClick()}>确定</Button>
        </div>
         </Modal>

}
export default  connect(({shop}) => ({shop}))(AddCart)