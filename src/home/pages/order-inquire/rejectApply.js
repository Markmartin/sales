import React, {Component} from 'react'
import {TouchableOpacity, StyleSheet, Text, View, Dimensions, Keyboard} from 'react-native';
import {RowLineView} from "./style";
import {ColumnLineView} from "../homeSearchList/style";
import {Tip} from "beeshell";
import Textarea from 'react-native-textarea';

const {width, height} = Dimensions.get('window');
const screenMargin = 52;
const applyWidth = width- 2* screenMargin;
const btnWidth = (applyWidth-0.5) * 0.5;


export default class RejectCancelOrderApplyView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rejectReason: ''
        }
        // 绑定
        this.btnClickAction = this.btnClickAction.bind(this);
    }

    // 按钮点击事件
    btnClickAction(isSure) {
        // 结束编辑
        Keyboard.dismiss();
        if (isSure) {
            if (this.state.rejectReason.length == 0) {
                Tip.show('请先填写驳回原因',1000,'center');
                return;
            }
            this.props.btnClickEvent(true, this.state.rejectReason);
        }else {
            this.props.btnClickEvent(false, null);
        }
    }

    render() {
        return (
            <View style={styles.baseContentStyle}>
                <View style={styles.contentStyle}>
                    <Text style={styles.titleStyle}>驳回申请</Text>
                    <Textarea
                        style={styles.inputStyle}
                        placeholder='请输入驳回申请原因...'
                        placeholderTextColor='#c7c7c7'
                        underlineColorAndroid='transparent'
                        // 自动获取焦点
                        autoFocus={true}
                        onChangeText={text => this.setState({rejectReason:text})}
                    />
                    <RowLineView/>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <CancelButton cancelActionCallBack={() => this.btnClickAction(false)}/>
                        <ColumnLineView />
                        <SureButton sureActionCallBack={() => this.btnClickAction(true)}/>
                    </View>
                </View>
            </View>
        );
    }
}


class CancelButton extends Component {
    render() {
        return (
            <TouchableOpacity onPress={this.props.cancelActionCallBack}>
                <View style={styles.btnContentStyle}>
                    <Text style={styles.cancelTextStyle}>取消</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

class SureButton extends Component {
    render() {
        return (
            <TouchableOpacity onPress={this.props.sureActionCallBack}>
                <View style={styles.btnContentStyle}>
                    <Text style={styles.cancelTextStyle}>确定</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    baseContentStyle:{
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    contentStyle:{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        width: applyWidth,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleStyle:{
        fontFamily: 'PingFangSC-Medium',
        fontSize: 17,
        color: '#030303',
        marginTop: 20,
        height: 20
    },
    inputStyle:{
        flex: 1,
        margin: 16,
        borderRadius: 2,
        borderColor: '#E6E6E6',
        borderWidth: 0.5,
        padding: 10,
        height: 128
    },
    btnContentStyle:{
        justifyContent: 'center',
        alignItems: 'center',
        width: btnWidth,
        height: 44
    },
    cancelTextStyle:{
        fontFamily: 'PingFangSC-Regular',
        fontSize: 16,
        color: '#37C1B4'
    },
    sureTextStyle:{
        fontFamily: 'PingFangSC-Medium',
        fontSize: 16,
        color: '#37C1B4'
    }
})