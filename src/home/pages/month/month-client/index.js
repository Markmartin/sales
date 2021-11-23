import React, {Component} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {colors} from "../../../../style/variables";
// 样式组件
import ClientList from "../../../components/client-list";
import SortTab from '../../../../common/components/sort-tab'
import {cloneDeep, orderBy} from 'lodash'
import {withNavigationFocus} from "react-navigation";
/*
* 月新增客户
 */

class MonthDeal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataList: [],
            refreshing: false
        }
        this.onPressButton = this.onPressButton.bind(this)
        this.getDataList = this.getDataList.bind(this)
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

    componentDidUpdate(prevProps, prevState, snapshot) {
    }
    getDataList() {
        axios.get('/admin/customer/allList')
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

    levelHandel(type) {
        let data = cloneDeep(this.state.dataList)
        this.setState({
            dataList: orderBy(data, ['level'], [type])
        })
    }

    timeHandel(type) {
        let data = cloneDeep(this.state.dataList)
        this.setState({
            dataList: orderBy(data, ['createTime'], [type])
        })
    }

    sort(item) {
        if (item.selectedIndex === 0) {
            //    点击级别
            if (item.state === 'chevron-up') {
                this.levelHandel('asc')
            } else {
                this.levelHandel('desc')
            }
            return
        }
        if (item.selectedIndex == 1) {
            // 建档时间
            if (item.state === 'chevron-up') {
                this.timeHandel('asc')
            } else {
                this.timeHandel('desc')
            }
        }
        // 使用lodash sortBy 函数进行排序 设置setState
    }

    openPage(item) {
        if (!item.customerNo) {
            Alert.alert('提示', '数据有问题，customerNo不可用')
            return
        }
        this.props.navigation.navigate('Customers', {customerNo: item.customerNo})
    }

    render() {
        return (
            <View style={{flex: 1}}>
                {/* 顶部 */}
                <SortTab tabs={['级别', '建档时间']}
                         callBack={item => this.sort(item)}/>
                {/*   列表部分 */}
                <ClientList data={this.state.dataList}
                            onRefresh={this.getDataList}
                            timeKey="custCreateTime"
                            onPage={this.openPage.bind(this)}
                            refreshing={this.state.refreshing}/>
            </View>
        );
    }
}
export default withNavigationFocus(MonthDeal)
