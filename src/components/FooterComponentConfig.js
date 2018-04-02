import React from "react";
import { TabBar } from 'antd-mobile';
import { history } from '../config';
import {getAccessDeviceId} from '../models/validator'
import {specifiedMachine} from '../utils/helper'
const Footer = React.createClass({
    getInitialState() {

        let pages = this.props.pages;
        let selectedTab = '';

        pages.map((item) => {
            if(this.props.location.pathname.indexOf(item.key) > -1){
                selectedTab = item.key;
                // return {
                //     selectedTab: item.key,
                //     hidden: false,
                // };
            }

        })
        if(this.props.location.pathname == '/micro'){
            selectedTab = pages[0].key;
        }

        return {
            selectedTab,
            hidden: false,
        };


        // else if(this.props.location.pathname.indexOf('/order') > -1){
        //     return {
        //         selectedTab: 'order',
        //         hidden: false,
        //     };
        // }
        // else{
        //     return {};
        // }
    },
    renderContent(page) {
       // console.log(this.props.location.pathname)
       // if("/micro/" +page !== this.props.location.pathname){

         //   if(this.props.location.pathname.indexOf('market') > -1){
               // console.log(1);
           //     var nearby_Devices  = localStorage.getItem('nearby_Devices')
               // history.push("/market");
               // if(localStorage.getItem('entry') == 'devices'){
                  //  if(!nearby_Devices){
                 //       console.log(2);
             //           history.push("/micro/market");
                    // }else{
                    //     console.log(3);
                    //     const devices  = JSON.parse(localStorage.getItem('nearby_Devices'))
                    //     history.push("/micro/market/classified/" +devices[0].object_id);
                    // }
                //}
                // else{
                //     history.push("/micro/home");
                // }

          //  }else{
            //    console.log(4);
                if(page == 'market'){
                    localStorage.setItem('entry','devices')
                }
                if(page == 'home'){
                    localStorage.setItem('entry','device')
                }



        if(specifiedMachine() && page == 'home'){
            history.push("/micro/?deviceId="+getAccessDeviceId()+"&fixed=1");
        }
        else if( page == 'market'){
            location.href =  '/micro/'+page;
        }
        else{
            history.push('/micro/'+page);
        }



         //   }
        //}
    },
    render() { 

        // let tab = [{title:'首页',key:'home'},{title:'订单',key:'order'}];
        // if(isTestPage()){
        //     tab = [{title:'首页',key:'home'},{title:'活动',key:'activity'},{title:'我的',key:'user'}];
        // }
        //let tab = this.props.pages;




        let tab = specifiedMachine() ?  [{title:'首页',key:'home', icon:require('../assets/staticIcon/homeUp.png'), selectIcon:require('../assets/staticIcon/homeDown.png'),},{title:'订单',key:'order', icon:require('../assets/staticIcon/orderUp.png'), selectIcon:require('../assets/staticIcon/orderDown.png')}] : this.props.pages;


        return (
             <TabBar
                unselectedTintColor="#000000"
                tintColor="#47b34f"
                barTintColor="white"
                hidden={this.state.hidden}

            >
                 {
                     tab.map((item,i)=>(
                         <TabBar.Item
                             icon={
                                 <img className='tabIcon'  src={item.icon}/>
                             }
                             selectedIcon={
                                 <img className='tabIcon'  src={item.selectIcon}/>
                             }
                             title={item.title}
                             key={item.key}
                             selected={this.state.selectedTab === item.key}
                             onPress={() => {
                                 this.setState({
                                     selectedTab: item.key,
                                 });
                                 this.renderContent(item.key)
                             }}
                         > </TabBar.Item>
                     ))
                 }

            </TabBar>
        );
    },
});
export default Footer;