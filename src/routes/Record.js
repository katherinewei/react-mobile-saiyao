import React from "react";
import {Tabs } from 'antd-mobile';
import styles from './cards.less';
import {connect} from "dva";
import { history } from '../config'
import Record from '../components/Record'
import {getString} from '../utils/helper'
const TabPane = Tabs.TabPane;
const Records =({dispatch,record:{activeKey,recharge,consumption,loading}}) =>{
    
    function callback(value) {
        dispatch({
            type: 'record/setQuest',
            activeKey:value
        })
        //history.push('/record/' + value)
        if(value == 'consumption'){
            dispatch({type: 'record/fetchRecord',consumption:true})
        }
        else{
            dispatch({type: 'record/fetchRecord'})
        }
    }

    return (
        <div>
            {/*{*/}
                {/*loading ? <Spin /> : ''*/}
            {/*}*/}
            <div className={styles.card}>
                <Tabs defaultActiveKey={activeKey} onChange={callback} swipeable={false}>
                    <TabPane tab={getString('record_consumption')} key="consumption">
                            <Record  {...consumption}  activeKey={activeKey}/>
                    </TabPane>
                    <TabPane tab={getString('record_recharge')} key="recharge">
                            <Record {...recharge} />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    )
}
export default (connect(({record}) => ({record}))(Records))