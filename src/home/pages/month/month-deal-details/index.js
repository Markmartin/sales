import React, {Component} from 'react';
import {View} from 'react-native';
import {withNavigationFocus} from "react-navigation";
// 样式组件
import {colors} from "../../../../style/variables";
import ClientDetails from "../../../components/client-details";


const dataForm = [
    {
        value: '1666222266665554',
        key: 'name1',
        label: '订单编号：'
    },
    {
        value: '30000',
        key: '',
        label: '订单金额：'
    },
    {
        value: '15000484544',
        key: '',
        label: '发票编号：'
    },
    {
        value: '',
        key: '',
        label: '订单状态：'
    },
    {
        value: '张三',
        key: '',
        label: '客户姓名：'
    },
    {
        value: '直客版65度电',
        key: '',
        label: '车型车系：'
    },
    {
        value: '',
        key: '',
        label: 'VIN码：'
    },
    {
        value: '',
        key: '',
        label: '外观颜色：'
    },
    {
        value: '',
        key: '',
        label: '内饰颜色：'
    },
    {
        value: '是',
        key: '',
        label: '充电桩：'
    },
    {
        value: '',
        key: '',
        label: '选装包：'
    }
]

class MonthDeal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataList: [],
            dataForm: dataForm
        }
        this.onPressButton = this.onPressButton.bind(this)
        this.filterHandel = this.filterHandel.bind(this)
    }

    filterHandel(item) {
        switch (item.key) {
            // case 'name1':
            //     return '转换哦哦哦11';
            default:
                return item.value
        }
    }

    componentDidMount() {
        const {navigation} = this.props;
        const methods = navigation.getParam('key');
        console.log(methods)
    }

    onPressButton() {

    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: colors.background, paddingHorizontal: 16, paddingVertical: 10}}>
                <ClientDetails filterHandel={this.filterHandel} dataForm={this.state.dataForm}/>
            </View>
        );
    }
}
export default withNavigationFocus(MonthDeal)
