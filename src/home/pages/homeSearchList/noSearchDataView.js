import React, {Component} from 'react'
import {TouchableOpacity, StyleSheet, View, Text, Dimensions, Image} from 'react-native'


const searchNoResultImg = require('../../../assets/images/searchNoResult.png')
const Screen = Dimensions.get('window')

export default class NoSearchDataView extends Component {
    render() {
        return(
            <View style={styles.contentStyle}>
                <Image source={searchNoResultImg} style={{width: Screen.width, height: 8.0/15*Screen.width}}/>
                <Text style={styles.textStyle}>{this.props.alertMsg.length == 0 ? '暂无数据' : this.props.alertMsg}</Text>
                {
                    this.props.isShowCustomerPort ?
                        <TouchableOpacity style={{marginTop:24}} onPress={this.props.addNewCustomerCallBack} >
                            <View style={styles.btnStyle}>
                                <Text style={{color: '#37C1B4', fontSize: 16, fontFamily: 'PingFangSC-Regular'}}>新增客户</Text>
                            </View>
                        </TouchableOpacity>
                        :
                        null
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    contentStyle:{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#ECF0F3',
        height: Screen.height
    },
    textStyle:{
        color: '#99999A',
        fontSize: 16
    },
    btnStyle:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderColor: '#37C1B4',
        borderWidth: 1,
        borderRadius: 2,
        height: 44,
        width: 150
    }
})