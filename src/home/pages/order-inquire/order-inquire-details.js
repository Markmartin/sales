// 订单详情
import React, {Component} from 'react';
import {View} from 'react-native';
// 样式组件
import {colors} from "../../../style/variables";
import {level, orderStatus} from "../../../common/tool/dictionaries";
import ClientDetails from "../../components/client-details";
import {forEach, cloneDeep} from 'lodash'

const dataForm = [
    {
        value: '',
        key: 'orderNo',
        label: '订单编号：'
    },
    {
        value: '',
        key: 'bigAmount',
        label: '订单金额：'
    },
    {
        value: '',
        key: 'invoiceCode',
        label: '发票编号：'
    },
    {
        value: '',
        key: 'orderStatus',
        label: '订单状态：'
    },
    {
        value: '',
        key: 'customerName',
        label: '客户姓名：'
    },

    {
        value: '',
        key: 'vin',
        label: 'VIN码：'
    },
    {
        value: '',
        key: [
            {
                name :'orderCustomerDetailVO'
            },
            {
                name:'vehicleName'
            }
        ],
        label: '车型车系：'
    },
    {
        value: '',
        key: [
            {
                name :'orderCustomerDetailVO'
            },
            {
                name:'colorNameOut'
            }
        ],
        label: '外观颜色：'
    },
    {
        value: '',
        key:  [
            {
                name :'orderCustomerDetailVO'
            },
            {
                name:'colorNameIn'
            }
        ],
        label: '内饰颜色：'
    },
    {
        value: '',
        key: 'isCancel',
        label: '充电桩：'
    },
    {
        value: '',
        key:  [
            {
                name :'orderCustomerDetailVO'
            },
            {
                name:'customPackName'
            }
        ],
        label: '选装包：'
    },
    {
        value: '',
        key: 'contractImgPath',
        label: '协议：'
    }
]

export default class MonthDeal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataForm: cloneDeep(dataForm)
        }
        this.onPressButton = this.onPressButton.bind(this)
    }

    filterHandel(item) {
        switch (item.key) {
            case 'isCancel':
                return item.value === 1 ? '是' : '否'
            case 'customPackName':
                return JSON.parse(item.value).join(';')
            case 'orderStatus':
                orderStatus.filter(obj =>{
                    if(obj.dictKey === item.value+'') item.value = obj.dictValue
                })
                return item.value
            default:
                return item.value
        }
    }

    componentDidMount() {
        const {navigation} = this.props;
        const orderNo = navigation.getParam('orderNo');
        axios.get('/admin/satOrderCustomer/loadDetail?orderNo=' + orderNo)
            .then(res => {
                if (res.code === 200) {
                    this.state.dataForm.filter(item => {
                        if (!res.data[item.key] && toString.call(item.key) !== '[object Array]') {
                            return
                        }
                        if(toString.call(item.key) === '[object Array]'){
                            let val = res.data
                            item.key.forEach((arr,index)=>{
                                if(arr.name=== 'customPackName' && val[arr.name]){
                                    val = JSON.parse(val[arr.name]).join(';')
                                    return
                                }
                                val = val[arr.name]
                            })
                            item.value = val
                        }else{
                            item.value = res.data[item.key]
                        }
                    })
                    this.setState({
                        dataForm: this.state.dataForm
                    })
                }
            })
    }

    onPressButton() {

    }
    componentWillUnmount(){
        this.state = {
            dataForm: cloneDeep(dataForm)
        }
    }
    render() {
        return (
            <View style={{flex: 1, backgroundColor: colors.background, paddingHorizontal: 16, paddingVertical: 10}}>
                <ClientDetails filterHandel={this.filterHandel.bind(this)} dataForm={this.state.dataForm}/>
            </View>
        );
    }
}
