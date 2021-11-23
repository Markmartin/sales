import React, {Component} from 'react';
import {Dimensions, Platform, RefreshControl, StatusBar, StyleSheet, Text, View} from 'react-native';
import {colors, size} from "../../../style/variables";
import navigation from "../../../common/services/navigation";
import {Calendar, Longlist, SlideModal} from 'beeshell';
import Icon from "react-native-vector-icons/dist/Feather";
import {SearchBarView} from "../homeSearchList/searchBar";
import OrderItem from "./orderItem";

import {set, open} from './components/calendar-services'
import OrderSearch from './components/order-search'
import {inject} from "mobx-react";
import {forEach, isEmpty} from "lodash";

const window = Dimensions.get('window')
const screenHeight = window.height
const screenWidth = window.width
/*
 *  订单查询
 */
@inject(stores => ({
		userStore: stores.userStore,
		dictStore: stores.dictStore,
	})
)
export default class OrderInquire extends Component {
	static navigationOptions = ({navigation}) => {
		return {
			headerRightContainerStyle: {
				paddingRight: 50,
			},
			headerRight: (
				<Icon
					onPress={() => open()}
					name='filter'
					size={20}
					color='#F5FBFF'
					light
				/>
			)
		};
	};

	constructor(props) {
		super(props)
		this.userStore = this.props.userStore
		this.dictStore = this.props.dictStore
		console.log('this.userStore',this.userStore)
		this.searchData = {}
		this.state = {
			date: '',
			filterText: '',
			dataList: [],
			pageNum: 1,
			list: [],
			total: 0
		}
	}

	componentDidMount() {
		// 获取数据
		this.refresh(1)
	}

	refresh(num) {
		// 如果明确传入参数，则是刷新或者首次加载
		let pageNum = num ? 1 : this.state.pageNum + 1

		// 请求数据
		const params = {}
		const {filterText} = this.state
		if (filterText) {
			params['nameOrTelephone'] = filterText
		}
		if (!isEmpty(this.searchData)) {
			const {vehicleCode, createTime, buyType, seller, orderStatus} = this.searchData
			if (vehicleCode.length) {
				params.vehicleCode = vehicleCode[2].value
			}
			if (createTime) {
				params.createTime = createTime
			}
			if (buyType) {
				params.buyType = buyType.dictKey
			}
			if (orderStatus) {
				params.orderStatus = orderStatus.dictKey
			}
			if (seller) {
				params.salesConsultantNo = seller.accountNo
			}
		}
		// 清空上拉方法禁止拉动
		return axios.get('/admin/satOrderCustomer/page', {params: {pageNum, pageSize: 10, ...params}})
			.then(({data}) => {
				// 判断如果是刷新则清空数据
				this.setState(
					(prevState) => {
						let oldList = pageNum === 1 ? [] : prevState.list
						return {
							pageNum,
							list: [...oldList, ...data.list],
							total: data.total
						}
					})
			})
	}

	// 跳转详情页面
	jumpPage(item) {
		navigation.navigate('OrderInquireDetails', {'orderNo': item.orderNo})
	}

	// 点击搜索的事件
	searchListAction(text) {
		// 保存搜索条件
		this.setState({filterText: text})
		this.refresh(1)
	}

	// 加载数据
	render() {
		return (
			<View style={{flex: 1, backgroundColor: colors.background}}>
				<SearchBarView
					placeholder='客户姓名/电话/单号/车型'
					searchListCallBack={(text) => this.searchListAction(text)}
				/>
				<Longlist
					ref={c => this._longlist = c}
					data={this.state.list}
					total={this.state.total}
					renderItem={
						({item}) => <OrderItem item={item} jumpPageCallBack={item => this.jumpPage(item)}/>
					}
					onEndReachedThreshold={0.05}
					onEndReached={() => this.refresh()}
					onRefresh={() => this.refresh(1)}
					// 必须 否则容易出问题
					getItemLayout={(data, index) => {
						return {length: 125, offset: 125 * index, index}
					}}
				/>

				{/*侧滑*/}
				<SlideModal
					ref={c => set(c)}
					screenHeight={screenHeight}
					offsetX={screenWidth}
					offsetY={0}
					direction='left'
					align='left'
					styles={{
						content: {
							width: '80%',
							backgroundColor: 'white',
							height: '100%',
							paddingTop: 80
						},
						flex: 1
					}}
					cancelable={true}>
					<View>
						<OrderSearch
							onRefresh={searchData => {
								this.searchData = searchData
								this.refresh(1)
							}}
							searchData={this.searchData}
							userStore={this.userStore} dictStore={this.dictStore}/>
					</View>

				</SlideModal>
			</View>
		);
	}
}
const styles = StyleSheet.create({
	calendarBox: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%'
	},
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
