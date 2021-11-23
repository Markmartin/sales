import React, {Component} from 'react'
import {View, ScrollView, Text, Alert, TouchableOpacity} from 'react-native'
import {map} from 'lodash'
import {colors, size} from '../../../../style/variables'
import Icon from 'react-native-vector-icons/dist/Feather'
import {Badge, Tab} from 'beeshell'

import {ListWrapper, ListItem, ListInfo, ListAction, UserInfo, OrderInfo, DropDownWrapper, DropDownContent} from '../style'
import {userLevelHash} from '../../../data-config'
import Sex from "../../../../common/components/sex";
import {withNavigationFocus} from 'react-navigation';

import {inject} from 'mobx-react'
import PhoneCall from "../../../../common/components/phone-call";
import variables from '../../../../style/beeshell'

@inject(['userStore']) // 注入对应的store
class TodayFollowUp extends Component {
	constructor(props) {
		super(props)
		this.date = []
		for (let i = 0; i < 5; i++) {
			this.date.push(moment().add(i, 'days'))
		}
		this.state = {
			selectedIndex: 0,
			date: map(this.date, (item, index) => {
				return {
					label: item.format("M月DD日"),
					value: index
				}
			}),
			followList: [],
			followCountList: [],
			currentDate: 0
		}
		// 标记状态
		this.reload = false
		this.store = this.props.userStore
	}

	// 获取焦点时刻
	getSnapshotBeforeUpdate(prevProps, prevState) {
		if (this.props.isFocused) {
			// 如果reload了不再请求
			if (this.reload) return null
			// 获取当日跟进
			const planFollowTimeStr = this.date[this.state.selectedIndex].format('YYYY-MM-DD')
			axios.get('/admin/satCustomerFollow/waitFollow', {params: {planFollowTimeStr}})
				.then(({data}) => {
					this.setState({
						followList: data
					})
				})

			// 获取五天内待跟进
			axios.get('/admin/satCustomerFollow/getWaitFollowCount')
				.then(({data}) => {
					this.setState({
						followCountList: data
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

	updateIndex(index) {
		this.setState({currentDate: index})
		const planFollowTimeStr = this.date[index].format('YYYY-MM-DD')
		axios.get('/admin/satCustomerFollow/waitFollow', {params: {planFollowTimeStr}})
			.then(({data}) => {
				this.setState({
					followList: data
				})
			})
	}

	goto(item) {
		if (!item.customerNo) {
			Alert.alert('提示', '数据有问题，customerNo不可用')
			return
		}
		if (!item.level) {
			Alert.alert('提示', '客户级别为空，请先去完善客户资料')
			this.props.navigation.navigate('Customers', {customerNo: item.customerNo})
			return
		}
		this.props.navigation.navigate('FollowUp', {customerNo: item.customerNo})
	}

	render() {
		const {followCountList} = this.state
		return (
			<View style={{flex: 1, backgroundColor: colors.grey5}}>
				<ScrollView>
					<DropDownWrapper style={{borderBottomWidth: 1, borderBottomColor: colors.grey5}}>
						<DropDownContent style={{width: 80, borderBottomWidth: 0, borderRightWidth: 0}}>
							<TouchableOpacity
								onPress={() => this.props.navigation.navigate('TimeoutCustomers')}>
								<Text style={{textAlign: 'center'}}>逾期</Text>
								<Badge style={{position: 'absolute', top: -10, right: 5, backgroundColor: '#f44'}}
									   label={this.store.lateFollowCount}/>
							</TouchableOpacity>
						</DropDownContent>
						<Tab
							style={{flex: 1}}
							activeColor='#00CFB4'
							value={this.state.currentDate}
							scrollable={true}
							data={this.state.date}
							renderItem={(item, index, selected) => {
								return (
									<View style={{
										paddingVertical: variables.mtdVSpacingXL,
										paddingHorizontal: variables.mtdHSpacingXL
									}}>
										<View
											style={{
												borderRadius: 2,
												borderBottomWidth: selected ? 1 : 0,
												borderBottomColor: variables.mtdBrandPrimary,
												justifyContent: 'center',
												height:27,
												paddingBottom:10
											}}>
											<Text
												style={{
													fontSize: 14,
													color: selected ? variables.mtdBrandPrimary : variables.mtdGrayDark,
												}}>
												{item.label}
											</Text>
											{followCountList[index] && followCountList[index].followCount > 0 ?
												<Badge style={{
													position: 'absolute',
													top: -12,
													right: -10,
													backgroundColor: '#f44'
												}} label={followCountList[index].followCount}/> : null}
										</View>
									</View>
								)
							}}
							onChange={(item, index) => this.updateIndex(index)}
						/>

					</DropDownWrapper>

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
												<View style={{width: 40}}>
													<Text
														style={{color: colors.grey3}}>{userLevelHash[item.level]}</Text>
												</View>
												<View style={{flex: 1}}>
													<Text style={{color: colors.grey3}}>{item.catalogName}</Text>
												</View>
												<View style={{width: 130}}>
													<Text style={{color: colors.grey3}}>
														{moment(item.planFollowTime).format('YYYY-MM-DD HH:mm')}
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

export default withNavigationFocus(TodayFollowUp)
