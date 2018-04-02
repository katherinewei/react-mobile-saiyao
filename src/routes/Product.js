import React from "react";
import {Flex,Button, WhiteSpace, Result, Badge} from 'antd-mobile';
import {Link} from "dva/router";
import {connect} from "dva";
import { history } from '../config'
import style_I from './index.less'
import style_C from '../index.less'
import style from './product.less';
import { getPrice,specifiedMachine} from '../utils/helper'
import {getAccessDeviceId} from '../models/validator'
const FlexItem = Flex.Item
import AddCart from '../components/AddCart'
import AddCartModal from '../components/AddCartModal'
const Index = ({dispatch,location,product:{ordinaryProduct},items:{currentItem,btn_type},shop:{visible_addCart},home:{cartNum}}) => {

    let isBook = false
    if(location.query && location.query.book){
        isBook = true
    }

    const localDeviceId = getAccessDeviceId();
    const entry = localStorage.getItem('entry');
    let item = () => {
        if(ordinaryProduct && ordinaryProduct.price){
            if (ordinaryProduct.img.endsWith('.jpg') || ordinaryProduct.img.endsWith('.png')) {
                ordinaryProduct.imgs = ordinaryProduct.img;
            } else {
                ordinaryProduct.imgs = ordinaryProduct.img + '-500x500.jpg';
            }
            if(ordinaryProduct.imgs.indexOf("https") > 0 ){
            }else{
                //items.imgs = items.imgs.replace("http","https");
            }
            ordinaryProduct.num = entry == 'device' ?  ordinaryProduct.stock : ordinaryProduct.valid_stock - ordinaryProduct.lock_stock;
        }
        return ordinaryProduct;
    }
    let items = item()

    let url_home = '/micro';
    if(localStorage.getItem('entry') == 'devices'){
        url_home = "/micro/market/classified/"+localDeviceId;
    }

    if(specifiedMachine()){
        url_home = "/micro/?deviceId="+localDeviceId+"&fixed=1";
    }
    const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt="" />;


    return (
        <div>
            {ordinaryProduct ?
            <div>
                <img
                    src={items.imgs}
                    alt=""
                    style={{ width: '100%', verticalAlign: 'top',display:'block' }}
                    onLoad={() => {
                    }}
                />
                <div className={style.o_detailTile}>
                    <Flex className={style.o_introduce}>
                        <FlexItem><div><h3>{items.name}</h3></div></FlexItem>
                        <FlexItem className={style.stock} >剩余：{items.num}</FlexItem>
                    </Flex>
                    <div className={style.o_price}>
                        <p><span>{getPrice(items.price)}</span></p>
                        <p>运费：免运费</p>
                    </div>
                    {items.start_time &&
                        <div className={style.buy_time}>
                            <p>购买时段：{items.start_time} ~ {items.end_time}</p>
                        </div>
                    }
                </div>
                <WhiteSpace />
                <div className={style_I.subTitle + ' ' +style.subTitle}>商品详情</div>
                <div className={style.detail}>
                    <div dangerouslySetInnerHTML={{__html:items.desc}}/>
                </div>
                <div className={style_C.Footer}>
                    <Flex>
                        <FlexItem>
                            <Flex>
                                <FlexItem className={style_C.linkBtn + ' '+ style.noMargin + ' ' + style.bordeRight}><Link className={style.positionIconStyle} to={url_home} dangerouslySetInnerHTML={{__html: '&#xe68f;'}}/></FlexItem>
                                <FlexItem className={style_C.linkBtn + ' '+ style.noMargin}><Link  to="/micro/cart"><i  dangerouslySetInnerHTML={{__html: '&#xe641;'}} className={style.positionIconStyle}/><Badge className={style.badge} text={cartNum} hot /></Link></FlexItem>
                            </Flex>
                        </FlexItem>
                        {
                            !(location.query && location.query.book) && <FlexItem className={style_C.cartBtn + ' ' + style.button + ' ' + style_C.button  + ' '+ style.noMargin}> <AddCart items={ordinaryProduct} dispatch={dispatch} position="detail"/></FlexItem>
                        }
                        <FlexItem className={style_C.buyBtn + ' ' + style.button + ' ' + style_C.button  + ' '+ style.noMargin}><AddCart items={ordinaryProduct} dispatch={dispatch}  position="detail" type="buy"/></FlexItem>
                    </Flex>
                </div>

            </div> : <Result
                img={myImg('https://gw.alipayobjects.com/zos/rmsportal/GIyMDJnuqmcqPLpHCSkj.svg')}
                title="商品已下架"
                message={<Button className={style.backBtn} size="small" onClick={() => history.goBack()}>返回</Button>}
                />
            }
            <AddCartModal isBook={isBook}  currentItem={currentItem} dispatch={dispatch} visible={visible_addCart} btn_type={btn_type}/>
        </div>
    )
}

export default connect(({product,home,items,shop}) => ({product,home,items,shop}))(Index)
