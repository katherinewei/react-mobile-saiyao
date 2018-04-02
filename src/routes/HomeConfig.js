import React, { 
    Component
} from 'react';
import {connect} from "dva";
import styles from "./Home.less";
import Footer from '../components/FooterComponentConfig';
import {getQRImage,IsPC} from '../utils/helper'

class Home extends Component {
    
    render() {
    const preview = location.search.indexOf('preview') > -1;
        return (

            <div className={styles.mainConstentStyle} style={{height:preview ? '100%' : ' 96.5%',width:preview && IsPC() ? 360 : '100%',margin:'0 auto'}}>

                <div className={styles.contentStyle} id="endings-content">
                    {this.props.children}
                </div>

                {preview ?   (IsPC() && <div className={styles.erw}><p>手机预览</p><img  src={getQRImage(location.href)} /></div> ): <Footer location={this.props.location} pages={this.props.shop.pages}/>}
            </div>
        )
    }
}

export default connect(({home,shop}) => ({home,shop}))(Home)
