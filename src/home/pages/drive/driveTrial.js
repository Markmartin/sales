/**
 * 试乘试驾-已试驾
 */
import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Longlist} from 'beeshell';
import {colors} from "../../../style/variables";
import {ButtonGroup} from "react-native-elements";
import navigation from '../../../common/services/navigation'
import Icon from "react-native-vector-icons/dist/Feather";
import {
    CluesAction,
    CluesCarInfo,
    CluesInfo,
    CluesName,
    CluesTimeInfo,
    CluesType,
    CluesUserInfo,
    CluesWrapper
} from "../clues/style";
import {Loading} from "../../../common/components/loading";

export default class DriveTrial extends Component {
    constructor (props) {
        super(props);
        this.state = {
            value: 1,
            pageNum: 1,
            list: [],
            total: 0
        }
        this.changeSelect = this.changeSelect.bind(this)
        this.routeHandle = this.routeHandle.bind(this)
    }
    changeSelect (value) {
        this.setState({
            value: value
        })
        this.refresh(1)
    }
    routeHandle (methods) {
        let value = this.state.value
        if (value === 1) {
            navigation.navigate('Agreement',{methods: methods})
        }
    }
    refresh(num) {
        // 如果明确传入参数，则是刷新或者首次加载
        let pageNum
        if (num) {
            pageNum = 1
        } else {
            // 没有明确参数是下拉刷新
            pageNum = this.state.pageNum + 1
        }
        Loading.show();
        // 请求数据
        // 清空上拉方法禁止拉动
        return axios.get('/admin/user/page', {params: {pageNum, pageSize: 10}})
            .then(({data}) => {
                Loading.hidden();
                // 判断如果是刷新则清空数据
                this.setState(
                    (prevState) => {
                        let oldList = pageNum === 1 ? [] : prevState.list
                        return { pageNum,
                            list: [...oldList, ...data.list],
                            total: data.total
                        }
                    })
            }).catch(error => {
                Loading.hidden();
            })
    }
    componentDidMount() {
        // 获取线索数据
        this.refresh(1)
    }
    render () {
        let buttons = ['待试驾','已试驾'];
        return (
            <View style={{flex:1}}>
                <View>
                    <ButtonGroup
                        selectedIndex={this.state.value}
                        buttons={buttons}
                        containerStyle={styles.tabContainer}
                        textStyle={styles.textStyle}
                        selectedButtonStyle={styles.selectStyle}
                        onPress={this.changeSelect}
                    />
                </View>
                <View style={{flex:1}}>
                    <Longlist
                        ref={c => this._longlist = c}
                        data={this.state.list}
                        total={this.state.total}
                        renderItem={({item, index}) => {
                            return (
                                <CluesWrapper>
                                    <CluesType>
                                        <Text>{item.createBy}</Text>
                                    </CluesType>
                                    <CluesInfo>
                                        <CluesUserInfo>
                                            <View>
                                                <CluesName>{item.realName}</CluesName>
                                            </View>
                                            <View style={{marginLeft: 10}}>
                                                <CluesName>{item.userCode}</CluesName>
                                            </View>
                                        </CluesUserInfo>
                                        <CluesTimeInfo>
                                            <Text>{item.getDate}</Text>
                                        </CluesTimeInfo>
                                        <CluesCarInfo>
                                            <Text>{item.userCode}</Text>
                                        </CluesCarInfo>
                                        <CluesAction>
                                            <Text onPress={() => {this.routeHandle('展厅')}}>{this.state.value === 1 ? '查看详情' : '办理试驾'}</Text>
                                        </CluesAction>
                                    </CluesInfo>
                                </CluesWrapper>
                            )
                        }}
                        onEndReachedThreshold={0.05}
                        onEndReached={() => this.refresh()}
                        onRefresh={() => this.refresh(1)}
                        // 必须 否则容易出问题
                        getItemLayout={(data, index) => {
                            return { length: 94, offset: 94 * index, index }
                        }}
                    />
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    tabContainer: {
        borderColor: colors.primary
    },
    selectStyle: {
        borderColor: colors.primary,
        backgroundColor: colors.primary
    },
    textStyle: {
        color: colors.primary,
    }
});
