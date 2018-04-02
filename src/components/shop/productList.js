import React from "react";
import style from './productList.less'
import ProductList from '../../routes/List'
import {specifiedMachine} from '../../utils/helper'
import {connect} from "dva";


const Index = ({dispatch,shop:{currentCate,currentSort,currentCategoryId,isPriceStatus,priceStatus,categories,cateItems,Item_Page,Item_Pages,Item_noMore}}) => {

    const tabs = [
        { title: '最新' },
        // { title: '销量' },
        { title: '价格' },
    ];

    function handleCate(index,id) {

        dispatch({type:'shop/setStatus',currentCategoryId:id,currentSort:0});
        const data = {index,id}
        dispatch({type:'shop/fetchCategoriesItems',...data});
        sessionStorage.setItem('product_search_condition',JSON.stringify(data));
    }

    function handleTabClick(i) {
        dispatch({type:'shop/setStatus',currentSort:i});

        if(i == 1){
            //const asc = !priceStatus && 1
            const data = {
                index:currentCate,
                id:currentCategoryId,
                order_by:'price',
            }
            if(!priceStatus){
                data.asc = 1;
            }
            sessionStorage.setItem('product_search_condition',JSON.stringify(data));
            dispatch({type:'shop/fetchCategoriesItems',...data});
            dispatch({type:'shop/setStatus',isPriceStatus:true,priceStatus:!priceStatus});
        }
        else{
            const data = {
                index:currentCate,
                id:currentCategoryId,
            }
            dispatch({type:'shop/setStatus',isPriceStatus:false});
            dispatch({type:'shop/fetchCategoriesItems',...data});
        }
    }
    const priceS = priceStatus ? style.priceTab0 : style.priceTab1;

    return (

        <div style={{position:'relative'}}>

            {!specifiedMachine() &&
                <div className={style.categories}>
                    <ul>
                        {categories.map((item,i) =>(
                            <li key={i} className={ i == currentCate && style.active} onClick={() =>handleCate(i,item.object_id)}>{i == 0 ? item.name : <div className={style.cateName}>{item.name}</div>}</li>
                        ))}
                    </ul>

                </div>
            }
            <div className={style.box + ' ' + style.newActivity}>
                {!specifiedMachine() && <div className={style.tabs}>
                    {tabs.map((item, i) => (
                        <div key={i} className={style.tab + ' ' + (i == currentSort && style.active)}
                             onClick={() => handleTabClick(i)}><span
                            className={i == 1 && (style.priceTab + ' ' + (isPriceStatus && priceS))}>{item.title}</span>
                        </div>
                    ))}
                </div>
                }
                <ProductList cateItems={cateItems} page={Item_Page} pages={Item_Pages} noMore={Item_noMore}/>
            </div>
        </div>
    )
}

export default connect(({shop}) => ({shop}))(Index)
