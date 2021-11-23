/**
 * 办理试驾
 */
import React, {Component} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Button, Form, Radio} from 'beeshell';
import {ButtonWrapper, Card, CardTitle, CustomerBg, FollowUpListText, FormItemWrapper} from "./driver-detail-style";
import {
    CRadio,
    DatePicker,
    ErrorMsg,
    RequiredLabel,
    SelectLabel,
    TimePicker,
    VehicleSpectrum,
} from '../../../common/components/form'
import {colors} from "../../../style/variables";
import {forEach, join, map} from "lodash"
import {requiredHandleTestForm, validateHandleTest} from '../drive/validator'
import Textarea from "react-native-textarea";
import {Loading} from '../../../common/components/loading'
import Vehicle from '../../../common/services/vehicle'
import {CancelBoxDesc} from "./cancel-driver-style";
import DriverRouters from "./form/driver-router";
import variables from "../../../style/beeshell";
import ImagePickerCamera from '../../../common/components/image-picker-camera'


export default class HandleTest extends Component {

    //自定义导航栏右侧文字以及点击事件
    static navigationOptions = ({navigation, screenProps}) => ({
        headerRight: <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.state.params.navigatePress()}>
            <Text style={{color: colors.white, marginRight: 15}}
            >取消试驾</Text>
        </TouchableOpacity>
    })

    constructor(props) {
        super(props)
        this.vehicle = Vehicle.getInstance()
        const {navigation} = this.props;
        const driveId = navigation.getParam('driveId')
        this.state = {
            formData: {
                driveTime: '',
                catalogId: [],
                driveStyle: '',
                driveType: '',
                certType: '',
                phone: '',
                testDriveRouteId: '',
                driveInfo: '',
                date: '',
                startTime: '',
                endTime: '',
                agreementPicPath: '',//试驾协议照片地址
                certPicFront: '',//证件正面
                beginDriveTime: '', //实际试驾开始时间
                completeDriveTime: '', //实际试驾结束时间
                planDriveTime: '', //计划试驾开始时间
                planDriveTimeEnd: '' //计划试驾结束时间
            },
            formContext: {},
            value: '1',
            roadList: [],
            loading: false,
            driveId: driveId,
            driveRouteName: '试驾路线',
            driveRouteIndex: 1,
            validateResults: {},
        }
    }

    loadInfo() {
        Loading.show();
        const {navigation} = this.props
        const driveId = navigation.getParam('driveId')
        axios.get('/admin/satTestDrive/load', {params: {driveId}}).then(res => {
            //设置时间值回显
            const date = res.data.planDriveTime ? moment(res.data.planDriveTime).format('YYYY-MM-DD') : ''
            const startTime = res.data.planDriveTime ? moment(res.data.planDriveTime).format('HH:mm') : ''
            const endTime = res.data.planDriveTimeEnd ? moment(res.data.planDriveTimeEnd).format('HH:mm') : ''

            //试驾类型
            const driveType = res.data.driveType ? res.data.driveType : '1'

            //试驾方式
            const driveStyle = res.data.driveStyle ? res.data.driveStyle : 2

            //证件类型
            const certType = res.data.certType ? res.data.certType : '5'

            //电话号码
            const phone = res.data.contacterPhoneOne?res.data.contacterPhoneOne:res.data.phone

            this.setState({
                formData: {...res.data, startTime, endTime, date, driveType, driveStyle, certType, phone}
            })
            if (res.data.audi !== '') {
                this.vehicle.getNodes(res.data.audi)
                    .then(({listMap}) => {
                        let catalogId = listMap
                        this.setState(prevState => {
                            return {
                                formData: {
                                    ...prevState.formData,
                                    catalogId
                                }
                            }
                        })
                        // 设置型谱回显
                        this.VehicleSpectrum.setDefault(listMap)
                        // 设置路线回显
                        if (res.data.testDriveRouteId) {
                            this.DriverRouters.setDefault(res.data.testDriveRouteId)
                            this.state.formData.testDriveRouteId = res.data.testDriveRouteId
                        }
                    })
            }
        }).finally(() => Loading.hidden())

    }

    componentWillMount() {
        this.loadInfo()
        this.getPhoto()
    }

    componentDidMount() {
        this.props.navigation.setParams({navigatePress: this.onPressCancelDrive});
    }

    getPhoto() {
        axios.get('/admin/satTestDriveRoute/list',).then(res => {
            this.setState({
                roadList: res.data
            })
        })
    }

    // 组合显示车型
    get renderCar() {
        return join(map(this.state.formData.catalogId, item => item ? item.label : ''), '-')
    }

    // 表单值变化回调
    handleChange(key, value) {
        console.log(value)
        let ret
        validateHandleTest(key, value, (tmp) => {
            ret = tmp
        })
        this.setState(prevState => {
            return {
                formData: {
                    ...prevState.formData,
                    [key]: value
                },
                validateResults: {...prevState.validateResults, [key]: ret}
            }
        })
        return ret
    }


    onPressCancelDrive = () => {
        const {navigation} = this.props;
        navigation.navigate('CancelDrive', {driveId: navigation.getParam('driveId')})
    }

    // 保存
    save() {

        let flag = false
        forEach(requiredHandleTestForm, e => {
            let result = this.state.validateResults[e]
            // validateResults 不存在，则是未改变
            if (!result) {
                result = this.handleChange(e, this.state.formData[e])
            }
            // 存在且valid 为false 返回
            if (result && !result.valid) {
                flag = true
            }
        })
        if (flag) return

        let {formData} = this.state

        //组合时间参数
        const date = formData.date ? formData.date : moment(formData.planDriveTime).format('YYYY-MM-DD')
        const startTime = formData.startTime ? `${formData.startTime}:00` : moment(formData.planDriveTime).format('HH:mm')
        const endTime = formData.endTime ? `${formData.endTime}:00` : moment(formData.planDriveTimeEnd).format('HH:mm')
        formData.beginDriveTime = `${date} ${startTime}`
        formData.completeDriveTime = `${date} ${endTime}`

        //取出选中车型的型谱码
        let audi = ''
        let carModel = this.state.formData.catalogId[2];
        if (carModel !== undefined) {
            audi = carModel.value;
        }

        let data = {
            ...this.state.formData,
            audi
        }

        this.setState({loading: true})

        Loading.show()
        axios.post('/admin/satTestDrive/complete', data)
            .then(() => {
                // navigation.navigate('Success', {type: '1'})
                this.props.navigation.goBack()
            })
            .finally(() => {
                Loading.hidden()
                this.setState({loading: false})
            })
    }

    render() {
        const {formData} = this.state
        const disabled = false
        const date = formData.date ? formData.date : formData.planDriveTime ? moment(formData.planDriveTime).format('YYYY-MM-DD') : ''
        const startTime = formData.startTime ? formData.startTime : formData.planDriveTime ? moment(formData.planDriveTime).format('HH:mm') : ''
        const endTime = formData.endTime ? formData.endTime : formData.planDriveTimeEnd ? moment(formData.planDriveTimeEnd).format('HH:mm') : ''
        const driveType = formData.driveType ? formData.driveType : '1'
        const driveStyle = formData.driveStyle ? formData.driveStyle : 2
        const certType = formData.certType ? formData.certType : '5'
        return (
            <CustomerBg style={{flex: 1, paddingTop: 10}}>
                <ScrollView>
                    <Card>
                        <Form>
                            <FormItemWrapper>
                                <Form.Item style={{paddingVertical: 22}} label='客户电话' hasLine>
                                    <View
                                        style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                                        <FollowUpListText>{formData.phone}</FollowUpListText>
                                    </View>
                                </Form.Item>
                                <Form.Item style={{paddingVertical: 22}} label='客户姓名' hasLine>
                                    <View
                                        style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                                        <FollowUpListText>{formData.customerName}</FollowUpListText>
                                    </View>
                                </Form.Item>
                                <Form.Item style={{paddingVertical: 13}} label={<RequiredLabel labelName="试驾日期"/>}
                                           hasLine>
                                    <SelectLabel
                                        data={date}
                                        onPress={() => this.DatePicker.open()}/>
                                    <ErrorMsg validateResults={this.state.validateResults} name='date'/>
                                </Form.Item>
                                <Form.Item style={{paddingVertical: 13}} label={<RequiredLabel labelName="开始时间"/>}
                                           hasLine>
                                    <SelectLabel
                                        data={startTime}
                                        onPress={() => {
                                            this.timeType = 0
                                            this.TimePicker.open()
                                        }}/>
                                    <ErrorMsg validateResults={this.state.validateResults} name='startTime'/>
                                </Form.Item>

                                <Form.Item style={{paddingVertical: 13}} label={<RequiredLabel labelName="结束时间"/>}
                                           hasLine>
                                    <SelectLabel
                                        data={endTime}
                                        onPress={() => {
                                            this.timeType = 1
                                            this.TimePicker.open()
                                        }}/>
                                    <ErrorMsg validateResults={this.state.validateResults} name='endTime'/>
                                </Form.Item>
                                <Form.Item style={{paddingVertical: 13}} label={<RequiredLabel labelName="试驾车系"/>}
                                           hasLine>
                                    <SelectLabel data={this.renderCar}
                                                 onPress={() => this.VehicleSpectrum.open()}/>
                                    <ErrorMsg validateResults={this.state.validateResults} name='catalogId'/>
                                </Form.Item>
                                <Form.Item style={{paddingVertical: 22}} label={'试驾路线'}>
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center'
                                        }}>
                                        <Text style={{
                                            color: variables.mtdGray
                                        }}>{this.state.driveRouteIndex}/{this.state.driveRouteTotal}</Text>
                                    </View>
                                </Form.Item>
                                <DriverRouters
                                    showTitle={false}
                                    editable={true}
                                    ref={c => this.DriverRouters = c}
                                    callback={(index, route) => {
                                        this.setState({
                                            driveRouteIndex: index + 1,
                                            driveRouteTotal: this.DriverRouters.getTotal(),
                                            driveRouteName: route.routeName
                                        })

                                        this.handleChange('testDriveRouteId', route.testDriveRouteId)
                                    }
                                    }
                                />
                                <Form.Item style={{paddingVertical: 10}} label={null} hasLine/>
                                <Form.Item style={{paddingVertical: 0}} label='试驾方式' hasLine>
                                    <CRadio
                                        value={driveStyle}
                                        disabled={disabled}
                                        onChange={(value) => {
                                            this.handleChange('driveStyle', value)
                                        }}>
                                        <Radio.Item label='到店试驾' value={2} disabled={disabled}/>
                                        <Radio.Item label='上门试驾' style={{marginLeft: 30}} value={1}
                                                    disabled={disabled}/>
                                    </CRadio>
                                </Form.Item>
                                <Form.Item style={{paddingVertical: 0}} label="试驾类型"
                                           hasLine>
                                    <CRadio
                                        value={driveType}
                                        disabled={disabled}
                                        onChange={(value) => {
                                            this.handleChange('driveType', value)
                                        }}>
                                        <Radio.Item label='本人试驾' style={{marginRight: 30}} value={'1'}
                                                    disabled={disabled}/>
                                        <Radio.Item label='家人试驾' value={'2'} disabled={disabled}/>
                                    </CRadio>
                                    <ErrorMsg validateResults={this.state.validateResults} name='driveType'/>
                                </Form.Item>
                                <Form.Item style={{paddingVertical: 0}} label="证件类型"
                                           hasLine>
                                    <CRadio
                                        value={certType}
                                        disabled={disabled}
                                        onChange={(value) => {
                                            this.handleChange('certType', value)
                                        }}>
                                        <Radio.Item label='身份证' style={{marginRight: 30}} value={'1'}
                                                    disabled={disabled}/>
                                        <Radio.Item label='驾驶证' value={'5'} disabled={disabled}/>
                                    </CRadio>
                                    <ErrorMsg validateResults={this.state.validateResults} name='certType'/>
                                </Form.Item>
                            </FormItemWrapper>
                            <FormItemWrapper>

                                <Form.Item style={{paddingVertical: 13}}
                                           label={<RequiredLabel labelName="上传附件"/>}
                                           hasLine>
                                    <View/>
                                    <View style={{flexDirection: 'row', marginTop: 10}}>
                                        <View>
                                            <ImagePickerCamera
                                                description={'证件拍照'}
                                                callBack={value => this.handleChange('certPicFront', value)}/>
                                            <ErrorMsg style={{textAlign: 'center'}}
                                                      validateResults={this.state.validateResults} name='certPicFront'/>
                                        </View>
                                        <View style={{width: 20}}/>
                                        <View>
                                            <ImagePickerCamera
                                                description={'试驾协议'}
                                                callBack={value => this.handleChange('agreementPicPath', value)}/>
                                            <ErrorMsg style={{textAlign: 'center'}}
                                                      validateResults={this.state.validateResults}
                                                      name='agreementPicPath'/>
                                        </View>
                                    </View>

                                </Form.Item>
                            </FormItemWrapper>

                            <CardTitle>
                                <FollowUpListText>试驾感受</FollowUpListText>
                            </CardTitle>
                            <CancelBoxDesc>
                               <Textarea
                                   onChangeText={value => {
                                       this.handleChange('driveInfo', value)
                                   }}
                                   defaultValue={this.state.formData.driveInfo}
                                   maxLength={50}
                                   placeholder={'请输入'}
                                   placeholderTextColor={'#c7c7c7'}
                                   underlineColorAndroid={'transparent'}
                               />
                            </CancelBoxDesc>

                        </Form>
                    </Card>

                    <ButtonWrapper>
                        <Button
                            style={{marginBottom: 30, marginTop: 20}}
                            testID='submit'
                            type='primary'
                            disabled={this.state.loading}
                            onPress={this.save.bind(this)}>
                            保存
                        </Button>
                    </ButtonWrapper>
                    <VehicleSpectrum ref={c => this.VehicleSpectrum = c}
                                     rightCallback={value => {
                                         this.handleChange('catalogId', value)
                                     }}/>
                    <DatePicker ref={c => this.DatePicker = c}
                                numberOfYears={2}
                                rightCallback={value => {
                                    this.handleChange('date', value)
                                }}/>
                    <TimePicker ref={c => this.TimePicker = c}
                                showTime='HH:mm'
                                startTime='09:00'
                                endTime='19:00'
                                rightCallback={value => {
                                    let key
                                    if (this.timeType === 0) {
                                        key = 'startTime'
                                    } else if (this.timeType === 1) {
                                        key = 'endTime'
                                    }
                                    this.handleChange(key, value)
                                }}/>
                </ScrollView>
            </CustomerBg>
        )
    }
}

