import React from "react";
import style from './rubikCube.less'
import {connect} from "dva";
import {Link} from "dva/router";
import { getPrice } from '../../utils/helper'

const Activity = ({dispatch,images,size}) => {

    const styles = size == 2 ? style.flex : style.block;

    return (
        <div>
            <div className={style.cube + ' ' + styles}>
                {images.map((img,i) => {
                    const url = img.linkUrl || 'javascript:void(0);';
                    return (
                        <Link to={url}
                            key={i}
                            rel="noopener noreferrer"
                        >
                            <div
                                className={style.img}
                            >
                                <img src={img.imageUrl}/>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    )
}

export default (Activity)
