import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {colors} from "../../../../style/variables";
// 样式组件
import ClientList from "../../../components/client-list";
import SortTab from "../../../../common/components/sort-tab";
import {orderBy, cloneDeep} from 'lodash'
import navigation from "../../../../common/services/navigation";
import {withNavigationFocus} from "react-navigation";

/*
* 月订单目标
 */

 class MonthDeal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataList: [],
            refreshing: false,
            applyCountValue:0,
            levelASC: true,     // 级别正序
        }
        this.onPressButton = this.onPressButton.bind(this)
        this.getDataList = this.getDataList.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }
    // 获取焦点时刻
    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (this.props.isFocused) {
            // 如果reload了不再请求
            if (this.reload) return null
            this.getDataList()
            // 标记reload
            this.reload = true
        } else {
            this.reload = false
        }
        return null
    }

    getDataList() {
        axios.get('/admin/orderCustomer/allList')
            .then((response) => {
                this.setState({
                    refreshing: false,
                    dataList: response.data
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    onPressButton() {

    }

    sort(item) {
        let type = null
        let data = cloneDeep(this.state.dataList)
        if(item.state === 'chevron-up'){
            type = 'asc'
        }else{
            type = 'desc'
        }
        this.setState({
            dataList: orderBy(data,['createTime'],[type])
        })
    }

    openPage(item) {
        navigation.navigate('OrderInquireDetails', {'orderNo': item.orderNo})
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: colors.background}}>
                {/* 顶部 */}
                <SortTab tabs={['成交时间']}
                         callBack={item => this.sort(item)}/>
                {/*   列表部分 */}
                <ClientList data={this.state.dataList}
                            onRefresh={this.getDataList}
                            onPage={this.openPage.bind(this)}
                            refreshing={this.state.refreshing}/>
            </View>
        );
    }
}
export default withNavigationFocus(MonthDeal)
