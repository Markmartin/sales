import React, {Component} from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import {cancel} from "./share-service";
import Icon from "react-native-vector-icons/Feather";
import navigation from "../../../common/services/navigation";

export default class ShareCancelButton extends Component {
	constructor(props) {
		super(props)
		this.state = {
			showShareIcon: false
		}
	}

	// 外部调用
	change(showShareIcon) {
		this.setState({showShareIcon})
	}

	showShare(){
		cancel()
		this.setState({showShareIcon:false})
	}

	render() {
		const {showShareIcon} = this.state
		return (
			<View>
				{showShareIcon ?
					<TouchableOpacity
						onPress={() =>this.showShare()}>
						<Text style={{textAlign: 'center',color:'#ffffff',paddingHorizontal:15,fontSize:16}}>
							取消</Text>
					</TouchableOpacity>:
					<Icon
						onPress={() =>navigation.navigate('Home')}
						name='arrow-left'
						size={28}
						color='#F5FBFF' light/>
				}
			</View>
		)
	}
}
