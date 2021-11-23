import React, {Component} from 'react'
import {RowContentView} from "./style";
import {StyleSheet, Text, View} from "react-native";
import {size} from "../../../style/variables";
import DateTimePicker from "../../../common/components/date-time";
import {Loading} from "../../../common/components/loading";
import {Tip} from 'beeshell';

export default class DeliveryTimeView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            deliveryTime: this.props.content,
            show: false
        }
        // 绑定
        this.changeDeliveryTime = this.changeDeliveryTime.bind(this);
    }
    selectDeliveryTime(date, time) {
        let dateTime = moment(`${date} ${time}`).format('YYYY-MM-DD HH:mm')
        this.setState({
            show: false,
            deliveryTime: dateTime
        })
        // 调接口，修改预计交车时间
        this.changeDeliveryTime(dateTime);
    }
    // 修改预计交车时间
    changeDeliveryTime(dateTime) {
        let param = {deliveryCarDate: dateTime};
        Loading.show();
        axios.post('/admin/satOrderCustomer/updateDeliveryDate',{
            params: param
        }).then(responseJson => {
            // 隐藏菊花
            Loading.hidden();
            // 提交成功
            if (responseJson.code === 200) {
                Tip.show('修改成功！', 1000, 'center');
            }else {
                Tip.show('修改失败！', 1000, 'center');
            }
        }).catch(error => {
            // 隐藏菊花
            Loading.hidden();
            console.error(error);
        });
    }
    // 显示日历时间控件
    showTimePiker() {
        this.setState({
            show: true
        })
    }
    render() {
        return(
            <RowContentView>
                <Text style={styles.lineTitleStyle}>{this.props.title}</Text>
                <Text style={styles.deliveryCarTimeStyle}>{this.state.deliveryTime}</Text>
                <Text style={styles.editTextStyle} onPress={() => this.showTimePiker()}>修改</Text>
                <DateTimePicker show={this.state.show} callBack={(date, time) => this.selectDeliveryTime(date, time)}></DateTimePicker>
            </RowContentView>
        )
    }
}


const styles = StyleSheet.create({
    lineTitleStyle:{
        fontSize: size.fontSizeBase,
        color: '#323233',
        width: 115,
        marginLeft: 16,
        marginTop: 16
    },
    deliveryCarTimeStyle:{
        fontSize: size.fontSizeBase,
        color: '#323233',
        width: 130,
        marginTop: 16
    },
    editTextStyle:{
        color: '#37C1B4',
        fontSize: 14,
        textDecorationLine: 'underline',
        marginLeft: 16,
        marginTop: 16
    }
})