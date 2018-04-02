import React from "react";
import {Result} from 'antd-mobile';
import {Link} from "dva/router";
import {connect} from "dva";
import { history } from '../config'
import style from './index.less'
import style_I from '../index.less'
import { getPrice } from '../utils/helper'
import pathToRegexp from 'path-to-regexp'
import AddCart from '../components/AddCart'
import AddCartModal from '../components/AddCartModal'
const ProductList = ({dispatch, items:{ products, loading, devices,currentItem},shop:{visible_addCart},cateItems,page,pages,noMore,type}) => {

    const deviceId = pathToRegexp('/:deviceId/').exec(location.pathname);
    const micro = location.pathname == '/micro' || location.pathname == '/micro/home';
    const placeholderLogo = require('../assets/staticIcon/placeholderLogo.png');

    let items = cateItems ? cateItems : products;
    items = items.map(function(items){
        if (items.img.endsWith('.jpg') || items.img.endsWith('.png')) {
            items.imgs = items.img;
        } else {
            items.imgs = items.img + '-200x200.jpg';
        }
        // if(items.imgs.indexOf("https") > 0 ){
        // }else{
        //     items.imgs = items.imgs.replace("http","https");
        // }
        items.priceArr = getPrice(items.price).toString().split('.');

        items.num = micro ?  items.stock : items.valid_stock - items.lock_stock;
        return items;
    })

    const filtered = items.filter(item => item.num);

    items.map(item => {
        if(!item.num){
            filtered.push(item)
        }
    })

    function toDetail(itemProduct) {
        if(type && type == 'book'){
            localStorage.setItem('hotItem',JSON.stringify(itemProduct));
        }else{
            localStorage.setItem('detailId',itemProduct.object_id)
        }
       // dispatch({type:'items/getItem',itemProduct})
    }
    function changePage() {
        let data = JSON.parse(sessionStorage.getItem('product_search_condition'));
        data = data ? data : {};

        data.page  = page + 1;

        dispatch({type:'shop/fetchCategoriesItems',...data});
    }

    const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt="" />;

    const url = (id) => (type && type == 'book' ? 'hotItem=1&book=1' : 'id='+id)

    return (
        <div className={style.product}>

            {
                filtered && filtered.length > 0 ? filtered.map((dataItem,i) =>(
                     <div key={i} className={style.cardItem}>
                        <div className={style.inner}>

                            <Link to={`/detail?${url(dataItem.object_id)}`} onClick={() => toDetail(dataItem)}>
                                <div style={{
                                    paddingBottom: '100%',
                                    overflow: 'hidden',
                                    height: 0,
                                    backgroundSize: '100% 100%',
                                    backgroundImage: `url(${dataItem.imgs || '/' + placeholderLogo})`
                                }}></div>
                                <div className={style.name}>
                                    <span>{dataItem.name}</span>
                                    <p>
                                        <em><b className={style_I.priceIcon}>价格：￥</b>{dataItem.priceArr[0]}.<i
                                            className={style_I.pointNextPriceStyle}>{dataItem.priceArr[1]}</i> </em>
                                        <span>剩余：{dataItem.num}</span>
                                    </p>
                                </div>
                            </Link>
                            {!(type && type == 'book') && <AddCart items={dataItem} dispatch={dispatch} visible={visible_addCart}/>}

                        </div>
                         {dataItem.label && <div className={style.rightIcon + ' '+ style.new}>{dataItem.label}</div>}
                        {dataItem.num <= 0 && <div className={style.soldOut}><span>已售罄</span></div>}

                   </div>
                )) : <Result
                        img={myImg('https://gw.alipayobjects.com/zos/rmsportal/GIyMDJnuqmcqPLpHCSkj.svg')}
                        title="暂无商品"
                    />
            }
            {pages > page && !noMore && <span className={style.more} onClick={() => changePage()}>查看更多</span>}

            <AddCartModal  currentItem={currentItem} dispatch={dispatch} visible={visible_addCart}/>
        </div>
    )
}

export default connect(({items,home,shop}) => ({items,home,shop}))(ProductList)
