import React, {Component} from 'react'
import {StyleSheet, View, Text, Keyboard} from 'react-native'
import SearchBar from "./searchBar";
import SearchItem from "./searchItem";
import NoSearchDataView from './noSearchDataView'
import {Longlist, Tip} from 'beeshell';
import {RowLineView} from './style'
import {Loading} from "../../../common/components/loading";
import {inject} from "mobx-react";


@inject(['userStore']) // 注入对应的store

export default class HomeSearchList extends Component {
    // 重新设置导航栏 ,此时需要注意，不能直接使用this, 所有使用传参的方式解决点击事件
    static navigationOptions = ({navigation, screenProps}) => ({
        headerTitle: <SearchBar
            placeholder='手机号/客户姓名'
            textEndChangeAction = {(text) => navigation.state.params.navigateTextEndChangeAction(text)}
        />,
        headerRightContainerStyle: {
            paddingRight: 10,
            fontWeight: '300'
        },
        headerRight: (
            <Text
                style={{fontSize: 16, color: '#FFF', paddingRight: 5}}
                onPress={() => navigation.state.params.navigateRightAction()}
            >
                搜索
            </Text>
        )
    })
    constructor(props) {
        super(props);
        // 获取对应的账号信息
        this.store = this.props.userStore
        this.state = {
            list: [],
            pageNum: 1,
            total: 0,
            inputValue: '',
            isFirstLoad: true
        }
        // 绑定
        this.searchAction = this.searchAction.bind(this)
        this.textEndChangeAction = this.textEndChangeAction.bind(this)
        this.queryInfoList = this.queryInfoList.bind(this)
        this.addNewCustomerAction = this.addNewCustomerAction.bind(this)
    }
    // 组件加载完成时
    componentDidMount() {
        this.props.navigation.setParams({
            navigateRightAction:this.searchAction,
            navigateTextEndChangeAction:this.textEndChangeAction,
        });
    }
    // 点击查询的事件
    searchAction() {
        // 收起键盘
        Keyboard.dismiss();

        // 记录是否点击过搜索
        if (this.state.isFirstLoad) {
            this.setState({
                isFirstLoad: false
            })
        }
        // 查询结果
        this.queryInfoList(1);
    }
    // TextInput输入内容时的回调
    textEndChangeAction(text) {
        // 保存该值
        this.setState({
            inputValue: text
        })
    };
    // 调查询接口
    queryInfoList(num) {
        // 如果明确传入参数，则是刷新或者首次加载
        let pageNum
        if (num) {
            pageNum = 1
        } else {
            // 没有明确参数是下拉刷新
            pageNum = this.state.pageNum + 1
        }
        // 开启菊花
        Loading.show()
        // 请求数据
        return axios.get('/admin/customer/page', {
            params : {
                pageNum,
                pageSize: 20,
                nameOrTelephone:this.state.inputValue
            }
        }).then(({data}) => {
            // 隐藏菊花
            Loading.hidden()
            // 保存值
            this.setState((preState) => {
                let oldList = pageNum == 1 ? [] : preState.list;
                return {
                    pageNum,
                    list: [...oldList, ...data.list],
                    total: data.total
                }
            })
        }).catch(({data}) => {
            // 隐藏菊花
            Loading.hidden()
            Tip.show(data.msg, 1000, 'center');
        })
    }
    // 进入详情界面
    goDetailAction(item) {
        this.props.navigation.navigate('Customers', {customerNo: item.customerNo})
    }
    // 跳转新增客户界面
    addNewCustomerAction() {
        this.props.navigation.navigate('Customers', {serachForm: this.state.inputValue})
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <RowLineView />
                <Longlist
                    data={this.state.list}
                    total={this.state.total}
                    keyExtractor={(item, index) => (item + index)}
                    renderItem={({item}) => {
                        return (
                            <SearchItem item={item} goDetailAction={item => this.goDetailAction(item)} />
                        )
                    }}
                    onEndReachedThreshold={0.1}
                    onEndReached={this.queryInfoList}
                    getItemLayout={(data, index) => {
                        return {length: 110, offset: 110 * index, index}
                    }}
                    renderFooter={(loading, data, total) => {
                        if (data.length && data.length >= total) {
                            return (
                                <View style={footerStyles.contentStyle}>
                                    <Text style={footerStyles.textStyle}>-- 亲，我是有底线的! --</Text>
                                </View>
                            )
                        }else if (!this.state.isFirstLoad && data.length == 0 && !Loading.isLoading()) {
                            return (
                                <NoSearchDataView
                                    alertMsg='没有想要的结果'
                                    isShowCustomerPort={this.store.role.roleCode === 'rolePartnerSale'}
                                    addNewCustomerCallBack={this.addNewCustomerAction}
                                />
                            )
                        }else if (data.length == 0){
                            return <View />;
                        }
                    }}
                />
            </View>
        )
    }
}


const footerStyles = StyleSheet.create({
    contentStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 30
    },
    textStyle: {
        color:'#99999A',
        fontSize: 14,
        textAlign: 'center'
    }
})