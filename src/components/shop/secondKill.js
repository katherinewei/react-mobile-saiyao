import React from "react";
import style from './secondKill.less'
import {connect} from "dva";
import {Link} from "dva/router";
import { getPrice ,ImgUrlChange} from '../../utils/helper'
import Countdown from '../countDown';
const Activity = ({dispatch,shop:{secondKill:{results}},way,product}) => {


    function toDetail(itemProduct) {
        localStorage.setItem('detailId',itemProduct.marketing_detail.object_id)
    }

    let filteredResultsDiscount = [],filterDiscount = [];
    const Discount = way == 1 ? product : results;

    if(Discount){
        Discount.map(item => {
            if (item.img.endsWith('.jpg') || item.img.endsWith('.png')) {
            } else {
                item.img = item.img + '-500x500.jpg';
            }
            item.img = ImgUrlChange( item.img);
            item.num = item.stock;

            item.diffPrice =item.original_price - item.price;

            return item
        })
        //console.log(Discount)


        filteredResultsDiscount = Discount.filter(item => item.stock);
        Discount.map(item => {
            if(!item.stock){
                filteredResultsDiscount.push(item)
            }
        })

    }

    const Completionist = () => <span style={{fontSize:'0.35rem'}}>已结束</span>;

// Renderer callback with condition
    function render( days,hours, minutes, seconds, completed) {
        //console.log(days,hours, minutes, seconds, completed)
        // if (completed) {
        // Render a completed state
        // return <Completionist />;
        //} else {
        // Render a countdown
        // const hour = hours.split('');
        //console.log(hours)
        let _hours = [],_minutes = [], _seconds = [];
        for(let i in hours){
            if(i < hours.length){
                _hours.push(<span key={i}>{hours[i]}</span>);
            }
        }
        for(let i in minutes){
            if(i < minutes.length){
                _minutes.push(<span  key={i+3}>{minutes[i]}</span>);
            }
        }
        for(let i in seconds){
            if(i < seconds.length){
                _seconds.push(<span  key={i+6}>{seconds[i]}</span>);
            }
        }
        return <div>{_hours} : {_minutes} : {_seconds}</div>;
        // }
    }


    return (
                <div className={style.List}>

                        { filteredResultsDiscount.length > 0 && filteredResultsDiscount.map((item,i)=> {
                                return <div  key={item.product_id} className={style.item + ' ' + style.SecondKill}>
                                    <Link to={`/product/?id=${item.object_id}&activity=SecondKill`} onClick={() => toDetail(item)}>
                                        <div className={style.img}><img
                                            src={item.img}/>
                                        </div>
                                        <div className={style.detail}>
                                            <div className={style.txt}>
                                                <p className={style.name}>{item.name}</p>
                                                <p className={style.price}>秒杀价：￥<b>{getPrice(item.price)}</b>
                                                    {/*<span>仅剩{item.stock}件</span>*/}
                                                </p>
                                                {/*<p className={style.original}>原价：*/}
                                                    {/*<del>{getPrice(item.original_price)}</del>*/}
                                                    {/*元*/}
                                                {/*</p>*/}
                                            </div>
                                            <div className={style.buy}>
                                                {/*<p className={style.save}><span>省</span><i><b>￥{getPrice(item.diffPrice)}</b></i></p>*/}
                                                <span className={style.buyBtn}>立即秒杀</span>
                                            </div>
                                        </div>
                                        <div className={style.badgeRob}>秒杀</div>
                                        {/*<div className={style.time}>*/}
                                            {/*<Countdown date={timeString(item.end)} daysInHours={true}  render={render}/>*/}
                                        {/*</div>*/}
                                    </Link>
                                    {/*{item.stock <= 0 && <div className={style.soldOut}><span>已售罄</span></div>}*/}
                                </div>
                        })
                        }

                </div>
    )
}

export default connect(({shop}) => ({shop}))(Activity)
