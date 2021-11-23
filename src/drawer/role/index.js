import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {inject, observer} from 'mobx-react';
import {Item, List, ItemText, CurrentItem} from './style'
import {filter} from 'lodash'

const roles = {
	'rolePartnerManager': true,
	'rolePartnerSaleManager': true,
	'rolePartnerSale': true,
	'rolePartnerTestDrive': true,
	'rolePartnerHandleVehicle': true
}

@inject(['userStore']) // 注入对应的store
@observer // 监听当前组件
export default class SwitchRole extends Component {
	static navigationOptions = ({navigation}) => {
		return {
			title: navigation.getParam('title', '切换角色'),
		}
	}

	constructor(props) {
		super(props)
		this.store = this.props.userStore; //通过props来导入访问已注入的store
	}

	getImage(name) {
		switch (name) {
			case 'rolePartnerManager':
			case 'rolePartnerSaleManager':
				return require('../../assets/images/rolePartnerSaleManager.png')
			case 'rolePartnerSale':
				return require('../../assets/images/rolePartnerSale.png')
			case 'rolePartnerTestDrive':
				return require('../../assets/images/rolePartnerTestDrive.png')
			case 'rolePartnerHandleVehicle':
				return require('../../assets/images/rolePartnerHandleVehicle.png')
			default:
				return require('../../assets/images/rolePartnerSale.png')
		}
	}

	// 选择角色
	select(role) {
		// 设置当前选中角色
		this.store.setRole(role);
		// 返回首页
		setTimeout(() => {
			this.props.navigation.goBack();
		}, 300);
	}

	render() {
		const {roleList} = this.store.user.subMap
		const roleMap = filter(roleList, role => roles[role.roleCode])
		return (
			<View style={styles.contentSyle}>
				{roleMap.map(role => {
					if (role.roleName === '' || !role.roleName) {

					} else {
						return (
							<TouchableOpacity activeOpacity={0.8} style={styles.touchableContainer}
											  onPress={() => this.select(role)} key={role.roleCode}>
								<Image source={this.getImage(role.roleCode)}
									   style={{height: 70, width: 70}}/>
								<ItemText>{role.roleName}</ItemText>
								{this.store.role.roleCode === role.roleCode ? <CurrentItem>当前选择</CurrentItem> : null}
							</TouchableOpacity>
						)
					}
				})}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	contentSyle: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
		paddingTop: '10%',
		paddingBottom: '10%',
		paddingLeft: '2%',
		paddingRight: '2%',
	},
	touchableContainer: {
		width: '50%',
		height: 120,
		alignItems: 'center'
	}
})
