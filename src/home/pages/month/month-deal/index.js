import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors, size} from "../../../../style/variables";
import {withNavigationFocus} from "react-navigation";
// 样式组件
import {TopSort, TopSortItem, Line} from './styles';
import ClientList from "../../../components/client-list";
import navigation from "../../../../common/services/navigation";
import SortTab from '../../../../common/components/sort-tab'
import {sortBy,cloneDeep} from "lodash";


/*
*  月交车目标
* */

class MonthDeal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataList: [],
            refreshing: false
        }
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
        axios.get('/admin/handleVehicle/allList')
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    dataList: responseJson.data
                });

            })
            .catch((error) => {
                console.error(error);
            });
    }
    sort(item) {
        let type = ''
        if(item.state === 'chevron-up'){
            type = 'asc'
        }else{
            type = 'desc'
        }
        let data = cloneDeep(this.state.dataList)
        sortBy(data,['level'],[type])
    }
    openPage(item) {
        // 跳转在此
        navigation.navigate('Detail', {handleId: item.handleId})
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: colors.background}}>
                {/* 顶部 */}
                <SortTab tabs={['级别', '成交时间']}
                         callBack={item => this.sort(item)}/>
                {/*   列表部分 */}
                <ClientList data={this.state.dataList}
                            money={true}
                            timeKey="finishDate"
                            onRefresh={this.getDataList}
                            onPage={this.openPage.bind(this)}
                            refreshing={this.state.refreshing}/>
            </View>
        );
    }
}
export default withNavigationFocus(MonthDeal)
const styles = StyleSheet.create({
    listBox: {
        paddingHorizontal: 16,
        backgroundColor: '#fff'
    },
    item: {
        flexDirection: 'row',
        marginBottom: 12
    },
    user: {
        color: `${colors.grey0}`,
        fontSize: 16,
        marginRight: 12
    },
    listRightCont: {
        alignSelf: 'center',
        fontSize: 14
    },
    listRightIcon: {
        width: 15,
        height: 15,
        marginLeft: 6,
        alignSelf: 'center'
    },
    vehicle: {
        fontSize: 14,
        color: `${colors.grey3}`,
        marginRight: 12
    },
    money: {
        color: '#10A627',
        fontSize: 16,
    },
    symbol: {
        color: '#10A627',
        fontSize: 12,
    }
})
