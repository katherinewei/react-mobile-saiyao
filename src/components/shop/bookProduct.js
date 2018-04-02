import React from "react";
import style from './title.less'
import {connect} from "dva";
import ProductList from '../../routes/List'

const bookProduct = ({dispatch,shop:{bookItems,bookItem_Page,bookItem_Pages,bookItem_noMore}}) => {


    return (

        <div className={style.boxContainer}>
            <div className={style.subTitle}>预售商品<span>open to booking commodity</span></div>
            <ProductList cateItems={bookItems} page={bookItem_Page} pages={bookItem_Pages} noMore={bookItem_noMore} type="book"/>
        </div>
    )
}

export default  connect(({shop}) => ({shop}))(bookProduct)
