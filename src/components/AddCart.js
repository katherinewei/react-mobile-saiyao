import React from "react";
import {Button,List, Stepper ,Icon , Toast,Modal} from 'antd-mobile';
import {connect} from "dva";
import {Link} from 'dva/router'
import { getPrice,specifiedMachine,timeStringFormat } from '../utils/helper'
import style from '../routes/index.less'
import style_C from '../routes/classified.less';
import { history } from '../config'
const AddCart = ({dispatch,items,type,position,visible}) => {

    function onItemsClick(){

        const cart =  localStorage.getItem('cart');
        if(specifiedMachine() && cart && JSON.parse(cart).length > 9){
            Toast.fail('购物车不得多于10件商品！');
            return;
        }
        if(items.start_time){
            const now = new Date();
            let now_date =  timeStringFormat(now.getTime() / 1000 ,'yyyy/MM/dd');
            console.log(now_date)
            if(new Date(now_date+' '+items.start_time.replace(/\-/g,'/')) > now || new Date(now_date+' '+items.end_time.replace(/\-/g,'/')) < now){
                Toast.fail('不在购买时段！',2);
                return;
            }
        }
        dispatch({type:'shop/setStatus',visible_addCart:true})
        dispatch({type:'items/getItem',currentItem:items})
        dispatch({type:'items/getItem',btn_type:type})
    }

    return <span>
        {position == 'detail' ?
                    type =='buy' ? <Button onClick={()=>onItemsClick('buy')}>立即购买</Button>
                        : <Button onClick={()=>onItemsClick()}><div> 加入购物车</div></Button>
         : <span className={style.positionImgStyle} onClick={() => onItemsClick()} dangerouslySetInnerHTML={{__html: '&#xe641;'}}/>}

         </span>


}
export default  connect(({shop}) => ({shop}))(AddCart)