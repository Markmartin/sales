import React, {Component} from 'react'
import Icon from 'react-native-vector-icons/dist/Feather';
import navigation from "../../services/navigation";
import {View} from 'react-native'
import {Badge} from 'beeshell'

/**
 * 此组件用来显示右上角的角标
 * 提供对外方法用来显示状态
 */

export default class HomeBell extends Component {
	constructor(props) {
		super(props)
		this.state = {
			notice: false
		}
	}

	setNotice(notice) {
		this.setState({notice})
	}

	render() {
		const {notice} = this.state
		return (
			<View>
				<Icon
					onPress={() => {
						this.setNotice(false)
						navigation.navigate('HomeSystemMsgList')
					}}
					name='bell'
					size={24}
					color='#F5FBFF' light/>
				{notice ? <Badge style={{position: 'absolute', top: -1, right: '21%'}}/> : null}
			</View>
		)
	}
}
