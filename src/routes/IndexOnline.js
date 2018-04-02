import React from "react";
import {Badge} from 'antd-mobile';
import { history } from '../config'
import style from './index.less'
import ProductList from './List'
import {Link} from "dva/router";
import {connect} from "dva";
import Banner from '../components/Banner'
import {isTestPage} from '../utils/helper'
const Index = ({dispatch,home:{cartNum},activity:{results},indexOnline:{currentCate,currentSort,isPriceStatus,priceStatus,categories,cateItems}}) => {

    const tabs = [
        { title: '最新' },
        { title: '销量' },
        { title: '价格' },
    ];

    function handleCate(index,id) {

        dispatch({type:'indexOnline/fetchCategoriesItems',index,id});
    }

    function callback() {

    }
    //categories.unshift();
    //console.log(categories)

    function handleTabClick(i) {
        dispatch({type:'indexOnline/setStatus',currentSort:i});

        if(i == 2){
            dispatch({type:'indexOnline/setStatus',isPriceStatus:true,priceStatus:!priceStatus});
        }
        else{
            dispatch({type:'indexOnline/setStatus',isPriceStatus:false});
        }
    }
    const priceS = priceStatus ? style.priceTab0 : style.priceTab1;


    let activityItem = [];
    activityItem = results && results.map((item,i) =>{

        if(i < 2){
            if (item.img.endsWith('.jpg') || item.img.endsWith('.png')) {
                item.imgs = item.img;
            } else {
                item.imgs = item.img + '-500x500.jpg';
            }
            item.typeUrl = item.type == 'discount' ? 'SecondKill' : 'bulk';
            return item
        }

    })
    return (

        <div style={{paddingBottom:"1.11111rem",position:'relative'}}>

            <Banner/>
            {isTestPage() && <div>
                <div className={style.box + ' ' + style.newActivity}>
                    <div className={style.subTitle}>最新活动</div>
                    <ul className={style.boxContent}>
                        {results && results.map((item,i)=>(
                            i<2 && <li key={i}><Link to={`/product/?activity=${item.typeUrl}`}><img src={item.imgs}/> </Link></li>
                        ))}
                    </ul>
                </div>
                <div className={style.categories}>
                    <ul>
                        {categories.map((item,i) =>(
                            <li key={i} className={ i == currentCate && style.active} onClick={() =>handleCate(i,item.object_id)}>{i == 0 ? item.name : <div className={style.cateName}>{item.name}</div>}</li>
                        ))}
                    </ul>

                </div>

            </div>}

            <div className={style.box + ' ' + style.newActivity}>
                {/*{isTestPage() &&*/}
                {/*<div className={style.tabs}>*/}
                    {/*{tabs.map((item, i) => (*/}
                        {/*<div key={i} className={style.tab + ' ' + (i == currentSort && style.active)}*/}
                             {/*onClick={() => handleTabClick(i)}><span*/}
                            {/*className={i == 2 && (style.priceTab + ' ' + (isPriceStatus && priceS))}>{item.title}</span>*/}
                        {/*</div>*/}
                    {/*))}*/}
                {/*</div>*/}
                {/*}*/}
                <ProductList cateItems={cateItems}/>
            </div>
            <Link className={style.positionCartStyle} to="/micro/cart"><b  dangerouslySetInnerHTML={{__html: '&#xe641;'}} /><Badge text={cartNum} hot /></Link>


        </div>
    )
}

export default connect(({home,indexOnline,activity}) => ({home,indexOnline,activity}))(Index)
