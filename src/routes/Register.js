import React from "react";
import {Link} from "dva/router";
import { request } from "../utils/request";
import { List,InputItem,WhiteSpace,Button,Toast ,Checkbox,Icon} from 'antd-mobile';
import styles from './register.less';
import {connect} from "dva";
import {redirect_card, history } from '../config'
import {getString,validatorTip} from '../utils/helper'
import { createForm } from 'rc-form';
import CustomIcon from '../components/CustomIcon'
const AgreeItem = Checkbox.AgreeItem;
const Register =({dispatch,register:{hasErrors,nextPage,canClick,name},form:{getFieldValue,getFieldsValue,getFieldProps,validateFields}}) =>{

    function formatPhone(value) {
        if(!value){
            validatorTip(getString('register_phone_hint'))
            return;
        }
        value = value.replace(/\s/g, '');
        return value
    }
    function onChange(value) {
        dispatch({type:'register/setQuest',hasErrors:[!(/^1[34578]\d{9}$/).test(formatPhone(value)),hasErrors[1]]})
    }
    function sendCode() {
        if(canClick){
            const value = { ...getFieldsValue()}
            let phone = nextPage ? name : formatPhone(value.name);
            // if(!phone){
            //     validatorTip(getString('register_phone_hint'))
            //     return;
            // }

            if((/^1[34578]\d{9}$/.test(phone))){
                dispatch({type:'register/setQuest',name:phone});

                const verify = request(redirect_card+'verify/sms', {
                    method: 'post',
                    body: {name: phone},
                    isToken: false
                });
                if (verify.code && verify.code!= 0) {
                    message.error(verify.code);
                }else{
                    dispatch({type:'register/setQuest',nextPage:true,canClick:false})

                    let intDiff = 90;
                    window.setInterval(function(){
                        const code = document.getElementById("code");
                        if(code){
                            let  second=0;//时间默认值
                            if(intDiff > 0){
                                const btn = document.getElementById("btn");
                                btn.setAttribute('class','disabled');
                                second = intDiff;
                                code.innerHTML ="(" +second+getString('register_code_resend_tip')+")"
                            }

                            if(intDiff==0  &&  intDiff >= 0 ){
                                dispatch({type:'register/setQuest',canClick:true})
                                code.innerHTML = " "
                                btn.setAttribute('class','');
                            }
                            intDiff--;
                        }else{
                            window.clearInterval;
                        }

                    }, 1000);
                }
            }else{
                validatorTip(getString('register_phone_hint_err'))
                //Toast.fail(getString('register_phone_hint_err'));
            }
        }
    }
    function onSelect(e) {
        dispatch({type:'register/setQuest',canClick:e.target.checked})
    }
    function onSubmit() {
        validateFields((error,value) =>{
            if(!!error){
                validatorTip(getString('register_code_hint_err'))
                return
            }
            value.cno = name;
            dispatch({type:'register/register',payload:value})
        })
    }



    return (
        <div className="register">
            {nextPage ?   <List  className={styles.list}>
                    <p className={styles.phone}>{getString('register_your_phone')}： {name}</p>
                    <p className={styles.tip}>{getString('register_code_tip')}：</p>
                    <InputItem  className={styles.input+' inputCode'}
                                type="number"
                                placeholder=""
                                {...getFieldProps('code',{rules: [{required: true,pattern:/^\d{4}$/}]})}
                                maxLength={4}
                    ><CustomIcon type={require('../assets/svgDirs/safe.svg')} className={styles.safe}/></InputItem>
                    <p className={styles.resend}><b id="btn"  onClick={() => sendCode()}>{getString('register_code_resend')}</b><span id="code"/> </p>
                    <Button className={styles.regBtn} type="primary" size="large" onClick={() => onSubmit()} >{getString('register_next')}</Button>
                </List> :   <List className={styles.list} >
                    <p className={styles.getCardTip}>正在领取<span>{getString('title')}</span>的会员卡</p>
                    <InputItem className={styles.input}
                               type="phone"
                               placeholder={getString('register_phone_hint')}
                               //error={hasErrors[0]}
                               clear={true}
                               {...getFieldProps('name',{onChange,rules: [{required: true,pattern:/^1[34578]\d{9}$/}]})}
                    >+86 <span /></InputItem>
                    <p className={styles.tip}>{getString('register_phone_tip')}</p>
                    <WhiteSpace size="xl"/>
                    <Button className={styles.regBtn} type="primary" size="large" onClick={() => sendCode()} >{getString('register_next')}</Button>

                    <AgreeItem className={styles.Agree} data-seed="logId" defaultChecked={true} onChange={e => onSelect(e)}>
                        {getString('register_agree')} <Link to="/cards/registerAgreement">{getString('register_agreement')}</Link>
                    </AgreeItem>
                </List>}
        </div>

    )
}
export default createForm()(connect(({register}) => ({register}))(Register))