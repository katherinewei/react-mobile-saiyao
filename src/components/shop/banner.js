import React from "react";
import { Carousel} from 'antd-mobile';
import {connect} from "dva";
import {Link} from 'dva/router'
import style from './rubikCube.less'
import {history} from '../../config'
import {ImgUrlChange} from '../../utils/helper'
const Banner = ({dispatch,images,image_type,shop:{height}}) => {

    const styles = image_type == 2 ? style.flex : style.block;


    function handleLink(url,way,linkMarketType) {

        way == 1 ? history.push(`/detail?id=${url}`) :  way == 3 ?  history.push(`/product?id=${url}&activity=${linkMarketType == 'discount' ? 'SecondKill':'bulk'}`) : location.href = url;
        //url.startsWith('http') ? location.href = url : history.push(`/detail?id=${url}`);
    }


    const banner = () => (
        images.map((val,i) => (
            <Link onClick={() => handleLink(val.linkUrl,val.linkUrlWay,val.linkMarketType)}  key={i} className={style.bannerItem}>
            <img
                 src={ImgUrlChange(val.imageUrl)}
                 style={{ width:'100%', verticalAlign: 'top', height: height}}
                 onLoad={() => {
                     dispatch({type: 'shop/setStatus', height: 'auto'})
                 }}
            />
                {val.linkTitle && <p><span>{val.linkTitle}</span></p>}</Link>
        )))

    return <div>
        {image_type == 3 ?
                <Carousel
                    autoplay={false}
                    infinite
                    selectedIndex={0}
                    className="indexCarousel"
                >
                    {banner()}
                </Carousel> :  <div className={style.cube + ' ' + styles}>{banner()}</div>}

    </div>
}
export default connect(({shop}) => ({shop}))(Banner)