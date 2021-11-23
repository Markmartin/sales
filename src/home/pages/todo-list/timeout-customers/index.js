import React, {Component} from 'react'
import {View, ScrollView, Text, TouchableOpacity, Alert, Dimensions} from 'react-native'
import {colors, size} from '../../../../style/variables'
import Icon from 'react-native-vector-icons/dist/Feather'

import {ListWrapper, ListItem, ListInfo, ListAction, UserInfo, OrderInfo, DropDownWrapper, DropDownContent} from '../style'
import SortTab from '../../../../common/components/sort-tab'
import Sex from '../../../../common/components/sex'
import PhoneCall from "../../../../common/components/phone-call";
import {userLevelHash} from '../../../data-config'

import {orderBy, filter} from 'lodash'
import {withNavigationFocus} from "react-navigation";
import {Dropdown} from "beeshell";

const window = Dimensions.get('window')
// 选项数据
const dropDownData = [
	{
		label: '全部客户',
		value: '全部客户'
	},
	{
		label: '意向客户',
		value: '意向客户'
	},
	{
		label: '老客户',
		value: '老客户'
	}
]

class TimeoutCustomers extends Component {
	constructor(props) {
		super(props)
		this.fields = ['customerLevel', 'lateFollowDays']
		this.state = {
			followList: [],
			tabs: ['客户级别', '逾期时间'],
			old: true,
			customerStatus: dropDownData[0].label
		}
		// 标记状态
		this.reload = false
		// 拷贝数据
		this.originalData = null
	}

	changeOld = (customerStatus) => {
		switch (customerStatus) {
			case '全部客户':
				this.setState({followList: [...this.originalData]})
				break;
			case '意向客户':
				this.setState({
					followList: filter(this.originalData, item => item.custStatus == 0)
				})
				break;
			case '老客户':
				this.setState({
					followList: filter(this.originalData, item => item.custStatus == 3)
				})
				break;
		}
	}

	// 获取焦点时刻
	getSnapshotBeforeUpdate(prevProps, prevState) {
		if (this.props.isFocused) {
			// 如果reload了不再请求
			if (this.reload) return null
			// 获取当日跟进
			axios.get('/admin/satCustomerFollow/lateFollow')
				.then(({data}) => {
					this.originalData = data
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
		this.props.navigation.navigate('FollowUp', {customerNo: item.customerNo})
	}

	render() {
		return (
			<View style={{flex: 1, backgroundColor: colors.grey5}}>
				<ScrollView>
					<DropDownWrapper>
						<DropDownContent>
							<TouchableOpacity
								ref={element => this.btnEl2 = element}
								onPress={() => {
									this.btnEl2.measure((fx, fy, width, height, px, py) => {
										this.setState({
											offsetX: px,
											offsetY: py + height
										})
										this.slideModal.open()
									})
								}}>
								<Text style={{textAlign: 'center'}}>{this.state.customerStatus}</Text>
							</TouchableOpacity>
						</DropDownContent>
						<SortTab styles={{flex: 1}}
								 tabs={this.state.tabs}
								 callBack={item => this.sort(item)}/>
					</DropDownWrapper>

					<ListWrapper>
						{this.state.followList.map((item, i) => {
							return (
								<TouchableOpacity key={i} onPress={() => this.goto(item)}>
									<ListItem>
										<ListInfo>
											<UserInfo>
												<View>
													<Text style={{fontSize: size.fontsizeMd}}>{item.name}
													</Text>
												</View>
												<Sex data={item.sex}/>
												<PhoneCall style={{fontSize: size.fontsizeMd}} phone={item.phone}/>
											</UserInfo>
											<OrderInfo>
												<View style={{width: 40}}>
													<Text
														style={{color: colors.grey3}}>{userLevelHash[item.customerLevel]}</Text>
												</View>
												<View style={{flex: 1}}>
													<Text style={{color: colors.grey3}}>{item.catalogName}</Text>
												</View>
												<View style={{width: 100}}>
													<Text style={{color: colors.grey3}}>逾期{item.lateFollowDays}天</Text>
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
				<Dropdown
					ref={c => this.slideModal = c}
					offsetX={0}
					style={{width: window.width, height: 180}}
					offsetY={this.state.offsetY}
					cancelable={true}
					value={this.state.customerStatus}
					data={dropDownData}
					onChange={customerStatus => {
						this.setState({customerStatus})
						this.changeOld(customerStatus)
					}}
				/>
			</View>

		);
	}
}

export default withNavigationFocus(TimeoutCustomers)
