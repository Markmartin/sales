import React, {Component} from 'react'
import {RefreshControl, StyleSheet, Text, View} from 'react-native'
import MsgItem from "./msgItem";
import {Longlist, Tip} from 'beeshell';
import {RowLineView} from '../homeSearchList/style'
import {Loading} from "../../../common/components/loading";
import {messageType} from '../../../common/tool/dictionaries';
import NoSearchDataView from "../homeSearchList/noSearchDataView";
import {inject} from "mobx-react";

@inject(['userStore']) // 注入对应的store

export default class HomeSystemMsgList extends Component {
	constructor(props) {
		super(props);
		// 获取对应的账号信息
		this.store = this.props.userStore
		this.state = {
			list: [],
			pageNum: 1,
			total: 0,
			isFirstLoad: true,
			isLoading: false
		}
		// 绑定
		this.getMsgInfoList = this.getMsgInfoList.bind(this)
		this.msgTypeStringForKey = this.msgTypeStringForKey.bind(this)
	}

	// 组件加载完成时
	componentDidMount() {
		// 记录是否点击过搜索
		if (this.state.isFirstLoad) {
			this.setState({
				isFirstLoad: false
			})
		}

		// 获取数据
		this.getMsgInfoList(1);
	}

	// 获取数据
	getMsgInfoList(num) {
		// 如果明确传入参数，则是刷新或者首次加载
		let pageNum
		if (num) {
			pageNum = 1
		} else {
			// 没有明确参数是下拉刷新
			pageNum = this.state.pageNum + 1
		}
		// 开启加载效果
		Loading.show()
		// 请求数据
		return axios.get('/admin/satmess/page', {
			params: {
				pageNum,
				pageSize: 20
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
					total: data.total,
					isLoading: false
				}
			})
		}).catch(({data}) => {
			// 隐藏菊花
			Loading.hidden()
			// 关闭刷新消息
			this.setState({isLoading: false});
			Tip.show(data.msg, 1000, 'center');
		})
	}

	// 跳转详情界面
	goDetailAction(item) {
		if (item.customerNo.length == 0) {
			Tip.show('customerNo为null', 1000, 'center');
			return;
		}
		// 根据状态的不同，跳转不同的界面
		let routerName = this.msgTypeStringForKey(item)
		// 当routerName为空时，禁止跳转
		if (routerName.length == 0) {
			Tip.show('暂无相对应的详情界面', 1000, 'center');
			return;
		}
		// 不同的类型，传不同的参数
		let param = null
		switch (parseInt(item.type)) {
			case 1: {// 新线索分配
				if (this.store.role.roleCode === 'rolePartnerSaleManager') {// 发给销售经理
					param = {};
				} else if (this.store.role.roleCode === 'rolePartnerSale') {// 发给销售顾问
					param = {customerNo: item.customerNo, clues: item};
				}
				break;
			}
			case 2: {// 申请试驾
				param = {customerNo: item.customerNo, clues: item};
				break;
			}
			case 3: {// 订单创建
				param = {orderNo: item.businessKey};
				break;
			}
			case 4: {// 战败申请
				param = {applyId: item.businessKey};
				break;
			}
			case 5: {// 交车
				param = {handleId: item.customerNo};
				break;
			}
			case 21: {// 试驾
				param = {state: 0, driveId: item.businessKey, isFromMsg: true};
				break;
			}
			case 22: {// 试驾成功
				param = {state: 0, driveId: item.businessKey, isFromMsg: true};
				break;
			}
			case 23: {// 试驾评价
				param = {state: 0, driveId: item.businessKey, isFromMsg: true};
				break;
			}
			case 31: {// 订单取消（退订）
				if (this.store.role.roleCode === 'rolePartnerHandleVehicle') {// 交车资料详情
					param = {handleId: item.customerNo, isFromMsg: true};
				} else {// 订单详情页
					param = {orderNo: item.businessKey};
				}
				break;
			}
			case 32: {// 撤销订单取消（退订）
				param = {orderNo: item.businessKey};
				break;
			}
			case 41: {// 战败审批
				param = {applyId: item.businessKey};
				break;
			}
			case 42: {// 战败分配
				param = {applyId: item.businessKey, customerNo: item.customerNo};
				break;
			}
			case 43: {// 同意战败
				param = {applyId: item.businessKey};
				break;
			}
			case 44: {// 驳回战败
				param = {applyId: item.businessKey};
				break;
			}
			case 51: {// 交车成功
				param = {orderNo: item.businessKey};
				break;
			}
			case 52: {// 交车评价
				param = {handleId: item.customerNo, isFromMsg: true};
				break;
			}
			default:
				break;
		}
		if (!param) {
			Tip.show('消息类型有误，传参为null', 1000, 'center');
			return;
		}
		// 跳转
		this.props.navigation.navigate(routerName, param);
	}

	// 将key转换成对应的字符串
	msgTypeStringForKey(item) {
		let key = item.type;
		if (!key) return ''
		let obj = null
		messageType.filter((msgItem) => {
			// 判断消息类型是否相等
			if (msgItem.dictKey == key) {
				// 是否需要判断操作的roleCode
				if (msgItem.pushRoleCode) {
					if (msgItem.pushRoleCode == item.operaRoleCode) {
						// 是否需要判断接收的roleCode
						if (msgItem.getRoleCode) {
							if (msgItem.getRoleCode == this.store.role.roleCode) {
								obj = msgItem;
							}
						} else {
							obj = msgItem;
						}
					}
				} else {
					// 是否需要判断接收的roleCode
					if (msgItem.getRoleCode) {
						if (msgItem.getRoleCode == this.store.role.roleCode) {
							obj = msgItem;
						}
					} else {
						obj = msgItem;
					}
				}
			}
		})
		if (!obj) return '';
		return obj.routerName;
	}

	render() {
		return (
			<View style={{flex: 1}}>
				<RowLineView/>
				<Longlist
					data={this.state.list}
					total={this.state.total}
					renderItem={({item}) => {
						return (
							<MsgItem item={item} goDetailAction={item => this.goDetailAction(item)}/>
						)
					}}
					refreshControl={
						<RefreshControl
							refreshing={this.state.isLoading}
							onRefresh={() => {
								this.setState({
									isLoading: true
								})
								// 刷新数据
								this.getMsgInfoList(1);
							}}
						/>}
					onEndReachedThreshold={0.1}
					onEndReached={this.getMsgInfoList}
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
						} else if (!this.state.isFirstLoad && data.length == 0 && !Loading.isLoading()) {
							return <NoSearchDataView alertMsg='暂无系统消息'
													 addNewCustomerCallBack={this.addNewCustomerAction}/>
						} else if (data.length == 0) {
							return <View/>;
						}
					}}
				/>
			</View>
		);
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
		color: '#99999a',
		fontSize: 14,
		textAlign: 'center'
	}
})
