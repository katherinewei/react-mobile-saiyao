import React from "react";
import ReactDOM from 'react-dom';
import {connect} from "dva";
import {PullToRefresh ,ListView,Toast,Result} from 'antd-mobile';
import style from '../routes/ordertab.less';
import UnpaidOrder from './UnpaidOrderComponent';
import UnpickUpOrder from './UnpickUpOrderComponent';
import Panel from '../components/PanelComponent';
class GoodsList extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.state = {
            dataSource,
            refreshing: true,
            height: document.documentElement.clientHeight,
            pagesIndex:1,
            pageIndex:1,
        };
    }

    genData(pIndex = 1,cb) {

        let type=this.props.type;
        console.log(type)
        if(type!=-1){
            this.props.dispatch({type: 'order/fetchOrders',payload:{status:type,page:pIndex},cb})
        }else{
            this.props.dispatch({type: 'order/fetchOrders',payload:{page:pIndex},cb})
        }
    }
    componentDidMount() {
        // Set the appropriate height
        setTimeout(() => this.setState({
            height: this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop,
        }), 0);

        this.lv.getInnerViewNode().addEventListener('touchstart', this.ts = (e) => {
            this.tsPageY = e.touches[0].pageY;
        });

        const scrollNode = document.scrollingElement ? document.scrollingElement : document.body;
        this.lv.getInnerViewNode().addEventListener('touchmove', this.tm = (e) => {
            this.tmPageY = e.touches[0].pageY;
            if (this.tmPageY > this.tsPageY && this.scrollerTop <= 0 && scrollNode.scrollTop > 0) {
                this.domScroller.options.preventDefaultOnTouchMove = false;
            } else {
                this.domScroller.options.preventDefaultOnTouchMove = undefined;
            }
        });
    }

    componentWillUnmount() {
        this.lv.getInnerViewNode().removeEventListener('touchstart', this.ts);
        this.lv.getInnerViewNode().removeEventListener('touchmove', this.tm);
    }

    onScroll = (e) => {
        this.scrollerTop = e.scroller.getValues().top;
        this.domScroller = e;
    };

    onRefresh = () => {

        if (!this.manuallyRefresh) {
            this.setState({ refreshing: true });
        } else {
            this.manuallyRefresh = false;
        }

        // simulate initial Ajax
        function cb(that){
            return function(data){
                var orders=data.orders;
                that.rData =orders;
                that.setState({
                    dataSource: that.state.dataSource.cloneWithRows(that.rData),
                    refreshing: false,
                    showFinishTxt: true,
                    pagesIndex:data.pages,
                    pageIndex:data.page
                });
                //console.log(that)
                if (that.domScroller) {
                    that.domScroller.scroller.options.animationDuration = 500;
                }
            }
        }
        this.setState({
            pageIndex:1
        });
        var that=this;
        this.genData(this.state.pageIndex,cb(this))
    };

    onEndReached = (event) => {

        if (this.state.isLoading && !this.state.hasMore) {
            return;
        }

        if(this.state.refreshing){
            return;
        }
        if(this.state.pagesIndex-this.state.pageIndex<1){
            Toast.info('无更多订单', 1);
            return
        }
        this.setState({ isLoading: true });

        function cb(that){
            return function(data){
                var orders=data.orders;
                that.rData = [...that.rData, ...orders];
                that.setState({
                    dataSource: that.state.dataSource.cloneWithRows(that.rData),
                    isLoading: false,
                    pagesIndex:data.pages,
                    pageIndex:data.page
                });
            }
        }
        this.setState({
            pageIndex:this.state.pageIndex+1
        });
        this.genData(this.state.pageIndex,cb(this))
    };
    del_cb(){
        var that=this;
        return function (object_id){
            Toast.info('删除成功', 1);
            that.onRefresh();
            //  var json=that.rData;
            //  for(var i=0;i<json.length;i++){
            //    if(json[i].object_id==object_id){
            //      json.splice(i,1);
            //    }
            //  }
            //  //console.log(json)
            //  that.setState({
            //    dataSource: that.state.dataSource.cloneWithRows(json)
            //  });
            //console.log(that.state.dataSource)
        }
    }
    scrollingComplete = () => {
        // In general, this.scrollerTop should be 0 at the end, but it may be -0.000051 in chrome61.
        if (this.scrollerTop >= -1) {
            this.setState({ showFinishTxt: false });
        }
    }

    renderCustomIcon() {
        return [
            <div key="0" className="am-refresh-control-pull" style={{fontSize:"0.4rem"}}>
                <span>{this.state.showFinishTxt ? '刷新完毕' : '下拉可以刷新'}</span>
            </div>,
            <div key="1" className="am-refresh-control-release" style={{fontSize:"0.4rem"}}>
                <span>松开立即刷新</span>
            </div>,
        ];
    }

    render() {
        //console.log(this.state.dataSource.getRowCount())
        const separator = (sectionID, rowID) => (
            <div
                key={`${sectionID}-${rowID}`}
                style={{
                    backgroundColor: '#F5F5F9',
                    height: "0.266666rem",
                }}
            />
        );
        const row = (rowData, sectionID, rowID) => {

            if (rowData.status == 0||rowData.status == 1||rowData.status == 9) {
                return (
                    <UnpaidOrder del_cb={this.del_cb()} order={rowData} dispatch={this.props.dispatch} key={rowData.object_id}/>
                )
            } else if (rowData.status == 5) {
                return (
                    <UnpickUpOrder orders={rowData} dispatch={this.props.dispatch} key={rowData.object_id} />
                )
            }else{
                return <div></div>
            }
            // return (
            //   <Card full key={rowID} style={{border:"none"}}>
            //       <Card.Header
            //       title={rowData.title}
            //       thumb={rowData.img}
            //       extra={<span>￥{rowID}</span>}
            //       thumbStyle={{width:"30%"}}
            //       />
            //       <Card.Body className={style.cardbody}>
            //           <div>共1件</div>
            //       </Card.Body>
            //       <Card.Footer extra={<Button className={style.orderTabbtn} type="primary" size="small" inline>付款</Button>} />
            //   </Card>
            // );
        };

        const _this = this.props;
        const panelProps = {
            ..._this.order,
            onClose() {
                _this.dispatch({type: 'order/hideModal'})
            },
        };
        return (
            <div>
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}
                    renderFooter={() => (<div style={{ padding: '0.3rem', textAlign: 'center' }}>
                        {this.state.isLoading ? 'Loading...' : 'Loaded'}
                    </div>)}
                    renderRow={row}
                    renderSeparator={separator}
                    initialListSize={5}
                    pageSize={5}
                    style={{
                        height:"calc("+this.state.height+"px - 1.33333333rem)",
                        display:this.state.dataSource.getRowCount()==0?"none":"block"
                    }}
                    scrollerOptions={{ scrollbars: true, scrollingComplete: this.scrollingComplete }}
                    pullToRefresh ={<PullToRefresh
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                        icon={this.renderCustomIcon()}
                    />}
                    onScroll={this.onScroll}
                    scrollRenderAheadDistance={200}
                    scrollEventThrottle={20}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={10}
                />
                <div style={{paddingTop:"3.466666rem"}}>
                    <Result
                        imgUrl="https://zos.alipayobjects.com/rmsportal/NRzOqylcxEstLGf.png"
                        title='暂无订单信息'
                    />
                </div>

                {panelProps.number && <Panel {...panelProps}/>}
            </div>
        );
    }
}
export default connect(({order}) => ({order}))(GoodsList)