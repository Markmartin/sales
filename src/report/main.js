import React, {Component} from 'react';
import {Dimensions, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {withNavigationFocus} from 'react-navigation';
import {colors, size} from '../style/variables'

import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import WebChart from '../common/components/chart';
import navigation from "../common/services/navigation"
import {Loading} from "../common/components/loading"
import {Datepicker, SlideModal} from "beeshell"
import {inject} from "mobx-react"
import Conversion from './conversion'

const window = Dimensions.get('window')
const screenHeight = Platform.OS === 'ios' ? window.height : window.height - StatusBar.currentHeight
const barColor = ['#DE5667', '#3F91F7', '#61BE67', '#F3CC49']

@inject(['userStore']) // 注入对应的store
class Report extends Component {
    constructor(props) {
        super(props)
        this.state = {
            salesConsultantNo: "",
            partnerCode: "",
            handleVehicleTarget: "0/0", //月交车目标
            testDriveTarget: "0/0",     //月试驾目标
            customerOrderTatget: "0/0", //月订单目标
            newCustomerTarget: "0/0", //月客户目标
            lostCustomerCount: "0",
            // queryDate: moment().format('YYYY-MM-DD'),

            chooseDate: moment().format('YYYY-MM-DD'),

            salesHandleVehicle: '',//fellow月完成交车
            allHandleVehicle: '', //总月交车目标
            salesTestDrive: '', //fellow月完成试驾
            allTestDrive: '',//总月试驾目标
            salesCustomerOrder: '', //fellow月新建订单
            allCustomerOrder: '', //总月订单目标
            salesNewCustomer: '',//fellow月新增客户
            allNewCustomer: '',// 总月客户目标

            evaluates: [[], [], [], []] //评价
        }
        // 标记状态
        this.reload = false
        this.store = this.props.userStore //通过props来导入访问已注入的store
    }

    // 获取焦点时刻
    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (this.props.isFocused) {
            // 如果reload了不再请求
            if (this.reload) return null
            this.getFunnelData()
            // 标记reload
            this.reload = true
        } else {
            this.reload = false
        }
        return null
    }

    //获取漏斗图数据
    getFunnelData() {
        Loading.show()
        const queryDate = this.state.chooseDate
        axios.get('/admin/handleVehicle/taskTarget', {params: {queryDate}})
            .then(({data}) => {
                Loading.hidden()
                this.setState({...data})
            })

        axios.get('/admin/evaluate/evaluateCount')
            .then(({data}) => {
                this.setState({
                    evaluates: data
                })
            })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.chooseDate !== prevState.chooseDate) {
            this.getFunnelData()
        }
    }

    componentDidMount() {

        console.log(this.store.user.subMap.roleList)

    }

    toEvaluteList = (dataIndex) => {
        navigation.navigate('Evaluate')
    }

    //计算百分比，保留整数，四舍五入
    getPercent(curNum, totalNum, isHasPercentStr) {
        curNum = parseFloat(curNum);
        totalNum = parseFloat(totalNum);

        if (isNaN(curNum) || isNaN(totalNum)) {
            return '-';
        }

        return isHasPercentStr ?
            totalNum <= 0 ? '--' : (Math.round(curNum / totalNum * 100) + '%') :
            totalNum <= 0 ? 100 : (Math.round(curNum / totalNum * 100));
    }

    //构造柱状图每个柱子的数据
    generateData(evaluates) {
        let data = []
        let total = 0


        evaluates.map((item, index) => {
            total += item.evalCount
        })

        evaluates.map((item, index) => {

            let evaluate = {
                value: item.evalCount,
                label: {
                    formatter: '{c}人\n' + this.getPercent(item.evalCount, total, true)
                }
            }
            data.push(evaluate)
        })

        return data.reverse()
    }

    //根据数据获取总评价人数
    getTotalCount(evaluates) {
        let total = 0

        evaluates.map((item, index) => {
            total += item.evalCount
        })
        return total
    }

    formatLabelText(target, done) {
        return '{b}  ' + '{c}/' + target + '   完成率：' + this.getPercent(done, target, true)
    }

    rendercounselorEvalute(option, roleCode) {

        if (roleCode === 'rolePartnerSale' || roleCode === 'rolePartnerSaleManager' || roleCode === 'rolePartnerManager') {
            return (<View style={styles.chartBg}>
                <View style={styles.titleContainer}>
                    <View style={styles.titleLine}/>
                    <Text style={styles.titleText}>品鉴顾问评价</Text>
                    <View style={{flex: 1}}/>
                    <Text
                        style={styles.titleSubText}>共计：{this.getTotalCount(this.state.evaluates[3])}人</Text>
                </View>
                <WebChart option={option} style={{width: '100%', height: 300}}/>
            </View>)
        } else {
            return null
        }
    }

    renderTotalEvalute(option, roleCode) {
        if (roleCode === 'rolePartnerSaleManager' || roleCode === 'rolePartnerManager') {
            return (<View style={styles.chartBg}>
                <View style={styles.titleContainer}>
                    <View style={styles.titleLine}/>
                    <Text style={styles.titleText}>总体服务评价</Text>
                    <View style={{flex: 1}}/>
                    <Text
                        style={styles.titleSubText}>共计：{this.getTotalCount(this.state.evaluates[0])}人</Text>
                </View>
                <WebChart option={option} style={{width: '100%', height: 300}}
                          exScript={`
                          chart.on('click', (params) => {
                            if(params.componentType === 'series') {
                              window.postMessage(params.dataIndex);
                            }
                          });
                    `}
                          onMessage={this.toEvaluteList}
                />
            </View>)
        } else {
            return null
        }
    }

    renderTrialEvalute(option, roleCode) {
        if (roleCode === 'rolePartnerTestDrive' || roleCode === 'rolePartnerSaleManager' || roleCode === 'rolePartnerManager') {
            return (
                <View style={styles.chartBg}>
                    <View style={styles.titleContainer}>
                        <View style={styles.titleLine}/>
                        <Text style={styles.titleText}>试驾评价</Text>
                        <View style={{flex: 1}}/>
                        <Text
                            style={styles.titleSubText}>共计：{this.getTotalCount(this.state.evaluates[1])}人</Text>
                    </View>
                    <WebChart option={option} style={{width: '100%', height: 300}}/>
                </View>
            )
        } else {
            return null
        }
    }

    renderDeliveryEvalute(option, roleCode) {
        if (roleCode === 'rolePartnerHandleVehicle' || roleCode === 'rolePartnerSaleManager' || roleCode === 'rolePartnerManager') {
            return (
                <View style={styles.chartBg}>
                    <View style={styles.titleContainer}>
                        <View style={styles.titleLine}/>
                        <Text style={styles.titleText}>交车评价</Text>
                        <View style={{flex: 1}}/>
                        <Text
                            style={styles.titleSubText}>共计：{this.getTotalCount(this.state.evaluates[2])}人</Text>
                    </View>
                    <WebChart option={option} style={{width: '100%', height: 300}}/>
                </View>
            )
        } else {
            return null
        }
    }

    //漏斗图
    renderFunnel(roleCode, target, done, option) {

        if (roleCode === 'rolePartnerSaleManager' || roleCode === 'rolePartnerManager') {
            //销售经理和总经理，显示所有数据
            return (
                <View style={styles.chartBg}>
                    <View style={styles.titleContainer}>
                        <View style={styles.titleLine}/>
                        <Text style={styles.titleText}>销售漏斗图</Text>
                    </View>
                    <WebChart option={option} style={{width: '100%', height: 300}}/>
                    <View style={{position: "absolute", right: 20, top: "44%"}}>
                        <Conversion percent={this.getPercent(done.trialDone, done.newCusDone, true)}/>

                        <Conversion percent={this.getPercent(done.orderDone, done.trialDone, true)} top="13%"/>

                        <Conversion percent={this.getPercent(done.deliveryDone, done.orderDone, true)} top="13%"/>
                    </View>
                </View>
            )
        } else if (roleCode === 'rolePartnerSale') {
            //销售助手
            return (
                <View style={styles.chartBg}>
                    <View style={styles.titleContainer}>
                        <View style={styles.titleLine}/>
                        <Text style={styles.titleText}>销售漏斗图</Text>
                    </View>
                    <WebChart option={option} style={{width: '100%', height: 300}}/>
                    <View style={{position: "absolute", right: 20, top: "50%"}}>
                        <Conversion percent={this.getPercent(done.trialDone, done.newCusDone, true)}/>

                        <Conversion percent={this.getPercent(done.orderDone, done.trialDone, true)} top="27%"/>
                    </View>
                </View>
            )
        } else if (roleCode === 'rolePartnerTestDrive' || roleCode === 'rolePartnerHandleVehicle') {
            //交车专员和试驾专员
            return (
                <View style={styles.chartBg}>
                    <View style={styles.titleContainer}>
                        <View style={styles.titleLine}/>
                        <Text style={styles.titleText}>销售漏斗图</Text>
                    </View>
                    <WebChart option={option} style={{width: '100%', height: 300}}/>
                </View>
            )
        } else {
            //其他角色，不显示漏斗
            return null
        }
    }

    renderDatePicker(roleCode) {
        if (roleCode === 'rolePartnerTestDrive' || roleCode === 'rolePartnerHandleVehicle' || roleCode === 'rolePartnerSale'
            || roleCode === 'rolePartnerSaleManager' || roleCode === 'rolePartnerManager') {
            return (
                <View style={{
                    height: 40,
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: colors.white,
                    justifyContent: 'center'
                }}>
                    <SimpleIcon
                        name='arrow-left'
                        size={16}
                    />
                    <TouchableOpacity style={{marginLeft: 50, marginRight: 50}} activeOpacity={0.8} onPress={() => {
                        this._datePicker.open()
                    }}>
                        <Text>
                            {/*{this.state.chooseDate.slice(0, -3)}*/}
                            {this.state.chooseDate}
                        </Text>
                    </TouchableOpacity>
                    <SimpleIcon
                        name='arrow-right'
                        size={16}
                    />
                </View>
            )
        } else {
            return (
                <Text style={{
                    fontSize: 14,
                    alignSelf: 'center',
                    textAlign: 'center',
                    paddingTop: 30,
                    color: colors.grey3
                }}>
                    无报表数据
                </Text>
            )
        }
    }


    render() {


        let newCusTarget = this.state.allNewCustomer === "" ? 0 : parseInt(this.state.allNewCustomer);
        const newCusDone = this.state.salesNewCustomer === "" ? 0 : parseInt(this.state.salesNewCustomer)
        if (newCusTarget === 0) newCusTarget = newCusDone;

        let trialTarget = this.state.allTestDrive === "" ? 0 : parseInt(this.state.allTestDrive)
        const trialDone = this.state.salesTestDrive === "" ? 0 : parseInt(this.state.salesTestDrive)
        if (trialTarget === 0) trialTarget = trialDone

        let orderTarget = this.state.allCustomerOrder === "" ? 0 : parseInt(this.state.allCustomerOrder)
        const orderDone = this.state.salesCustomerOrder === "" ? 0 : parseInt(this.state.salesCustomerOrder)
        if (orderTarget === 0) orderTarget = orderDone

        let deliveryTarget = this.state.allHandleVehicle === "" ? 0 : parseInt(this.state.allHandleVehicle)
        const deliveryDone = this.state.salesHandleVehicle === "" ? 0 : parseInt(this.state.salesHandleVehicle)
        if (deliveryTarget === 0) deliveryTarget = deliveryDone

        let target = {
            newCusTarget: newCusTarget,
            trialTarget: trialTarget,
            orderTarget: orderTarget,
            deliveryTarget: deliveryTarget
        }

        let done = {
            newCusDone: newCusDone,
            trialDone: trialDone,
            orderDone: orderDone,
            deliveryDone: deliveryDone
        }

        let donePercent = ''

        const fullTargetData = [
            {
                value: newCusTarget,
                name: '新增客户',
                itemStyle: {
                    color: '#3F91F7'
                },
            },
            {
                value: trialTarget,
                name: '试乘试驾',
                itemStyle: {
                    color: '#6CCACE'
                }
            },
            {
                value: orderTarget,
                name: '订单',
                itemStyle: {
                    color: '#97D7A2'
                }
            },
            {
                value: deliveryTarget,
                name: '交车',
                itemStyle: {
                    color: '#FBEAAB'
                }
            }
        ]
        const fullDoneData = [
            {
                value: newCusDone,
                name: '新增客户',
                itemStyle: {
                    color: '#3F91F7',
                },
                label: {
                    formatter: this.formatLabelText(newCusTarget, newCusDone)
                }
            },
            {
                value: trialDone,
                name: '试乘试驾',
                itemStyle: {
                    color: '#6CCACE',
                },
                label: {
                    formatter: this.formatLabelText(trialTarget, trialDone)
                }
            },
            {
                value: orderDone,
                name: '订单',
                itemStyle: {
                    color: '#97D7A2',
                },
                label: {
                    formatter: this.formatLabelText(orderTarget, orderDone)
                }
            },
            {
                value: deliveryDone,
                name: '交车',
                itemStyle: {
                    color: '#FBEAAB',
                },
                label: {
                    formatter: this.formatLabelText(deliveryTarget, deliveryDone)
                }
            }
        ]
        const fullLegendData = ['新增客户', '试乘试驾', '订单', '交车']
        const role = this.store.role
        const roleCode = role.roleCode
        let legendData = []
        let targetData = []
        let doneData = []
        if (roleCode === 'rolePartnerSaleManager' || roleCode === 'rolePartnerManager') {
            //销售经理
            legendData = fullLegendData
            targetData = fullTargetData
            doneData = fullDoneData

            donePercent = this.getPercent(newCusDone, newCusTarget, true)
        } else if (roleCode === 'rolePartnerSale') {
            //销售顾问，只看到新增客户、试驾、交车
            legendData = [fullDoneData[0], fullLegendData[1], fullLegendData[2]]
            targetData = [fullTargetData[0], fullTargetData[1], fullTargetData[2]]
            doneData = [fullDoneData[0], fullDoneData[1], fullDoneData[2]]

            donePercent = this.getPercent(newCusDone, newCusTarget, true)
        } else if (roleCode === 'rolePartnerTestDrive') {
            //试驾专员，只看得到试驾
            legendData = [fullDoneData[1]]
            targetData = [fullTargetData[1]]
            doneData = [fullDoneData[1]]

            donePercent = this.getPercent(trialDone, trialTarget, true)
        } else if (roleCode === 'rolePartnerHandleVehicle') {
            //交车专员，只看得到交车
            legendData = [fullDoneData[3]]
            targetData = [fullTargetData[3]]
            doneData = [fullDoneData[3]]

            donePercent = this.getPercent(deliveryDone, deliveryTarget, true)
        }

        let option = {
            title: {
                show: false
            },
            legend: {
                data: legendData,
                top: 15,
                itemWidth: 10,
                itemHeight: 10,
                left: 5,
                selectedMode: false,
                textStyle: {
                    fontSize: 12
                }
            },
            series: [
                {
                    name: '目标',
                    type: 'funnel',
                    width: '70%',
                    height: '80%',
                    maxWidth: '70%',
                    left: 5,
                    sort: 'none',
                    minSize: 2,
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }

                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            opacity: 0.9
                        },
                        emphasis: {
                            opacity: 0.9
                        }
                    },
                    data: targetData

                },
                {
                    name: '实际',
                    type: 'funnel',
                    width: '70%',
                    height: '80%',
                    maxWidth: '70%',
                    maxSize: donePercent,
                    left: 5,
                    sort: 'none',
                    minSize: 2,
                    label: {
                        normal: {
                            position: 'inside',
                            textStyle: {
                                color: '#000',
                                fontSize: 16
                            }
                        },
                    },
                    data: doneData
                }

            ]
        };

        const barGrid = {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        }
        const xAxis = {
            type: 'category',
            data: ['5星', '4星', '3星', '2星', '1星'],
            axisTick: {
                alignWithLabel: true,
                show: false
            }
        }
        const yAxis = {
            type: 'value',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            }
        }
        let serviceOption = {
            grid: barGrid,
            xAxis: [
                xAxis
            ],
            yAxis: [
                yAxis
            ],
            series: [
                {
                    name: '评价人数',
                    type: 'bar',
                    barWidth: '60%',
                    data: this.generateData(this.state.evaluates[0]),
                    label: {
                        normal: {
                            position: 'top',
                            show: true,
                            distance: 20,
                            formatter: '{c}人\n',
                            color: colors.black
                        },

                    },
                    itemStyle: {
                        color: barColor[0]
                    }

                }
            ]
        };

        let counselorOption = {
            grid: barGrid,
            xAxis: [
                xAxis
            ],
            yAxis: [
                yAxis
            ],
            series: [
                {
                    name: '评价人数',
                    type: 'bar',
                    barWidth: '60%',
                    data: this.generateData(this.state.evaluates[3]),
                    label: {
                        normal: {
                            position: 'top',
                            show: true,
                            distance: 20,
                            formatter: '{c}人\n30%',
                            color: colors.black
                        },

                    },
                    itemStyle: {
                        color: barColor[1]
                    }

                }
            ]
        };


        let trialOption = {
            grid: barGrid,
            xAxis: [
                xAxis
            ],
            yAxis: [
                yAxis
            ],
            series: [
                {
                    name: '评价人数',
                    type: 'bar',
                    barWidth: '60%',
                    data: this.generateData(this.state.evaluates[1]),
                    label: {
                        normal: {
                            position: 'top',
                            show: true,
                            distance: 20,
                            formatter: '{c}人\n30%',
                            color: colors.black
                        },

                    },
                    itemStyle: {
                        color: barColor[2]
                    }

                }
            ]
        };

        let deliveryOption = {
            grid: barGrid,
            xAxis: [
                xAxis
            ],
            yAxis: [
                yAxis
            ],
            series: [
                {
                    name: '评价人数',
                    type: 'bar',
                    barWidth: '60%',
                    data: this.generateData(this.state.evaluates[2]),
                    label: {
                        normal: {
                            position: 'top',
                            show: true,
                            distance: 15,
                            formatter: '{c}人\n30%',
                            color: colors.black
                        },

                    },
                    itemStyle: {
                        color: barColor[3]
                    }

                }
            ]
        };


        return (
            <View style={{backgroundColor: colors.grey5, flex: 1}}>
                <View style={{flex: 1, flexDirection: 'column', backgroundColor: colors.background}}>
                    {/*<View style={{*/}
                    {/*height: 40,*/}
                    {/*width: '100%',*/}
                    {/*flexDirection: 'row',*/}
                    {/*alignItems: 'center',*/}
                    {/*backgroundColor: colors.white,*/}
                    {/*justifyContent: 'center'*/}
                    {/*}}>*/}
                    {/*<SimpleIcon*/}
                    {/*name='arrow-left'*/}
                    {/*size={16}*/}
                    {/*/>*/}
                    {/*<TouchableOpacity style={{marginLeft: 50, marginRight: 50}} activeOpacity={0.8} onPress={() => {*/}
                    {/*this._datePicker.open()*/}
                    {/*}}>*/}
                    {/*<Text>*/}
                    {/*{this.state.chooseDate.slice(0, -3)}*/}
                    {/*</Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<SimpleIcon*/}
                    {/*name='arrow-right'*/}
                    {/*size={16}*/}
                    {/*/>*/}
                    {/*</View>*/}
                    {this.renderDatePicker(roleCode)}
                    <ScrollView style={{flex: 1}}>

                        {this.renderFunnel(roleCode, target, done, option)}

                        {/*总体服务评价*/}
                        {this.renderTotalEvalute(serviceOption, roleCode)}


                        {/*品鉴顾问评价*/}
                        {this.rendercounselorEvalute(counselorOption, roleCode)}


                        {/*试驾评价*/}
                        {this.renderTrialEvalute(trialOption, roleCode)}

                        {/*交车评价*/}
                        {this.renderDeliveryEvalute(deliveryOption, roleCode)}


                    </ScrollView>

                    {/*日期选择器*/}
                    <SlideModal
                        ref={(c) => {
                            this._datePicker = c;
                        }}
                        screenHeight={screenHeight}
                        direction='up'
                        align='up'
                        styles={{
                            content: {
                                width: '100%',
                                backgroundColor: 'white',
                                height: '30%',
                            },
                            // backdrop: [{backgroundColor: "#000", opacity: 0.8}],
                        }}
                        cancelable={true}
                        onClosed={(...args) => {
                            if (args[0] === true) {
                                this.setState({
                                    chooseDate: this.date
                                })
                            }

                        }}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <TouchableOpacity
                                onPress={() => {
                                    this._datePicker.close()
                                }}
                                style={{alignItems: 'center', justifyContent: 'center'}}
                                activeOpacity={0.8}>
                                <Text style={{padding: 10}}>取消</Text>
                            </TouchableOpacity>
                            <Text style={{
                                flex: 1,
                                textAlign: 'center',
                                fontSize: size.fontSizeBase,
                                fontWeight: 'bold'
                            }}>请选择日期</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    this._datePicker.close(true);
                                }}
                                style={{alignItems: 'center', justifyContent: 'center'}}
                                activeOpacity={0.8}>
                                <Text style={{padding: 10, color: colors.primary}}>确定</Text>
                            </TouchableOpacity>
                        </View>

                        <Datepicker
                            proportion={[1, 1, 1]}
                            numberOfYears={6}
                            startYear={Number(new Date().getFullYear()) - 5}
                            date={this.state.chooseDate}
                            onChange={(date) => {
                                this.date = date;
                            }}
                        />
                    </SlideModal>
                </View>


            </View>
        );
    }
}

const styles = StyleSheet.create({
    chartBg: {
        backgroundColor: colors.white,
        marginTop: 10,
        marginBottom: 10,
        marginRight: 20,
        marginLeft: 20,
        padding: 10,
        borderRadius: 5
    },
    titleLine: {
        height: '95%',
        width: 5,
        backgroundColor: '#41444B',
        marginRight: 10,
        borderRadius: 5
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 5,
        marginTop: 8
    },
    titleText: {
        fontSize: 20
    },
    titleSubText: {
        fontSize: 16,
        color: '#9A9A9B'
    },
    conversionImage: {
        height: 28,
        width: 28
    }
})


export default withNavigationFocus(Report)
