// import React from "react";
// import {connect} from "dva";
// import { Card, WhiteSpace,Button,Popup,InputItem,List,Icon,Modal,Toast,Result,Picker} from 'antd-mobile';
// import style from './address.less';
// import { createForm } from 'rc-form';
// import {getString,validatorTip} from '../utils/helper'
// import areas from '../assets/areas'
// const alert = Modal.alert;
// const myImg = src => <img src={src} className={style.spe} alt="" />;
// class Address extends React.Component{
//     state = {
//         visible: false,
//         type:null,
//         index:null
//       }
//      onClick(type,index){
//         if(type=="add"){
//             this.props.form.setFieldsValue({
//                 name: '',
//                 phone: '',
//                 address:'',
//                 district:""
//             });
//         }else if(type=="edit"&&index!=null&&index!=undefined){
//             let address=window.localStorage.getItem("user_address");
//             if(!address){
//                 Toast.info('发生错误', 1);
//                 return
//             }
//             address=JSON.parse(address);
//             var json=address.arr[index]
//             this.props.form.setFieldsValue({
//                 name: json.name,
//                 phone: json.phone,
//                 address:json.address,
//                 district:json.district
//             });
//         }else{
//             Toast.info('发生错误', 1);
//             return
//         }
//         this.setState({
//             visible: true,
//             type:type,
//             index:index
//           });
//       }
//       onClose(){
//         this.setState({
//             visible: false,
//           });
//       }
//       onDelete(index){
//           var that=this;
//         alert('删除', '确定删除么???', [
//             { text: '取消', onPress: () => {} },
//             { text: '确定', onPress: () => {
//                 let address=window.localStorage.getItem("user_address");
//                 if(address){
//                     address=JSON.parse(address);
//                     address.arr.splice(index,1)
//                     window.localStorage.setItem("user_address",JSON.stringify(address));
//                     that.setState({
//                         index:null
//                       });
//                       Toast.info('删除成功', 1);
//                 }else{
//                     Toast.info('发生错误', 1);
//                     return
//                 }
//             } },
//           ])
//       }
//       onsubmit(){
//           var that=this;
//           that.props.form.validateFields((error,value) =>{
//             if(!!error){
//                 return
//             }
//             if(!value.name){
//                 Toast.info('名字不能为空', 1);
//             }else if(!value.phone){
//                 Toast.info('电话不能为空', 1);
//             }else if(!value.address){
//                 Toast.info('地址不能为空', 1);
//             }else if(!(/^1[34578]\d{9}$/.test(value.phone))){
//                 Toast.info('电话不正确', 1);
//             }else if(!value.district){
//                 Toast.info('请选择地址', 1);
//             }else{
//                 let address=window.localStorage.getItem("user_address");
//                 var json={
//                     name:value.name,
//                     phone:value.phone,
//                     address:value.address,
//                     district:value.district
//                 }
//                 if(that.state.type=="add"){
//                     if(address){
//                         address=JSON.parse(address);
//                         address.arr.push(json);
//                         window.localStorage.setItem("user_address",JSON.stringify(address));
//                     }else{
//                         let arr={
//                             arr:[]
//                         }
//                         arr.arr.push(json)
//                         window.localStorage.setItem("user_address",JSON.stringify(arr));
//                     }
//                 }else if(that.state.type=="edit"){
//                     if(address){
//                         address=JSON.parse(address);
//                         address.arr[that.state.index]=json;
//                         window.localStorage.setItem("user_address",JSON.stringify(address));
//                     }else{
//                         Toast.info('发生错误', 1);
//                         return
//                     }
//                 }
//                 that.onClose()
//             }
//         })
//       }
//     render(){
//         const { getFieldProps,validateFields } = this.props.form;
//         const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
//         let maskProps;
//         if (isIPhone) {
//           // Note: the popup content will not scroll.
//           maskProps = {
//             onTouchStart: e => e.preventDefault(),
//           };
//         };
//         let address=window.localStorage.getItem("user_address");
//         let has_address=true;
//         if(address){
//             address=JSON.parse(address);
//             if(address.arr.length<1){
//                 has_address=false
//             }
//         }else{
//             has_address=false
//         }
//           return (
//             <div>
//                 {has_address?
//                 address.arr.map((value, index) => (
//                     <div key={index}>
//                     <Card full style={{border:"none"}}>
//                     <Card.Header
//                         title={value.name}
//                         extra={<span>{value.phone}</span>}
//                         onClick={()=>{
//                                 if(this.props.onSelect){
//                                 this.props.onSelect(index);
//                                 this.props.hideModal();
//                             }
//                         }}
//                     />
//                     <Card.Body onClick={()=>{
//                                 if(this.props.onSelect){
//                                 this.props.onSelect(index);
//                                 this.props.hideModal();
//                             }
//                         }}>
//                         <div style={{padding:"0.2rem",textAlign:"left"}}>{value.district+value.address}</div>
//                     </Card.Body>
//                     <Card.Footer extra={<div><Button className={style.btn} style={{marginRight:"0.2rem"}} onClick={()=>{this.onClick("edit",index)}} type="primary" inline size="small">编辑</Button><Button className={style.btn} onClick={()=>{this.onDelete(index)}} inline size="small">删除</Button></div>} />
//                     </Card>
//                     <WhiteSpace size="lg" style={{backgroundColor:"#eeeeee"}}/>
//                     </div>
//                 )):<Result
//                 img={myImg('https://gw.alipayobjects.com/zos/rmsportal/GIyMDJnuqmcqPLpHCSkj.svg')}
//                 title="无收货地址"
//               />}
//                 <Modal
//           visible={this.state.visible}
//           maskClosable={false}
//           animationType="slide-up"
//           transparent="true"
//           className="addressModal"
//         >
//           <div>
//           <List renderHeader={<div style={{ position: 'relative' }}>
//         编辑地址
//         <span
//           style={{
//             position: 'absolute', right: 3, top: -5,
//           }}
//           onClick={() => this.onClose()}
//         >
//           <Icon type="cross" />
//         </span>
//       </div>}
//             className="popup-list"
//           >
//            <InputItem
//           {...getFieldProps('name')}
//         >收货人</InputItem>
//         <InputItem
//           {...getFieldProps('phone')}
//         >联系方式</InputItem>
//         <Picker extra="请选择"
//           data={areas}
//           title="选择地区"
//           {...getFieldProps('district', {
//           })}
//         >
//           <List.Item arrow="horizontal">选择地区</List.Item>
//         </Picker>
//         <InputItem
//           {...getFieldProps('address')}
//         >详细地址</InputItem>
//           </List>
//           <ul style={{ padding: '0.18rem 0.3rem', listStyle: 'none' }}>
//             <li style={{ marginTop: '0.18rem' }}>
//               <Button style={{width:"80%",margin:"auto"}} size="small" type="primary" onClick={() => this.onsubmit()}>确定</Button>
//             </li>
//           </ul>
//         </div>
//         </Modal>
//         <WhiteSpace size="lg" />
//         <Button style={{width:"80%",margin:"auto auto 0.5rem auto"}} size="small" type="primary" onClick={() => this.onClick("add")}>添加收货地址</Button>
//             </div>
//         )
//     }
// }
//
// export default createForm()(connect(({}) => ({}))(Address))
