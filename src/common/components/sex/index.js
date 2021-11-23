/**
 * @description 表示男女的标志
 * @param {data} sex的值
 */

import React, {Component} from 'react';
import {View} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';


export default class Sex extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let name = this.props.data == 1 ? 'gender-male' : 'gender-female'
        let color = this.props.data == 1 ? '#4296F4' : '#DF5095'
        return (
            <View >
                <MaterialIcon name={name}
                  style={{
                      marginLeft: 12,
                      marginRight: 12
                  }}
                  size={16}
                  color={color}/>
            </View>
        )
    }
}
