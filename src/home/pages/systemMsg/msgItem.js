import React, {Component} from 'react'
import {TouchableOpacity, StyleSheet, View, Text} from 'react-native'
import Feather from "react-native-vector-icons/SimpleLineIcons";
import {colors, size} from "../../../style/variables"
import {messageType} from '../../../common/tool/dictionaries';
import {inject} from "mobx-react";
import {
    RowContentView,
    ItemSpaceView,
    LineColumnItemView,
    IconBgView,
    LineBetweenItemView
} from './style'


@inject(['userStore']) // 注入对应的store

export default class MsgItem extends Component {
    constructor(props) {
        super(props);
        // 获取对应的账号信息
        this.store = this.props.userStore
        // 绑定
        this.msgTypeStringForKey = this.msgTypeStringForKey.bind(this)
    }
    // 将key转换成对应的字符串
    msgTypeStringForKey(item) {
        let key = item.type;
        if (!key) return ''
        let obj = null
        messageType.filter((msgItem) => {
            // 判断消息类型是否相等
            if (msgItem.dictKey == key) {
                // 是否需要判断操作的roleCode
                if (msgItem.pushRoleCode) {
                    if (msgItem.pushRoleCode == item.operaRoleCode) {
                        // 是否需要判断接收的roleCode
                        if (msgItem.getRoleCode) {
                            if (this.store) {
                                if (msgItem.getRoleCode == this.store.role.roleCode) {
                                    obj = msgItem;
                                }
                            }
                        }else {
                            obj = msgItem;
                        }
                    }
                }else {
                    // 是否需要判断接收的roleCode
                    if (msgItem.getRoleCode) {
                        if (this.store) {
                            if (msgItem.getRoleCode == this.store.role.roleCode) {
                                obj = msgItem;
                            }
                        }
                    }else {
                        obj = msgItem;
                    }
                }
            }
        })
        if (!obj) return '';
        return obj.dictValue
    }

    render() {
        return (
            <TouchableOpacity onPress={() => this.props.goDetailAction(this.props.item)}>
                <View style={{flex: 1, alignItems: 'flex-start'}}>
                    <RowContentView style={{flex: 1}}>
                        <IconBgView>
                            <Feather name='bell' size={30} color='#FFFFFF'/>
                        </IconBgView>
                        <LineColumnItemView style={{flex: 1}}>
                            <LineBetweenItemView>
                                <Text style={[styles.titleTextStyle, {flex: 1}]}>{this.msgTypeStringForKey(this.props.item)}</Text>
                                <Text style={styles.contentTextStyle}>{moment(this.props.item.createTime).format('YYYY-MM-DD HH:mm')}</Text>
                            </LineBetweenItemView>
                            <Text style={styles.contentTextStyle} numberOfLines={1} ellipsizeMode='tail'>{this.props.item.info}</Text>
                        </LineColumnItemView>
                    </RowContentView>
                    <ItemSpaceView />
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    leftContentStyle:{
        flexDirection: 'row',
        justifyContent: 'center'

    },
    rightContentStyle:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    titleTextStyle:{
        fontSize: size.fontsizeMd,
        color: '#323233',
        marginLeft: 8,
        fontFamily: 'PingFangSC-Regular'
    },
    contentTextStyle:{
        fontSize: size.fontSizeBase,
        color: '#969799',
        marginLeft: 8,
        marginRight: 16,
        fontFamily: 'PingFangSC-Regular'
    }
})
