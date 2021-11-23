import React, {Component} from 'react'
import {TouchableOpacity, StyleSheet, View, Text} from 'react-native'
import Feather from "react-native-vector-icons/Feather";
import {colors, size} from "../../../style/variables"
import Sex from "../../../common/components/sex";
import {
    RowContentView,
    LineRowItemView,
    RowLineView
} from './style'
import PhoneCall from "../../../common/components/phone-call";

export default class SearchItem extends Component {

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center'}}>
                <RowContentView style={{marginTop:12, marginBottom:12}}>
                    <View style={styles.leftContentStyle}>
                        <LineRowItemView>
                            <Text style={styles.titleTextStyle}>{this.props.item.name}</Text>
                            <Sex data={this.props.item.sex}/>
                            <PhoneCall style={[styles.titleTextStyle, {paddingLeft:0}]} phone={this.props.item.phone}/>
                        </LineRowItemView>
                        <LineRowItemView style={{marginTop:10}}>
                            <Text style={styles.contentTextStyle}>{this.props.item.satCustomerIntentionVO.vehicleName}</Text>
                        </LineRowItemView>
                    </View>
                    <TouchableOpacity onPress={() => this.props.goDetailAction(this.props.item)}>
                        <View style={styles.rightContentStyle}>
                            <Text style={{fontSize:size.fontSizeBase, color: colors.grey3}}>详情</Text>
                            <Feather style={{paddingLeft:10, paddingRight:5}} name='chevron-right' size={16} color='#C2C8D2'/>
                        </View>
                    </TouchableOpacity>
                </RowContentView>
                <RowLineView />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    leftContentStyle:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    rightContentStyle:{
        flexDirection: 'row',
        justifyContent: 'center'
    },
    titleTextStyle:{
        fontSize: size.fontsizeMd,
        color: '#323233',
        paddingLeft: 16,
        fontFamily: 'PingFangSC-Medium'
    },
    contentTextStyle:{
        fontSize: size.fontSizeBase,
        color: '#969799',
        paddingLeft: 16,
        fontFamily: 'PingFangSC-Regular'
    }
})
