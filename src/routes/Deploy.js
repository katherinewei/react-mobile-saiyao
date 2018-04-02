import React from "react";
import {history} from "../config";
import {connect} from "dva";

const Deploy = ({location,dispatch,devices:{nearby_Devices}}) => {
    //var nearby_Devices  = localStorage.getItem('nearby_Devices')
    //console.log(nearby_Devices)
   // const path = location.search;

     if(nearby_Devices.device && nearby_Devices.device.length > 0){
         localStorage.setItem('nearby_Devices', JSON.stringify([nearby_Devices.device[0]]));
         history.push("/micro/market/classified/" +nearby_Devices.device[0].object_id);
     }
    // let pathname = '';
    // if(path &&  path.oid){
    //     pathname = '?oid='+path.oid + '&ignore='+path.ignore;
    // }
   // if(!nearby_Devices){
     //   history.push("/micro/market/home"+pathname);
    //}else{
        //const devices  = JSON.parse(localStorage.getItem('nearby_Devices'))
      //  history.push("/micro/market/classified/" +nearby_Devices.device[0].object_id+path);
    //}

    return (
        <div>

        </div>
    )
}

export default  connect(({devices}) => ({devices}))(Deploy);

