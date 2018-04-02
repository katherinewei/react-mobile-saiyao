import React from "react";
import style from './productsComponent.less';
import { getPrice } from '../utils/helper'


function Products({
	items,
	expired,
	id
}) {
	for(var i=0;i<items.length;i++){
		if (items[i].img.endsWith('.jpg') || items[i].img.endsWith('.png')) {
			items[i].imgs = items[i].img;
		} else {
			items[i].imgs = items[i].img + '-200x200.jpg';
		}
		if(items[i].imgs.indexOf("https") > 0 ){
		}else{
			items[i].imgs = items[i].imgs.replace("http","https");
		}
	}
	//console.log(1);
	const soldOutImg = require('../assets/staticIcon/expired.png'); 
	return (
		<div>
			{items.map((item,i) =>{
			return (<div key={i} className={style.contentStyle}>
				<div className={style.imgContainerStyle}>
					<img src={item.imgs} alt="" className={style.imgStyle}/>
					{expired === true ? <img src={'/'+soldOutImg} alt="" className={style.soldOutImgStyle} /> : ''}
				</div>
				<div className={style.informationContainerStyle}>
					<div className={style.titleAndNumContainerStyle}><span className={style.titleStyle}>{item.name}</span>
						</div>
					<p className={style.priceStyle}>
					<span className={style.priceBox}>
					<span className={style.priceSignStyle}>{'¥'}</span>{getPrice(item.price)}</span>
					<span className={style.numStyle}>{"x"}{item.quantity}</span>
					</p>
				</div>
			</div>)
		})}
		</div>
	);
}
export default Products;

