import React, {Component} from 'react'
import Icon from "react-native-vector-icons/Ionicons";
import navigation from "../../services/navigation";
import {View} from 'react-native'
import {inject, observer} from 'mobx-react'
/**
 * 此组件用来显示底部栏 客户页面 右上角的添加角标
 * 当用户角色为销售顾问和销售经理 可以使用添加按钮
 */
@inject(['userStore']) // 注入对应的store
@observer // 监听当前组件
export default class AddCustomerButton extends Component {
	constructor(props) {
		super(props)
		this.store = this.props.userStore
	}


	render() {
		const {role} = this.store
		if (!role) return null
		const {roleCode} = role
		const show = (roleCode==='rolePartnerSale')
		return (
			<View>
				{show ? <Icon
					onPress={() => {
						navigation.navigate('AddDriver')
					}}
					name='ios-add'
					size={28}
					color='#F5FBFF' light/> : null}
			</View>
		)
	}
}