import React, {Component} from 'react'
import {TouchableOpacity, Keyboard, StyleSheet, View, Text, Dimensions, TextInput} from 'react-native'
import SearchIcon from "react-native-vector-icons/Feather";
import navigation from "../../../common/services/navigation";
import {colors, size} from "../../../style/variables"
import {RowLineView} from "./style";

// 获取当前屏幕宽度
const screen = Dimensions.get('window')

class SearchBarBtn extends Component {
    render() {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('HomeSearchList')}>
                <View style={[styles.contentStyle, {width: screen.width-120}]}>
                    <SearchIcon style={{paddingLeft:10, paddingRight:5}} name='search' size={16} color='#C2C8D2' />
                    <Text style={styles.textStyle}>手机号/客户姓名</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

export default class SearchBar extends Component {
    render() {
        return (
            <View style={[styles.contentStyle, {width: screen.width-120}]}>
                <SearchIcon style={{paddingLeft:10, paddingRight:5}} name='search' size={16} color='#C2C8D2' />
                <TextInput
                    // 弹性布局,android上有自带padding，需要收到设置才能跟ios效果一致
                    style={[{flex:1, padding: 0}, styles.textStyle]}
                    // 自动获取焦点
                    autoFocus={true}
                    // 去掉默认下划线
                    underlineColorAndroid='transparent'
                    // 回车键盘的时间
                    returnKeyType='search'
                    // 光标的颜色
                    selectionColor='#ff4f39'
                    placeholder={this.props.placeholder?this.props.placeholder:''}
                    placeholderTextColor='#CACBCC'
                    clearButtonMode='while-editing'
                    onChangeText={text => this.props.textEndChangeAction(text)}
                />
            </View>
        );
    }
}

class SearchBarView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textInput: ''
        }
    }
    // textInput结束编辑的事件
    textOnChangeAction(text) {
        this.setState({
            textInput: text
        })
    }

    searchAction() {
        // 收起键盘
        Keyboard.dismiss();
        // 调用查询接口
        this.props.searchListCallBack(this.state.textInput);
    }

    render() {
        return (
            <View>
                <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', backgroundColor: '#FFFFFF', height: 56}}>
                    <View style={[styles.contentStyle, {flex: 1, marginLeft: 16}]}>
                        <SearchIcon style={{paddingLeft:10, paddingRight:5}} name='search' size={16} color='#C2C8D2' />
                        <TextInput
                            // 弹性布局,android上有自带padding，需要收到设置才能跟ios效果一致
                            style={[{flex:1, padding: 0}, styles.textStyle]}
                            // 去掉默认下划线
                            underlineColorAndroid='transparent'
                            // 回车键盘的时间
                            returnKeyType='search'
                            // 光标的颜色
                            selectionColor='#ff4f39'
                            placeholder={this.props.placeholder?this.props.placeholder:''}
                            placeholderTextColor='#CACBCC'
                            clearButtonMode='while-editing'
                            onChangeText={text => this.textOnChangeAction(text)}
                        />
                    </View>
                    <Text
                        style={{fontSize: 15, color: '#333333', marginRight: 2, padding: 16}}
                        onPress={() => this.searchAction()}
                    >
                        搜索
                    </Text>
                </View>
                <RowLineView />
            </View>
        );
    }

}

export {SearchBarBtn, SearchBarView}


const styles = StyleSheet.create({
    contentStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F0F1F5',
        borderRadius: 15,
        borderStyle: 'solid',
        height:30
    },
    textStyle: {
        fontSize: size.fontSizeBase,
        color: '#333'
    }
});