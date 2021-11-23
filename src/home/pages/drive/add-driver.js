import React, { Component } from 'react'
import { Alert, ScrollView, Text, View } from 'react-native'
import { Button, Form, Input, Radio } from 'beeshell'
import { CluesBg } from './style'
import { ButtonWrapper, FormItemWrapper } from '../../pages/customers/style'
import {
  CRadio,
  DatePicker,
  ErrorMsg,
  RequiredLabel,
  SelectLabel,
  TimePicker,
  VehicleSpectrum
} from '../../../common/components/form'
import { forEach, join, map } from 'lodash'
import { requiredAddTestForm, validateAddTest } from '../drive/validator'
import { Loading } from '../../../common/components/loading'
import variables from 'beeshell/dist/common/styles/variables'

export default class AddDriver extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formData: {
        customerName: '',
        contacterPhoneOne: '',
        audi: '', //车型16码
        catalogId: [],
        planDriveTime: '', //计划开始时间
        planDriveTimeEnd: '', //计划结束时间
        driveStyle: 2,
        driveType: '1',
        memo: '',
        date: '',
        startTime: '',
        endTime: ''
      },
      validateResults: {},
      loading: false
    }
  }

  componentDidMount() {
    const { navigation } = this.props
    this.setState((prevState) => {
      return {
        formData: {
          ...prevState.formData,
          customerName: navigation.getParam('customerName'),
          contacterPhoneOne: navigation.getParam('contacterPhoneOne')
        }
      }
    })
  }

  // 表单值变化回调
  handleChange(key, value) {
    let ret
    validateAddTest(key, value, (tmp) => {
      ret = tmp
    })
    this.setState((prevState) => {
      return {
        formData: {
          ...prevState.formData,
          [key]: value
        },
        validateResults: { ...prevState.validateResults, [key]: ret }
      }
    })
    return ret
  }

  // 组合显示车型
  get renderCar() {
    return join(map(this.state.formData.catalogId, (item) => (item ? item.label : '')), '-')
  }

  save() {
    // 验证数据
    let flag = false
    let requiredData = requiredAddTestForm
    forEach(requiredData, (e) => {
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
    this.setState({ loading: true })
    let audi = ''
    // let carModel = this.state.formData.catalogId[1]
    let carModel = this.state.formData.catalogId[2]
    if (carModel !== undefined) {
      audi = carModel.value
    }

    let { formData } = this.state
    const date = formData.date ? formData.date : moment().format('YYYY-MM-DD')
    const startTime = formData.startTime ? `${formData.startTime}:00` : moment().format('HH:mm:ss')
    const endTime = formData.endTime ? `${formData.endTime}:00` : moment().format('HH:mm:ss')
    formData.planDriveTime = `${date} ${startTime}`
    formData.planDriveTimeEnd = `${date} ${endTime}`

    const eventId = this.props.navigation.getParam('eventId')
    let data = {
      ...this.state.formData,
      audi,
      createType: 1,
      eventId: eventId
    }

    Loading.show()
    axios
      .post('/admin/satTestDrive/save', data)
      .then(({ data }) => {
        Loading.hidden()
        Alert.alert('提示', '本次信息保存成功.')
        this.props.navigation.goBack()
      })
      .finally(() => this.setState({ loading: false }))
  }

  render() {
    const { formData } = this.state
    const disabled = false
    const eventRemark = this.props.navigation.getParam('eventRemark')
    return (
      <CluesBg>
        <ScrollView>
          <Form style={{ backgroundColor: 'transparent' }}>
            <FormItemWrapper>
              <Form.Item style={{ paddingVertical: 13 }} label={<RequiredLabel labelName="姓名" />} hasLine>
                <Input
                  testID="customerName"
                  value={formData.customerName}
                  textAlign="right"
                  onChange={(value) => {
                    this.handleChange('customerName', value)
                  }}
                />
                <ErrorMsg validateResults={this.state.validateResults} name="customerName" />
              </Form.Item>
              <Form.Item style={{ paddingVertical: 13 }} label={<RequiredLabel labelName="电话" />} hasLine>
                <Input
                  testID="contacterPhoneOne"
                  value={formData.contacterPhoneOne}
                  textAlign="right"
                  onChange={(value) => {
                    this.handleChange('contacterPhoneOne', value)
                  }}
                />
                <ErrorMsg validateResults={this.state.validateResults} name="contacterPhoneOne" />
              </Form.Item>
              <Form.Item style={{ paddingVertical: 13 }} label={<RequiredLabel labelName="试驾车型" />} hasLine>
                <SelectLabel data={this.renderCar} onPress={() => this.VehicleSpectrum.open()} />
                <ErrorMsg validateResults={this.state.validateResults} name="catalogId" />
              </Form.Item>
              <Form.Item style={{ paddingVertical: 13 }} label={<RequiredLabel labelName="试驾日期" />} hasLine>
                <SelectLabel data={formData.date} onPress={() => this.datePicker.open()} />

                <ErrorMsg validateResults={this.state.validateResults} name="date" />
              </Form.Item>

              <Form.Item style={{ paddingVertical: 13 }} label={<RequiredLabel labelName="开始时间" />} hasLine>
                <SelectLabel
                  data={formData.startTime}
                  onPress={() => {
                    this.timeType = 0 //开始时间
                    this.TimePicker.open()
                  }}
                />
                <ErrorMsg validateResults={this.state.validateResults} name="startTime" />
              </Form.Item>

              <Form.Item style={{ paddingVertical: 13 }} label={<RequiredLabel labelName="结束时间" />} hasLine>
                <SelectLabel
                  data={formData.endTime}
                  onPress={() => {
                    this.timeType = 1 //结束时间
                    this.TimePicker.open()
                  }}
                />
                <ErrorMsg validateResults={this.state.validateResults} name="endTime" />
              </Form.Item>

              <Form.Item style={{ paddingVertical: 0 }} label={<RequiredLabel labelName="试驾方式" />} hasLine>
                <CRadio
                  value={formData.driveStyle}
                  disabled={disabled}
                  onChange={(value) => {
                    this.handleChange('driveStyle', value)
                  }}>
                  <Radio.Item label="到店试驾" value={2} disabled={disabled} />
                  <Radio.Item label="上门试驾" style={{ marginLeft: 30 }} value={1} disabled={disabled} />
                </CRadio>
                <ErrorMsg validateResults={this.state.validateResults} name="driveStyle" />
              </Form.Item>
              <Form.Item style={{ paddingVertical: 0 }} label={<RequiredLabel labelName="试驾类型" />}>
                <CRadio
                  value={formData.driveType}
                  disabled={disabled}
                  onChange={(value) => {
                    this.handleChange('driveType', value)
                  }}>
                  <Radio.Item label="本人试驾" style={{ marginRight: 30 }} value={'1'} disabled={disabled} />
                  <Radio.Item label="家人试驾" value={'2'} disabled={disabled} />
                </CRadio>
                <ErrorMsg validateResults={this.state.validateResults} name="driveType" />
              </Form.Item>
            </FormItemWrapper>
            {/*<View style={{height: 10, backgroundColor:colors.grey5}}/>*/}
            {!eventRemark || eventRemark === '' ? null : (
              <FormItemWrapper>
                <Form.Item style={{ paddingVertical: 10 }} label={'备注'}>
                  <View />
                  <Text style={{ color: variables.mtdGray, marginTop: 10 }}>{eventRemark}</Text>
                </Form.Item>
              </FormItemWrapper>
            )}
          </Form>
          <ButtonWrapper>
            <Button
              style={{ marginTop: 20 }}
              testID="submit"
              type="primary"
              disabled={disabled || this.state.loading}
              onPress={this.save.bind(this)}>
              保存
            </Button>
          </ButtonWrapper>
        </ScrollView>

        <VehicleSpectrum
          ref={(c) => (this.VehicleSpectrum = c)}
          rightCallback={(value) => {
            this.handleChange('catalogId', value)
          }}
        />

        <DatePicker
          ref={(c) => (this.datePicker = c)}
          numberOfYears={1}
          rightCallback={(value) => this.handleChange('date', value)}
        />

        <TimePicker
          ref={(c) => (this.TimePicker = c)}
          showTime="HH:mm"
          startTime="09:00"
          endTime="19:00"
          rightCallback={(value) => {
            let key
            if (this.timeType === 0) {
              key = 'startTime'
            } else if (this.timeType === 1) {
              key = 'endTime'
            }
            this.handleChange(key, value)
          }}
        />
      </CluesBg>
    )
  }
}
