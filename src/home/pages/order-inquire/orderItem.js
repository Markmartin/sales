import React, {Component} from 'react'
import {TouchableOpacity, StyleSheet, View, Text, Image} from "react-native";
import Sex from "../../../common/components/sex";
import {colors, size} from "../../../style/variables";
import {level} from "../../../common/tool/dictionaries";
import {
    RowLineView,
    ItemSpaceView,
    RowContentView,
    RowCenterItemView,
    ColumnContentView,
    LineBetweenItemView
} from './style'
import {buyTypeHash} from '../../data-config'
import {inject} from 'mobx-react'
@inject(['dictStore']) // 注入对应的store
export default class OrderItem extends Component {
    constructor (props) {
        super(props);
        // 绑定
        this.levelHandel = this.levelHandel.bind(this);
        this.dictStore = this.props.dictStore
    }
    // 级别转换
    levelHandel(value) {
        if (!value) return ''
        let obj = null
        level.filter(item => {
            if (item.dictKey === value) obj = item
        })
        return obj ? obj.dictValue : ''
    }

    render() {
        const {hashData} = this.dictStore
        const {retailOrderStatus} = hashData
        const {buyType,orderStatus} = this.props.item
        const buyTypeName = buyType ? buyTypeHash[buyType] : ''
        return(
            <View style={{flex: 1}}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    underlayColor={'#00CFB4'}
                    onPress={() => this.props.jumpPageCallBack(this.props.item)}
                >
                    <View style={styles.listBox}>
                        <LineBetweenItemView style={{paddingHorizontal: 16, marginTop: 16}}>
                            <Text style={[styles.vehicle, {flex: 1, marginRight: 10}]}>单号：{this.props.item.orderNo}</Text>
                            <Text style={styles.vehicle}>{moment(this.props.item.createTime).format('YYYY-MM-DD HH:mm')}</Text>
                        </LineBetweenItemView>
                        <LineBetweenItemView style={{paddingRight:16}}>
                            <Text style={[styles.vehicle, {paddingHorizontal: 16, marginTop: 12, marginBottom: 16}]}>订单状态：{orderStatus?retailOrderStatus[orderStatus].dictValue:''}</Text>
                            <Text style={styles.vehicle}>购车方案：{buyTypeName}</Text>
                        </LineBetweenItemView>
                        <RowLineView />
                        <LineBetweenItemView style={{paddingHorizontal: 16, marginTop: 16, marginBottom: 16}}>
                            <ColumnContentView style={{flex: 1}}>
                                <RowContentView>
                                    <Text style={styles.boldTextStyle}>{this.props.item.customerName}</Text>
                                    <Sex data={this.props.item.sex}/>
                                    <Text style={styles.boldTextStyle}>{this.props.item.customerMobile}</Text>
                                </RowContentView>
                                <RowContentView style={{marginTop: 12}}>
                                    <Text style={[styles.vehicle, {marginRight: 12}]}>{this.levelHandel(this.props.item.level)}</Text>
                                    <Text style={styles.vehicle}>{this.props.item.vehicleName}</Text>
                                </RowContentView>
                            </ColumnContentView>
                            <RowCenterItemView>
                                <Text style={styles.listRightCont}>详情</Text>
                                <Image style={styles.listRightIcon} source={require('../../../assets/images/ic_next.png')} />
                            </RowCenterItemView>
                        </LineBetweenItemView>
                    </View>
                </TouchableOpacity>
                <ItemSpaceView />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    boldTextStyle: {
        fontSize: size.fontsizeMd,
        color: colors.black,
        fontWeight: "bold"
    },
    listBox: {
        backgroundColor: '#fff'
    },
    listRightCont: {
        color: '#99999A',
        alignSelf: 'center',
        fontSize: 14
    },
    listRightIcon: {
        width: 15,
        height: 15,
        marginLeft: 6,
        alignSelf: 'center'
    },
    vehicle: {
        fontFamily: 'PingFangSC-Regular',
        fontSize: 14,
        color: '#99999A'
    }
})
