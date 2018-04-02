import React from "react";
import style from './title.less'
import {connect} from "dva";


const Title = ({dispatch,title,subTitle}) => {


    return (

        <div>
            <div className={style.subTitle + ' ' + (!subTitle && style.subTitle2)}>{title}<span>{subTitle}</span></div>
        </div>
    )
}

export default (Title)
