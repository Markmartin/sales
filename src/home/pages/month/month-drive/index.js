import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from "../../../../style/variables";
// 样式组件
import {Line, TopSort, TopSortItem} from '../month-deal/styles';
import ClientList from "../../../components/client-list";
import navigation from "../../../../common/services/navigation";
import SortTab from "../../../../common/components/sort-tab";
import {orderBy} from "lodash";
import {withNavigationFocus} from "react-navigation";

// 试驾

 class MonthDeal extends Component {
    constructor(props) {
        super(props)
        this.fields = ['level', 'completeDriveTime']
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
        axios.get('/admin/satTestDrive/allList')
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
    sort(item) {
        const {selectedIndex, state} = item
        const chevron = state === 'chevron-up' ? 'asc' : 'desc'
        const field = this.fields[selectedIndex]
        const data = orderBy(this.state.dataList, [field], [chevron])
        this.setState({
            dataList: data
        })
    }
    openPage(item) {
        navigation.navigate('DriveDetails', {driveId: item.driveId})
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: colors.background}}>
                {/* 顶部 */}
                <SortTab tabs={['级别', '试驾时间']}
                         callBack={item => this.sort(item)}/>
                {/*   列表部分 */}
                {
                    <ClientList data={this.state.dataList}
                    onRefresh={this.getDataList}
                    timeKey="completeDriveTime"
                    onPage={this.openPage.bind(this)}
                    refreshing={this.state.refreshing}/>
                }

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
