import React from "react";
import {Button} from 'antd-mobile'
import {getAccessToken} from '../models/validator'
class Clear extends React.Component {

    render() {
       function clearStorage() {
           localStorage.clear()
       }

        return (
            <div>
                <Button onClick={()=>clearStorage()}>清除缓存</Button>
            </div>
        );
    }
}

export  default Clear