import React, {PropTypes} from "react";
import {Router, Route, IndexRoute} from "dva/router";


import OrderFormOnline from './routes/OrderFormOnline'
import Cart from './routes/Cart'
import OrderTab from './routes/OrderTab'
import Address from './routes/Address'
import Product from './routes/Product'
import ProductActivity from './routes/ProductActivity'
import Classified from "./routes/Classified";
import Deploy from "./routes/Deploy";

import Me from './routes/User'
import HomeCard from "./routes/HomeCard"
import Register from './routes/Register'
import RegisterAgreement from './routes/RegisterAgreement'
import Cards from './routes/Cards'
import Recharge from './routes/Recharge'
import NotFound from './routes/404'
import NoCard from './routes/noCard'

import HomeConfig from "./routes/HomeConfig"
import indexConfig from './routes/IndexConfig'

import clearStorage from './routes/clearStorage'


export default function ({history}) {
    return (
        <Router history={history}>
            <Route path="/micro"  component={HomeConfig}>
                <IndexRoute component={indexConfig}/>
                {/*<Route path="/" component={Home}>*/}
                    {/*<IndexRoute component={IndexOnline}/>*/}
                    <Route path="home" component={indexConfig} />
                {/*</Route>*/}
                <Route path="market" component={HomeConfig}>
                    <IndexRoute component={Deploy}/>
                    <Route path="classified/:deviceId" component={Classified} />
                </Route>

                <Route path="cart" component={Cart}/>
                <Route path="order" >
                    <IndexRoute component={OrderTab}/>
                </Route>
                <Route path="user" component={Me}/>
                <Route path="address" component={Address}/>
                <Route path="orderFormOnline" component={OrderFormOnline}/>
            </Route>
            <Route path="/cards/" component={HomeCard}>
                <IndexRoute component={Cards}/>
                <Route path="recharge" component={Recharge}/>
                <Route path="register" component={Register}/>
                <Route path="noCard" component={NoCard}/>
                <Route path="registerAgreement" component={RegisterAgreement}/>
            </Route>

            <Route path="order" >
                <IndexRoute component={OrderTab}/>
            </Route>
            <Route path="/cards" component={Cards}/>
            <Route path="product" component={ProductActivity}/>
            <Route path="detail" component={Product}/>
            <Route path="clear" component={clearStorage}/>

            <Route path="*" component={NotFound}/>
        </Router>
    )
}
