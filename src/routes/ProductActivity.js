import React from "react";
import {Flex,Button, WhiteSpace,Icon, Toast,Modal,Badge,Result} from 'antd-mobile';
import {Link} from "dva/router";
import {connect} from "dva";
import { history } from '../config'
import style_I from './index.less'
import style_C from '../index.less'
import style from './product.less';
import { getPrice,timeString,getSystemTime ,timeStringFormat} from '../utils/helper'
import Countdown from '../components/countDown';
const FlexItem = Flex.Item
const Index = ({dispatch,location,product:{results,total,ordinaryProduct,visible,dataError,activityStatus},home:{cartNum}}) => {

    const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
    const activityType = location.query.activity;
    let wrapProps;
    if (isIPhone) {
        // Note: the popup content will not scroll.
        wrapProps = {
            //onTouchStart: e => e.preventDefault(),
        };
    }



    if(ordinaryProduct && JSON.stringify(ordinaryProduct) != "{}") {


        if (ordinaryProduct.img.endsWith('.jpg') || ordinaryProduct.img.endsWith('.png')) {
        } else {
            ordinaryProduct.img = ordinaryProduct.img + '-500x500.jpg';
        }

    }
    function onCartItemsClick(t,item) {
        let url = '/micro/orderformOnline?marketing=1';
        ordinaryProduct.num = 1;

        if(ordinaryProduct.stock <= 0){
            Toast.fail('库存不足！')
            return
        }
        if(t == 'ordinary'){
            url = '/micro/orderformOnline';
            ordinaryProduct.price = ordinaryProduct.original_price
        }else{
            if(t == 'bulk'){
                url = '/micro/orderformOnline?marketing=1&join='+item.object_id;
            }
            if(activityStatus == -1){
                Toast.fail('活动未开始！');
                return
            }

            if( activityStatus == 0){
                Toast.fail('活动已结束！');
                return
            }

        }

        const order = [ordinaryProduct];
        localStorage.setItem('order',JSON.stringify(order));
        window.location.href=url;
    }

    function viewMoreBulk() {
            dispatch({type:'product/setQuest',visible:true})
    }
    function hideModal() {
        dispatch({type:'product/setQuest',visible:false})
    }

    function render( days,hours, minutes, seconds, completed) {
        if(completed){

                dispatch({type:'product/setQuest',activityStatus:activityStatus == -1 ? 1 : 0});

            return <b>{timeString(ordinaryProduct.end)}</b>;
        }else {

        }
        return <b>{hours} : {minutes} : {seconds}</b>;
    };
    const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt="" />;

console.log(activityStatus)

    return (
        <div>
            {JSON.stringify(ordinaryProduct) != '{}' &&
                <div>
                    <img
                        src={ordinaryProduct.img}
                        alt=""
                        style={{width: '100%', verticalAlign: 'top', display: 'block'}}
                        onLoad={() => {
                            // window.dispatchEvent(new Event('resize'));
                            //dispatch({type:'product/setHeight',height:'auto'})
                        }}
                    />
                    <div className={style.detailTile}>
                        <div className={style.flexDetail}>
                            <p className={style.price}><b
                                className={style_C.priceIcon}>￥</b>{getPrice(ordinaryProduct.price)}<span>原价<br/><del>￥{getPrice(ordinaryProduct.original_price)}</del></span>
                            </p>
                            <div className={style.time}>
                                <div>
                                    <p>
                                        <span>{activityStatus == 1 ? '进行中' : activityStatus == 0 ? '已结束' : '未开始'}</span>
                                        <em>{activityStatus == -1 ? '距开始还有' : activityStatus == 1 ? '距结束还有' : '结束时间'} </em>
                                    </p>
                                    {activityStatus == -1 &&
                                        <p>
                                            {/*<Countdown date="2018-02-07 10:06:10" daysInHours={true} render={render}/>*/}
                                            <Countdown date={timeStringFormat(ordinaryProduct.start, 'yyyy/MM/dd hh:mm:ss')} daysInHours={true} render={render}/>
                                        </p>
                                    }
                                    {activityStatus == 1 &&
                                        <p>
                                            {/*<Countdown date="2018-02-07 10:07:30" daysInHours={true} render={render}/>*/}
                                            <Countdown date={timeStringFormat(ordinaryProduct.end, 'yyyy/MM/dd hh:mm:ss')} daysInHours={true} render={render}/>
                                        </p>
                                    }
                                    {activityStatus == 0 &&
                                        <p>
                                            <b>{timeString(ordinaryProduct.end)}</b>
                                        </p>
                                    }
                                </div>
                            </div>
                        </div>


                        <Flex className={style.introduce}>
                            <FlexItem>
                                <div><h3>{ordinaryProduct.name}</h3>运费：免运费</div>
                            </FlexItem>
                            <FlexItem className={style.stock}>剩余：{ordinaryProduct.stock}</FlexItem>
                        </Flex>


                        {/*<div className={style.time}>剩余 <CountDown start={itemProduct.start} end={itemProduct.end} callback={hasEnd()}/></div>*/}
                    </div>
                    {activityType == 'bulk' && results && results.length > 0 && activityStatus == 1 &&
                    <div className={style.bulkList}>
                        {/*<div className={style.flex + ' ' + style.title }>*/}
                        {/*/!*<div className={style.titleleft}>{total}人正在拼单，可直接参与</div>*!/*/}
                        {/*{total > 2 && <div onClick={()=> viewMoreBulk()} className={style.right + ' ' + style.viewmore}>查看更多 >> </div>}*/}
                        {/*</div>*/}
                        {results.map((result, i) => (
                            i < 2 && <div className={style.flex} key={i}>
                                <div>{result.buyer}人正在拼单</div>
                                <div className={style.flex }>
                                    <div className={style.info}>
                                        <p>还差<span
                                            className={style.count}>{ordinaryProduct.content.buyer - result.buyer}人</span>拼成
                                        </p>
                                    </div>
                                    <div>
                                        <Button size="small" onClick={() => onCartItemsClick('bulk', result)}
                                                className={style.btn}>去拼单</Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    }
                    <WhiteSpace />
                    <div className={style_I.subTitle + ' ' + style.subTitle}>商品详情</div>
                    <div className={style.detail}>
                        {ordinaryProduct.brief}
                    </div>
                    <div className={style_C.Footer}>
                        <Flex>
                            <FlexItem>
                                <Flex>
                                    <FlexItem
                                        className={style_C.linkBtn + ' ' + style.noMargin + ' ' + style.bordeRight}><Link
                                        className={style.positionIconStyle} to="/micro"
                                        dangerouslySetInnerHTML={{__html: '&#xe68f;'}}/></FlexItem>
                                    <FlexItem className={style_C.linkBtn + ' ' + style.noMargin}><Link to="/micro/cart"><i
                                        dangerouslySetInnerHTML={{__html: '&#xe641;'}} className={style.positionIconStyle}/><Badge
                                        className={style.badge} text={cartNum} hot/></Link></FlexItem>
                                </Flex>
                            </FlexItem>
                            {activityType == 'SecondKill' &&
                            <FlexItem
                                className={style_C.cartBtn + ' ' + style.button + ' ' + style_C.button + ' ' + style.noMargin}><Button
                                onClick={() => onCartItemsClick()}>
                                <div> 立即购买</div>
                            </Button></FlexItem>}
                            {activityType == 'bulk' &&
                            <FlexItem className={style_C.cartBtn + ' ' + style_C.button + ' ' + style.noMargin}><Button
                                onClick={() => onCartItemsClick('ordinary')}>
                                <div><p>￥{getPrice(ordinaryProduct.original_price)}</p> 单独购买</div>
                            </Button></FlexItem>}
                            {activityType == 'bulk' &&
                            <FlexItem className={style_C.buyBtn + ' ' + style_C.button + ' ' + style.noMargin}><Button
                                onClick={() => onCartItemsClick()}><p>￥{getPrice(ordinaryProduct.price)}</p>
                                发起拼单</Button></FlexItem>}
                        </Flex>
                    </div>


                    <Modal
                        transparent
                        maskClosable={true}
                        visible={visible}
                        className={style.modalBody}
                        closeable={false}
                        style={{width: '70%'}}
                    >
                        <div className={style.pop + ' ' + style.popEwm}>
                            <Icon onClick={() => hideModal()} className={style.close} type="cross"/>
                            <div className={style.content}>
                                <div className={style.header}>
                                    正在拼单
                                </div>
                                <div className={style.body}>
                                    {results && results.length > 0 &&
                                    <div className={style.bulkList}>
                                        {results.map((result, i) => (
                                            i < 6 && <div className={style.flex} key={i}>
                                                <div></div>
                                                <div className={style.flex + ' ' + style.flex2}>
                                                    <div className={style.info}>
                                                        <p>还差<span className={style.count}>{result.buyer - result.now_buyer}人</span>拼成
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <Button size="small"
                                                                onClick={() => onCartItemsClick('bulk', result)}
                                                                className={style.btn}>去拼单</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    }
                                </div>
                                <div className={style.footer}>
                                    仅显示6个正在拼单的人
                                </div>
                            </div>
                        </div>
                    </Modal>
                </div>
            }
            {dataError && <Result
                img={myImg('https://gw.alipayobjects.com/zos/rmsportal/GIyMDJnuqmcqPLpHCSkj.svg')}
                title="商品已下架"
                message={<Button className={style.backBtn} size="small" onClick={() => history.goBack()}>返回</Button>}
                />
            }

        </div>
    )
}

export default connect(({product,home}) => ({product,home}))(Index)
