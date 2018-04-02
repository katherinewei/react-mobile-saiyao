import React from "react";
import {Badge} from 'antd-mobile';
import { history } from '../config'
import {specifiedMachine} from '../utils/helper'
import style from './index.less'

import {Link} from "dva/router";
import {connect} from "dva";
import Banner from '../components/shop/banner'
import Title from '../components/shop/title'
import BookProduct from '../components/shop/bookProduct'
import Product from '../components/shop/productList'
import HistoryHots from '../components/shop/HistoryHot'
import SecondKill from '../components/shop/secondKill'
import SpellGroup from '../components/shop/spellGroup'
const pageDefault = [
    {
        name:'宝达易购',
        key:'home',
    },
    {
        name:'机台自提',
        key:'selfPick',
    },
    {
        name:'个人中心',
        key:'user',
    },
];
const Index = ({dispatch,location,home:{cartNum},shop:{config:{page,menu,demo}}}) => {


    const preview = location.query.preview;

    const HTML = () => {

        let new_menu = menu &&  typeof menu !== 'object'  ?  JSON.parse(menu) : [];
        new_menu = new_menu.length > 0 ? new_menu : pageDefault;
        let page_c = preview ? demo : page;

        let new_page = page_c &&  typeof page_c !== 'object' ?  JSON.parse(page_c) : [];
        new_page =  new_page.length > 0  ? new_page : [];


       // console.log(new_page)

        const pages = [];
        let color = '#ffffff';
        if(specifiedMachine()){
            pages.push(<Product />)
            return  {pages,color};
        }


        new_page.map((item,i) => {

            switch (item.type){
                case 'config':

                    document.title = item.title;
                    color = item.color;
                   // console.log(document.title)
                    break;
                case 'banner':
                    pages.push(<Banner key={i} {...item}/>);
                    break;
                case 'title':
                    pages.push(<Title  key={i} {...item}/>);
                    break;
                case 'products':
                    pages.push(<Product  key={i} />);
                    break;
                case 'historyHot':
                    pages.push(<HistoryHots  key={i}/>);
                    break;
                case 'preProduct':
                    pages.push(<BookProduct  key={i}/>);
                    break;
                case 'secondKill':
                    pages.push(<SecondKill  key={i} {...item}/>);
                    break;
                case 'spellGroup':
                    pages.push(<SpellGroup  key={i} {...item}/>);
                    break;
            }
        })

        if(new_page.length == 1){
            pages.push(<div style={{textAlign:'center',paddingTop:'30%',fontSize:'0.4rem'}}>商家暂时还没上架商城主页，请耐心等候！</div>)
        }
        return {pages,color}
    }

    //console.log(HTML())
    return (
            <div style={{paddingBottom:"1.11111rem",position:'relative',backgroundColor:HTML().color}}>



                {HTML().pages}

                <Link className={style.positionCartStyle} to="/micro/cart"><b  dangerouslySetInnerHTML={{__html: '&#xe641;'}} /><Badge text={cartNum} hot /></Link>
            </div>
    )
}

export default connect(({home,shop}) => ({home,shop}))(Index)
