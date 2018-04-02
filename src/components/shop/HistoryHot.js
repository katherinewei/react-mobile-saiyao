import React from "react";
import style from './HistoryHot.less'
import {connect} from "dva";
import {getPrice} from '../../utils/helper'
import {Link} from "dva/router";
import AddCart from '../AddCart'
import style_title from './title.less'
import {ImgUrlChange} from '../../utils/helper'

const Banner = ({dispatch,shop:{hotItems,visible_addCart}}) => {



    function setHotItem(item) {
        localStorage.setItem('hotItem',JSON.stringify(item));
    }

    return <div  className={style_title.boxContainer}>
            <div className={style_title.subTitle + ' '+ style.subTitle}>历史爆款<span>History hot style</span></div>
            <div className={style.hotHistoryList}>

                { hotItems.length > 0 && hotItems.map(item=> {
                    if (item.img.endsWith('.jpg') || item.img.endsWith('.png')) {
                        item.imgs = item.img;
                    } else {
                        item.imgs = item.img + '-200x200.jpg';
                    }
                    item.imgs = ImgUrlChange( item.imgs);
                    return  <div key={item.object_id}  style={{position:'relative'}}><Link onClick={() => setHotItem(item)} to={`/detail?hotItem=1`}>
                        <div className={style.img}>

                            <img src={item.imgs}/>
                        </div>
                        <div>
                            <p className={style.name}>{item.name}</p>

                            <p className={style.price}>{getPrice(item.price)}{item.label && <span className={style.hot}>{item.label}</span>}</p>
                        </div>

                    </Link> {item.stock <= 0 && <div className={style.soldOut}><span>已售罄</span></div>} <AddCart items={item} dispatch={dispatch} visible={visible_addCart}/></div>
                })
                }
            </div>
        </div>


}
export default connect(({shop}) => ({shop}))(Banner)