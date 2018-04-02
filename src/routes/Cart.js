import React from "react";
import {Carousel, SearchBar,Grid, Card,Flex,Button,List,Checkbox, WhiteSpace,Stepper ,Icon , Result, Toast} from 'antd-mobile';

import {connect} from "dva";
import { history } from '../config'
import style from './cart.less';
import style_C from '../index.less'
import { getPrice,specifiedMachine } from '../utils/helper'
const Item = List.Item;
const FlexItem = Flex.Item
const CheckboxItem = Checkbox.CheckboxItem;
const Brief = Item.Brief;
const Index = ({dispatch,cart:{checked,status,data1,nums,total,cart,checkLength,checkedAll}}) => {

    const entry = localStorage.getItem('entry');
    let cart_local = entry == 'devices' || specifiedMachine() ? 'cart' : 'cartOnline';



    function selectAll(e) {
        checked = [];
        const check = e.target.checked;
        let totalPrice = 0;
        checkLength = 0;
        for(let i in cart){
            checked.push(check);
            if(check){
                let price = parseFloat(cart[i].price);
                //console.log(price, price * nums[i])
                totalPrice += price * nums[i];
                checkLength = checked.length;
            }
        }
        dispatch({type:'cart/setStatus',checked,total:totalPrice,checkLength,checkedAll:check})
    }

    function selectItem(e,i) {

        const check = e.target.checked;
        checked[i] = check;
        checkLength = 0;
        let total = 0;

        for(let i in checked){
            if(checked[i]){
                let price = parseFloat(cart[i].price);
                //console.log(price)
                total += price * nums[i];
                checkLength += 1;
            }
        }
        dispatch({type:'cart/setStatus',checkedAll:checkLength == cart.length})
        dispatch({type:'cart/setStatus',checked,total,checkLength})
    }
    function editCart() {
        let flag = true;
        console.log(checked.length)
        for(let i in checked){
            checked[i] = false;
            if(!nums[i]){
                flag = false;
            }
        }
        if(flag){
            dispatch({type:'cart/setStatus',status:!status,checked:checked,checkedAll:false,total:0,checkLength:0})
        }else{
            Toast.fail('请输入数量');
        }
    }
    function deleteItem(i) {

        cart.splice(i,1);
        dispatch({type:'cart/setStatus',cart:cart})
        localStorage.setItem(cart_local,JSON.stringify(cart))
        dispatch({type:'home/getCartNum',cartNum:cart.length})

    }

    function setItemNum(value,i) {

        nums[i] = value;
        dispatch({type:'cart/setStatus',nums:nums})

        cart[i].num = value;

        localStorage.setItem(cart_local,JSON.stringify(cart))
        const cartInfo = {time:new Date().getTime(),source:localStorage.getItem('entry')};
        localStorage.setItem('cartTime',JSON.stringify(cartInfo));
    }
    function deleteItems() {
        for(let i=0,flag=true,len=checked.length;i<len;flag ? i++ : i){
            if( checked[i]){
                cart.splice(i,1);
                checked.splice(i,1);
                flag = false;
            } else {
                flag = true;
            }
        }
        //console.log(cart);
        dispatch({type:'cart/setStatus',cart:cart})
        localStorage.setItem(cart_local,JSON.stringify(cart))
    }

    function handleClearOrder() {
        let order = [];
        for(let i=0,flag=true,len=checked.length;i<len;i++){

            if(checked[i] && cart[i] && cart[i].name){
                order.push(cart[i]);
               // cart.splice(i,1);
               // checked.splice(i,1);
               // flag = false;
            }else{
                //flag = true;
            }
        }
       // console.log(cart,order)
        if(order.length === 0){
            Toast.fail('请选择商品',1);
            return
        }

        // if(cart.length == 0){
        //     localStorage.removeItem('cart')
        // }else{
        //     localStorage.setItem('cart',JSON.stringify(cart))
        // }
        localStorage.setItem('order',JSON.stringify(order))
        //history.push('/micro/orderformOnline');
        window.location.href="/micro/orderformOnline"
    }

    const extraHTML = (i) => (status ? <Button onClick={()=>deleteItem(i)} className={style.delete} type="warning">删除</Button> : <p className="editTxt">x{nums[i]}</p>);
    const contentHTML = (name,max,i) => (status ?  <Stepper className="cartStep" style={{ width: '3rem' }} showNumber max={max} min={1} step={1} value={nums[i]} onChange={(value)=>setItemNum(value,i)}/> : name);

    const empty = require('../assets/staticIcon/empty_cart.png');

    return (

            <div className={style_C.content + ' ' + style.content}>

                {
                    cart.length == 0 ?  <div className={style.empty}><img src={'/'+empty}/> <p>购物车暂无商品，快去选购吧！</p></div> :
                     <div>
                         <List className="my-list">
                        <Item extra={<p className='editTxt' onClick={()=>editCart()}>{status ? '完成' : '编辑'}</p>}>  <p><Icon type='left' onClick={() =>{history.goBack()}} style={{verticalAlign:'middle'}} />我的购物车</p></Item>
                    </List>
                        <WhiteSpace/>
                        <List className={style.myList + ' my-list'}>
                            {cart.map((item,i) =>
                                {
                                    if(item.name){
                                         return <Flex key={i} className={style.myItem}>
                                        <FlexItem style={{flex:0.15}}><CheckboxItem  onChange={(e)=>selectItem(e,i)} checked={checked[i]}/></FlexItem>
                                        <FlexItem>

                                            <Item extra={extraHTML(i)}className={status ? 'editBtunn' : ''} align="bottom" thumb={`${item.img}`} >
                                                {contentHTML(item.name,item.stock,i)} <Brief className={style.price}><b className={style_C.priceIcon}>￥</b>{getPrice(item.price)} </Brief>
                                            </Item>
                                        </FlexItem>
                                    </Flex>
                                     }
                                }

                            )}
                        </List>
                        <div className={style_C.Footer + ' '+ style.footer}>
                            <Flex>
                                <FlexItem style={{flex:status ? 1.5 : 0.6}}><CheckboxItem checked={checkedAll} onChange={(e)=>selectAll(e)}>全选</CheckboxItem></FlexItem>
                                <FlexItem style={{flex:status ? 1 : 1.6}}>
                                    {status ?  <div className={style_C.clearing}><Button onClick={()=>deleteItems()}>删除</Button></div>  : <Flex>
                                            <FlexItem className={style_C.total}><p className={style_C.price}>合计：￥{getPrice(total)}</p><p className={style_C.fee}>不含运费</p></FlexItem>
                                            <FlexItem className={style_C.clearing}><Button onClick={()=>handleClearOrder()}>结算({checkLength})</Button></FlexItem>
                                        </Flex>}

                                </FlexItem>
                            </Flex>
                                </div>
                     </div>
            }

        </div>
    )
}

export default connect(({cart}) => ({cart}))(Index)
