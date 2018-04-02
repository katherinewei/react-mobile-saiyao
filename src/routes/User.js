import React from "react";
import {connect} from "dva";
import { Result,Grid,List,Badge ,Modal,Icon,InputItem ,Toast} from 'antd-mobile';
import style from './user.less';
import Address from './Address';
import {Link} from "dva/router";
import ImageUploader from '../components/ImageUploader'
import {ImgUrlChange} from "../utils/helper";
import { createForm } from 'rc-form';
const Item = List.Item;
const Brief = Item.Brief;
const prompt = Modal.prompt;
const User = ({dispatch,user:{header,orderTotal,isEdit,nickname},form:{getFieldProps}}) => {
    
    var list=[{
        icon: '&#xe7db;',
        text: '待付款',
        type:1,
    },{
        icon: '&#xe62d;',
        text: '待收货',
        type:5,
    },{
        icon: '&#xe67b;',
        text: `已完成`,
        type:9,
    }]
    function handleUpload(uid, url) {
        //alert(url)
        dispatch({type:'user/editHeader',payload:{header:url}})

    }
    const ImageUploaderGrad = () =>
        <ImageUploader uid="user" outputs={['200x200']}  imgSize={4} onUpload={handleUpload}/>;
       // alert(ImgUrlChange(header));
    return (
        <div>
            <div className={style.bg}>
                <div className={style.content}>
                     <p className={style.user} onClick={() => prompt('输入昵称', '', [
                            { text: '取消' },
                            {
                                text: '确认修改',
                                onPress: value => new Promise((resolve) => {
                                    if(!value){
                                        Toast.info('请输入昵称', 1);
                                        return
                                    }

                                    if(value.length > 10){
                                        Toast.info('字数在10个以内', 1);
                                        return
                                    }
                                    dispatch({type:'user/editHeader',payload:{nickname:value}})
                                    resolve();
                                }),
                            },
                        ], 'default', nickname, ['请输入昵称'])}> {nickname}</p>
                    <div className={style.photo}><div><img src={ImgUrlChange(header)} /> <ImageUploaderGrad /></div><i/></div>
                    <div className={style.nav}>
                        <div><Link to="/micro/order" style={{color:'#000'}}>
                            <p>我的订单（个）</p>
                            <p className={style.number}>{orderTotal}</p></Link>
                        </div>
                        <div>
                            <p>我的余额（元）</p>
                            <p className={style.number}>0.00</p>
                        </div>
                    </div>
                </div>

            </div>
            <div className={style.box}>
                <List className={style.myList} >
                    <Item  extra={<Link to="/micro/order" className={style.allOrder}>查看全部订单 ></Link>}><div className={style.orderTit}>我的订单</div> </Item>
                </List>
                <Grid className={style.order} data={list} hasLine={false}  columnNum={3}
                      renderItem={dataItem => (
                          <Link to={`/micro/order?type=${dataItem.type}`}>
                              {/*<Badge  overflowCount={55} size="small" >*/}
                                  <i  dangerouslySetInnerHTML={{__html: dataItem.icon}}/>
                              {/*</Badge>*/}
                              <div className={style.txt}>
                                  <span>{dataItem.text}</span>
                              </div>
                          </Link>
                      )}
                />
            </div>

            <div className={style.list + ' ' +style.box}>
                <List className={style.myList}>
                    <Item arrow="horizontal"><div  className={style.ItemL}>我的优惠券</div></Item>
                    <Item  extra={<span className={style.extra}>0分</span>}> <div  className={style.ItemL}>我的积分</div></Item>
                </List>
            </div>

        </div>
    )
}

export default createForm()(connect(({user}) => ({user}))(User))
