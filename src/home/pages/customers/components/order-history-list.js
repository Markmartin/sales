import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {FollowUpList, FollowUpItem, FollowUpListText, CardTitle, Card} from "../style";
import {filter, replace} from 'lodash'
// 预置数据
import {orderStatus} from '../../../data-config'
import {inject} from 'mobx-react'
@inject(['dictStore']) // 注入对应的store
export default class OrderHistoryList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			historyList: [],
			currentOrder: []
		}
		this.dictStore = this.props.dictStore
	}

	// 生命周期挂载阶段
	componentDidMount() {
		this.refresh()
	}

	// 刷新数据
	refresh() {
		const {customerNo} = this.props
		if (!customerNo) return
		axios.get('/admin/satOrderCustomer/listAllByCustomerNo', {params: {customerNo}})
			.then(({data}) => {
				// 根据订单状态区分进行中订单和历史订单
				// 订单状态1–>待付款2–>小订付款完成3–>大订已付款，4–>订单已评价5–>已超时6–>小订已取消7–>小订申请退款8–>小订退款成功 9–>小订退款失败 10–>同意取消 11–>驳回取消
				if (!data.length) return
				this.setState({
					historyList: filter(data, item => item.orderStatus >= 4),
					currentOrder: filter(data, item => item.orderStatus < 4)
				})
			})
	}

	// 处理括号问题
	removeBrackets(str){
		if(!str) return ''
		let content = replace(str,'["','')
		content = replace(content,'"]','')
		return content
	}

	// 渲染订单信息
	renderOrder(orders) {
		const {hashData} = this.dictStore
		const {retailOrderStatus} = hashData
		return (
			<View style={{paddingHorizontal: 13}}>
				{
					orders.map((item, i) => {
						return (
							<FollowUpList key={i}>
								<FollowUpItem>
									<View style={{width: 90}}>
										<FollowUpListText>订单编号：</FollowUpListText>
									</View>
									<View>
										<FollowUpListText>{item.orderCustomerNo}</FollowUpListText>
									</View>
								</FollowUpItem>
								<FollowUpItem>
									<View style={{width: 90}}>
										<FollowUpListText>订单状态：</FollowUpListText>
									</View>
									<View>
										<FollowUpListText>{item.orderStatus?retailOrderStatus[item.orderStatus].dictValue:''}</FollowUpListText>
									</View>
								</FollowUpItem>
								<FollowUpItem>
									<View style={{width: 90}}>
										<FollowUpListText>小订金额：</FollowUpListText>
									</View>
									<View>
										<FollowUpListText>{item.smallAmount + ' 元'}</FollowUpListText>
									</View>
								</FollowUpItem>
								<FollowUpItem>
									<View style={{width: 90}}>
										<FollowUpListText>大订金额：</FollowUpListText>
									</View>
									<View>
										<FollowUpListText>{item.bigAmount + ' 元'}</FollowUpListText>
									</View>
								</FollowUpItem>
								<FollowUpItem>
									<View style={{width: 90}}>
										<FollowUpListText>发票编号：</FollowUpListText>
									</View>
									<View>
										<FollowUpListText>{item.invoiceCode}</FollowUpListText>
									</View>
								</FollowUpItem>
								<FollowUpItem>
									<View style={{width: 90}}>
										<FollowUpListText>开票金额：</FollowUpListText>
									</View>
									<View>
										<FollowUpListText>{item.invoiceMoney + ' 元'}</FollowUpListText>
									</View>
								</FollowUpItem>
								<FollowUpItem>
									<View style={{width: 90}}>
										<FollowUpListText>购车金额：</FollowUpListText>
									</View>
									<View>
										<FollowUpListText>{item.buyAmount + ' 元'}</FollowUpListText>
									</View>
								</FollowUpItem>
								<FollowUpItem>
									<View style={{width: 90}}>
										<FollowUpListText>车系车型：</FollowUpListText>
									</View>
									<View>
										<FollowUpListText>{item.orderCustomerDetailVO ? item.orderCustomerDetailVO.vehicleName : ''}</FollowUpListText>
									</View>
								</FollowUpItem>
								<FollowUpItem>
									<View style={{width: 90}}>
										<FollowUpListText>VIN码：</FollowUpListText>
									</View>
									<View>
										<FollowUpListText>{item.vin}</FollowUpListText>
									</View>
								</FollowUpItem>
								<FollowUpItem>
									<View style={{width: 90}}>
										<FollowUpListText>外观颜色：</FollowUpListText>
									</View>
									<View>
										<FollowUpListText>{item.orderCustomerDetailVO ? item.orderCustomerDetailVO.colorNameOut : ''}</FollowUpListText>
									</View>
								</FollowUpItem>
								<FollowUpItem>
									<View style={{width: 90}}>
										<FollowUpListText>内饰颜色：</FollowUpListText>
									</View>
									<View>
										<FollowUpListText>{item.orderCustomerDetailVO ? item.orderCustomerDetailVO.colorNameIn : ''}</FollowUpListText>
									</View>
								</FollowUpItem>
								<FollowUpItem>
									<View style={{width: 90}}>
										<FollowUpListText>选装包：</FollowUpListText>
									</View>
									<View>
										<FollowUpListText>{item.orderCustomerDetailVO ? this.removeBrackets(item.orderCustomerDetailVO.customPackName) : ''}</FollowUpListText>
									</View>
								</FollowUpItem>
							</FollowUpList>
						)
					})}
			</View>
		)
	}

	// 当前进行中的订单
	renderCurrentOrder() {
		const {currentOrder} = this.state
		if (currentOrder.length) {
			return this.renderOrder(currentOrder)
		} else {
			return null
		}
	}

	// 更多资料渲染
	renderMore() {
		const {historyList} = this.state
		if (this.state.showMore && historyList.length) {
			return this.renderOrder(historyList)
		} else {
			return null
		}
	}

	render() {
		return (
			<View>
				<Card style={{marginTop: 10}}>
					<CardTitle>
						<Text>
							进行中的订单
						</Text>
					</CardTitle>
					{this.renderCurrentOrder()}
				</Card>
				<Card style={{marginTop: 10}}>
					<TouchableOpacity onPress={() => this.setState({showMore: !this.state.showMore})}>
						<CardTitle>
							<Text>
								历史订单信息
							</Text>
						</CardTitle>
					</TouchableOpacity>
					{this.renderMore()}
				</Card>
			</View>
		)
	}
}
