/**
 * @description 用来做单选时的样式,内部单选项仍然使用美团的Radio.Item
 */

import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/dist/Feather';
import {Radio} from 'beeshell';
import variables from "../../../../style/beeshell";

export default class CRadio extends Component {
	render() {
		return (
			<Radio
				style={{ flexDirection: 'row', justifyContent:'flex-end'}}
				uncheckedIcon={<Icon name='circle' size={14}  />}
				{...this.props} >
			</Radio>
		);
	}
}
