import React, {Component} from 'react'
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/dist/Feather";
import {colors} from "../../../style/variables";
import {RowContentView} from "./style";
import {inject} from "mobx-react";
import RejectApplyView from "./rejectApply";

// 获取当前屏幕宽度
const screen = Dimensions.get('window')

@inject(['userStore']) // 注入对应的store

export default class OperationView extends Component {
    constructor(props) {
        super(props);
        // 获取对应的账号信息
        this.store = this.props.userStore
    }

    render() {
        // 角色（销售经理 、销售顾问）
        let roleCode = this.store.role.roleCode;
        // 是否申请小订退订
        let isApplyCancelOrder = this.props.orderStatus == 7;
        const {cancelFlowStatus} = this.props
        if (isApplyCancelOrder) {
            if (roleCode == 'rolePartnerSaleManage') {
                return (
                    <CusManageOperationView
                        cancelFlowStatus={cancelFlowStatus}
                        printContractCallBack={() => {
                            // 防止回调未实现
                            if (!this.props.printContractEvent) return;
                            this.props.printContractEvent();
                        }}
                        rejectCallBack={() => {
                            // 防止回调未实现
                            if (!this.props.rejectEvent) return;
                            this.props.rejectEvent();
                        }}
                        agreeCallBack={() => {
                            // 防止回调未实现
                            if (!this.props.agreeEvent) return;
                            this.props.agreeEvent();
                        }}
                    />
                )
            }else if (roleCode == 'rolePartnerSale') {
                return (
                    <CusOperationView
                        cancelFlowStatus={cancelFlowStatus}
                        printContractCallBack={() => {
                            // 防止回调未实现
                            if (!this.props.printContractEvent) return;
                            this.props.printContractEvent();
                        }}
                        agreeCallBack={() => {
                            // 防止回调未实现
                            if (!this.props.agreeEvent) return;
                            this.props.agreeEvent();
                        }}
                    />
                )
            }
        }
        return (
            <PrinterOnlyOperationView
                printContractCallBack={() => {
                    // 防止回调未实现
                    if (!this.props.printContractEvent) return;
                    this.props.printContractEvent();
                }}
            />
        )
    }
}

class PrinterOnlyOperationView extends Component {
    render() {
        return (
            <RowContentView style={{backgroundColor: '#FFFFFF'}}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    underlayColor={'#00CFB4'}
                    onPress={() => this.props.printContractCallBack()}
                >
                    <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 107, height: 48}}>
                        <Icon name='printer' size={24} color={colors.primary} light />
                        <Text style={{fontSize: 10, color: '#383C43'}}>生成合同</Text>
                    </View>
                </TouchableOpacity>
            </RowContentView>
        )
    }
}

class CusOperationView extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {cancelFlowStatus} = this.props
        const color = cancelFlowStatus &&cancelFlowStatus==1? '#00CFB4':'#aaaaaa'
        return (
            <RowContentView style={{backgroundColor: '#FFFFFF'}}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    underlayColor={'#00CFB4'}
                    onPress={() => this.props.printContractCallBack()}
                >
                    <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 107, height: 48}}>
                        <Icon name='printer' size={24} color={colors.primary} light />
                        <Text style={{fontSize:10, colors: '#383C43'}}>生成合同</Text>
                    </View>
                </TouchableOpacity>
                {cancelFlowStatus!=0?<TouchableOpacity
                    activeOpacity={0.5}
                    underlayColor={color}
                    onPress={() => {
                        if(cancelFlowStatus==2) return
                        this.props.agreeCallBack()
                    }}
                    >
                    <View style={[styles.agreeBtnOnlyContainerStyle, {backgroundColor: cancelFlowStatus==2?'#BBBBBB':'#00CFB4'}]}>
                    <Text style={styles.textStyle}>同意申请</Text>
                    </View>
                    </TouchableOpacity>:null}
            </RowContentView>
        )
    }
}

class CusManageOperationView extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {cancelFlowStatus} = this.props
        const color = cancelFlowStatus &&cancelFlowStatus==1? '#00CFB4':'#aaaaaa'
        return (
            <RowContentView style={{backgroundColor: '#FFFFFF'}}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    underlayColor={'#00CFB4'}
                    onPress={() => this.props.printContractCallBack()}
                >
                    <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 107, height: 48}}>
                        <Icon name='printer' size={24} color={colors.primary} light />
                        <Text style={{fontSize:10, colors: '#383C43'}}>生成合同</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.5}
                    underlayColor={'#00CFB4'}
                    onPress={() => this.props.rejectCallBack()}
                >
                    <View style={[styles.btnContainerStyle, {backgroundColor: '#66E2D2'}]}>
                        <Text style={styles.textStyle}>驳回申请</Text>
                    </View>
                </TouchableOpacity>
                {cancelFlowStatus!=0?<TouchableOpacity
                    activeOpacity={0.5}
                    underlayColor={color}
                    onPress={() => {
                        if(cancelFlowStatus==2) return
                        this.props.agreeCallBack()
                    }}
                >
                    <View style={[styles.agreeBtnOnlyContainerStyle, {backgroundColor: '#00CFB4'}]}>
                        <Text style={styles.textStyle}>同意申请</Text>
                    </View>
                </TouchableOpacity>:null}
                <RejectApplyView />
            </RowContentView>
        )
    }
}


const styles = StyleSheet.create({
    textStyle:{
        fontSize: 15,
        color: '#FFFFFF',
        fontFamily: 'PingFangSC-Regular'
    },
    btnContainerStyle:{
        width: (screen.width-107)*0.5,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center'
    },
    agreeBtnOnlyContainerStyle: {
        width: screen.width-107,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
