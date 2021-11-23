import React, {Component} from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import {inject, observer} from 'mobx-react'
import {sharePartnerOpen, shareClues, showCancel} from "./share-service";
import {Tip} from "beeshell";

/**
 * 此组件用来显示线索页面的分享按钮
 * 当用户角色为电商渠道的销售经理 可以使用添加按钮
 */
@inject(['userStore']) // 注入对应的store
@observer // 监听当前组件
export default class ShareButton extends Component {
    constructor(props) {
        super(props)
        this.store = this.props.userStore
        this.state = {
            showShareIcon: false,
            show: false
        }
    }

    // 外部调用
    change(showShareIcon) {
        this.setState({showShareIcon})
    }

    // 根据领取未领取Tab显示
    showByTab(show){
        this.setState({show})
    }

    // 响应点击事件
    click() {
        const {showShareIcon} = this.state
        if (showShareIcon) {
            if (!shareClues.length) return Tip.show('并未选择线索！', 1000, 'center')
            sharePartnerOpen()
        } else {
            // 当他是false，按钮点击时字是分享
            showCancel()
        }
        this.setState({showShareIcon: !showShareIcon})
    }

    render() {
        const {role, user} = this.store
        const {showShareIcon, show} = this.state
        if (!show || !role || !user) return null
        const {roleCode} = role
        const {partner} = user
        const showIt = (roleCode === 'rolePartnerSaleManager' && partner.accountGroupCode === 'Y009')
        return (
            <View>
                {showIt ? <TouchableOpacity
                    onPress={() => this.click()}>
                    <Text style={{textAlign: 'center', color: '#fff', paddingHorizontal: 15, fontSize: 16}}>
                        {showShareIcon ? '确定' : '分享'}</Text>
                </TouchableOpacity> : null}
            </View>
        )
    }
}
