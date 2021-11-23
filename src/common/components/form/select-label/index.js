/**
 * @description 用来实现Form Item没值的时候右侧显示选择标识，有值则显示选择的值
 * @param {data} 需要显示的值
 * @param {onPress} 点击时的事件，接受函数
 */

import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/dist/Feather';
import {Text, TouchableOpacity} from "react-native";
import {isNil} from 'lodash'

import variables from "../../../../style/beeshell";

export default class SelectLabel extends Component {
    handlePress() {
        if (this.props.editable === false) return
        this.props.onPress()
    }

    render() {
        const validData = !isNil(this.props.data) && this.props.data !== ''
        const textColor = validData ? variables.mtdGrayBase : variables.mtdGray
        return (
            <TouchableOpacity
                style={{
                    paddingVertical: variables.mtdVSpacingM, flexDirection: 'row',
                    justifyContent: 'flex-end', alignItems: 'center'
                }}
                onPress={() => this.handlePress()}>
                <Text style={{color: textColor, marginRight: 5}}>
                    {validData ? this.props.data : ' 请点击选择'}</Text>
                {
                    validData ? null : <Icon name='chevron-right' size={16}/>
                }
            </TouchableOpacity>
        );
    }
}
