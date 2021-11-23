import React, {Component} from 'react'
import {View, ScrollView, Text, Alert, TouchableOpacity} from 'react-native'
import {colors, size} from '../../../../style/variables'
import Icon from 'react-native-vector-icons/dist/Feather'

import {ListWrapper, ListItem, ListInfo, ListAction, UserInfo, OrderInfo} from '../style'
import SortTab from '../../../../common/components/sort-tab'
import {newLevelHash} from '../../../data-config'
import Sex from "../../../../common/components/sex";
import {orderBy} from "lodash";
import PhoneCall from "../../../../common/components/phone-call";
import {withNavigationFocus} from "react-navigation";

class TodayCustomers extends Component {
	constructor() {
		super()
		this.fields = ['level', 'createTime']
		this.state = {
			followList: [],
			tabs: ['级别', '建档时间']
		}
	}

	// 生命周期挂载阶段
	componentDidMount() {
	}

	// 获取焦点时刻
	getSnapshotBeforeUpdate(prevProps, prevState) {
		if (this.props.isFocused) {
			// 如果reload了不再请求
			if (this.reload) return null
			// 当日新增客户
			axios.get('/admin/customer/todayCustomerList')
				.then(({data}) => {
					this.setState({
						followList: [...data]
					})
				})
			// 标记reload
			this.reload = true
		} else {
			this.reload = false
		}
		return null
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
	}

	// 排序函数
	sort(item) {
		// 使用lodash sortBy 函数进行排序 设置setState
		const {selectedIndex, state} = item
		const chevron = state === 'chevron-up' ? 'asc' : 'desc'
		const field = this.fields[selectedIndex]
		const data = orderBy(this.state.followList, [field], [chevron])
		this.setState({
			followList: data
		})
	}

	goto(item) {
		if (!item.customerNo) {
			Alert.alert('提示', '数据有问题，customerNo不可用')
			return
		}
		this.props.navigation.navigate('Customers', {customerNo: item.customerNo})
	}

	render() {
		return (
			<View style={{flex: 1, backgroundColor: colors.grey5}}>
				<SortTab tabs={['级别', '建档时间']}
						 callBack={item => this.sort(item)}/>
				<ScrollView>
					<ListWrapper>
						{this.state.followList.map((item, i) => {
							return (
								<TouchableOpacity key={i} onPress={() => this.goto(item)}>
									<ListItem>
										<ListInfo>
											<UserInfo>
												<View>
													<Text style={{fontSize: size.fontsizeMd}}>{item.name}</Text>
												</View>
												<Sex data={item.sex}/>
												<PhoneCall style={{fontSize: size.fontsizeMd}} phone={item.phone}/>
											</UserInfo>
											<OrderInfo>
												<View style={{width: 45}}>
													<Text
														style={{color: colors.grey3}}>{newLevelHash[item.level]}</Text>
												</View>
												<View style={{flex: 1}}>
													<Text style={{color: colors.grey3}}>{item.productName}</Text>
												</View>
												<View style={{width: 130}}>
													<Text style={{color: colors.grey3}}>
														{moment(item.createTime).format('YYYY-MM-DD HH:mm')}
													</Text>
												</View>
											</OrderInfo>
										</ListInfo>
										<ListAction>
											<Icon size={24} name="chevron-right" color={colors.grey3}/>
										</ListAction>
									</ListItem>
								</TouchableOpacity>
							)
						})}

					</ListWrapper>
				</ScrollView>
			</View>

		);
	}
}
export default withNavigationFocus(TodayCustomers)
