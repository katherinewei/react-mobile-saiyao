import React from "react";
import {Result} from 'antd-mobile';
import style from './secondKill.less'
import {connect} from "dva";
import {Link} from "dva/router";
import { getPrice,ImgUrlChange } from '../../utils/helper'
const Activity = ({shop:{spellGroups:{results}},way,product}) => {

    function toDetail(itemProduct) {
        localStorage.setItem('detailId',itemProduct.marketing_detail.object_id)
    }

    let filteredResultsGroup = [],filterGroup = [];
    const groups = way == 1 ? product : results;


    if(groups){
        groups.map(item => {
            if (item.img.endsWith('.jpg') || item.img.endsWith('.png')) {
            } else {
                item.img = item.img + '-500x500.jpg';
            }
            item.img = ImgUrlChange( item.img);
            //item.valid_date = item.content.is_valid_date;
            return item
        })

        filteredResultsGroup = groups.filter(item => item.stock);
        groups.map(item => {
            if(!item.stock){
                filteredResultsGroup.push(item)
            }
        })
    }


    const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt="" />;


    return (


                <div className={style.List}>
                    { filteredResultsGroup.length > 0 ? filteredResultsGroup.map(item=> {
                            return <div className={style.item + ' ' + style.bulk} key={item.product_id}>
                                <Link to={`/product/?id=${item.object_id}&activity=bulk`} onClick={() => toDetail(item)}>
                                    <div className={style.detail}>
                                        <div className={style.txt}>
                                            <p className={style.name}>{item.name}</p>
                                            <p className={style.price}>
                                                {/*{item.content.buyer}人成团价：*/}
                                                团购价：
                                                <b>{getPrice(item.price)}</b>元
                                            </p>
                                            {/*<p className={style.original}>原价：*/}
                                                {/*<del>{getPrice(item.original_price)}</del>*/}
                                                {/*元 */}
                                                {/*<span>剩余：{item.stock}</span>*/}
                                            {/*</p>*/}
                                            <p className={style.bulkBtn}><span className={style.buyBtn}>立即团购</span>
                                                {/*<span>已成团：{content.real_buyer}人</span>*/}
                                            </p>
                                        </div>
                                        <div className={style.Imgs}>
                                            <div className={style.img}><img
                                                src={item.img}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={style.bulkBadge}>团购</div>
                                </Link>
                                {/*{item.stock <= 0 && <div className={style.soldOut}><span>已售罄</span></div>}*/}

                            </div>
                        }) : <Result
                            img={myImg('https://gw.alipayobjects.com/zos/rmsportal/GIyMDJnuqmcqPLpHCSkj.svg')}
                            title="暂无团购商品"
                        />}
                </div>

    )
}

export default connect(({shop}) => ({shop}))(Activity)
