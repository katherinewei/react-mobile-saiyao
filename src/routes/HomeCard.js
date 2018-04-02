import React, {Component} from 'react';
import {connect} from "dva";
import styles from "./Home.less";



class Home extends Component {
    
    render() {

        const pathname = location.pathname;
        const isReg = pathname.indexOf('/recharge') > -1;
        return (
            <div className={styles.mainConstentStyle} style={{height:'100%'}}>
                <div className={styles.contentStyle} id="cards-content" style={{backgroundColor:isReg ? '#f2f2f2' :'#fff',height:'100%' }}>
                    {/*<Header/>*/}
                    {this.props.children}
                </div>
        </div>
        )
    }
}

export default connect(({Home}) => ({Home}))(Home)
