import React, {Component} from 'react'
import {View, ScrollView, Text, Alert, TouchableOpacity} from 'react-native'
import {colors, size} from '../../../../style/variables'
import Icon from 'react-native-vector-icons/dist/Feather'

import {ListWrapper, ListItem, ListInfo, ListAction, UserInfo, OrderInfo, DropDownWrapper, DropDownContent} from '../style'
import SortTab from '../../../../common/components/sort-tab'
import Sex from '../../../../common/components/sex'
import {orderBy} from "lodash";
import {withNavigationFocus} from "react-navigation";
import {inject} from 'mobx-react'
import {Badge} from "beeshell";
import PhoneCall from "../../../../common/components/phone-call";

@inject(['userStore']) // 注入对应的store
class OldCustomers extends Component {
	constructor(props) {
		super(props)
		this.fields = ['handleVehicleTime']
		this.state = {
			followList: [],
			tabs: ['交车时间']
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
			this.props.navigation.setParams({lateFollowCount: this.store.lateFollowCount})
			// 获取当日跟进
			axios.get('/admin/satCustomerFollow/goodCustomerFollow')
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
		this.props.navigation.navigate('FollowUp', {customerNo: item.customerNo})
	}

	render() {
		return (
			<View style={{flex: 1, backgroundColor: colors.grey5}}>
				<ScrollView>
					<DropDownWrapper>
						<DropDownContent style={{flex: 1}}>
							<TouchableOpacity
								onPress={() => this.props.navigation.navigate('TimeoutCustomers')}>
								<Text style={{textAlign: 'center'}}>逾期</Text>
								<Badge style={{position: 'absolute', top: -10, right:'33%', backgroundColor: '#f44'}}
									   label={this.store.lateFollowCount}/>
							</TouchableOpacity>
						</DropDownContent>
						<SortTab tabs={['交车时间']}
								 styles={{flex: 1}}
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
													<Text style={{fontSize: size.fontsizeMd}}>{item.name}</Text>
												</View>
												<Sex data={item.sex}/>
												<PhoneCall style={{fontSize: size.fontsizeMd}} phone={item.phone}/>
											</UserInfo>
											<OrderInfo>
												<View style={{flex: 1}}>
													<Text style={{color: colors.grey3}}>{item.catalogName}</Text>
												</View>
												<View style={{width: 130}}>
													<Text style={{color: colors.grey3}}>
														{moment(item.lastFollowTime).format('YYYY-MM-DD HH:mm')}
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

export default withNavigationFocus(OldCustomers)
