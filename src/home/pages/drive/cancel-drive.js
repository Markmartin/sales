/**
 * 试乘试驾-取消试驾
 */
import React, {Component} from 'react';
import {Text, ScrollView, View} from 'react-native';
import {Button, Form, Radio} from 'beeshell';
import navigation from '../../../common/services/navigation'
import Icon from "react-native-vector-icons/dist/Feather";
import {ButtonWrapper, Card, CardTitle, CustomerBg} from './driver-detail-style'
import {CancelBox, CancelBoxDesc} from './cancel-driver-style'
import {validate} from "../customers/validator";
import Textarea from "react-native-textarea";
import {inject} from 'mobx-react';
import {colors} from "../../../style/variables"
import {Loading} from "../../../common/components/loading"

@inject(stores => ({
        userStore: stores.userStore,
        dictStore: stores.dictStore,
    })
)
export default class CancelDrive extends Component {
    constructor(props) {
        super(props);
        const {navigation} = this.props;
        const driveId = navigation.getParam('driveId')
        this.dictStore = this.props.dictStore
        this.state = {
            loading: false,
            form: {
                driveId: driveId,
                testDriveStatus: 4,
                cancelReason: '1',
                cancelDetail: ''
            },
            driverInfo: {}
        }
    }

    // 页面加在完成后执行
    componentDidMount() {
    }


    // 表单值变化回调
    handleChange(key, value) {
        let ret
        validate(key, value, (tmp) => {
            ret = tmp
        })
        this.setState(prevState => {
            return {
                form: {
                    ...prevState.form,
                    [key]: value
                },
                validateResults: {...prevState.validateResults, [key]: ret}
            }
        })
        return ret
    }

    // 确认取消
    save() {
        this.setState({loading: true})
        const {form} = this.state
        Loading.show()
        axios.post('/admin/satTestDrive/cancelTestDrive', form)
            .then(({data}) => {
                navigation.navigate('Driver')
            })
            .finally(() => {
                Loading.hidden()
                this.setState({loading: false})
            })
    }

    renderItem(checked, index, label) {

        return (
            <View style={{
                backgroundColor: checked ? colors.white : '#F0F0F0',
                borderWidth: checked ? 0.5 : 0,
                borderRadius: 2,
                height: 30,
                margin: 5,
                paddingLeft: 10,
                paddingRight: 10,
                justifyContent: 'center',
                borderColor: colors.primary,
                alignContent: 'center',
                alignItems: 'center',
            }}>
                <Text style={{color: checked ? colors.primary : colors.black}}>{label}</Text>

            </View>
        )

    }

    render() {
        const {originalData} = this.dictStore
        const {testDriverCancelReason} = originalData
        return (
            <CustomerBg style={{flex: 1, paddingTop: 10}}>
                <ScrollView>
                    <Form>
                        <Card style={{paddingHorizontal: 10, paddingBottom: 15}}>
                            <CardTitle>
                                <Text>取消原因</Text>
                            </CardTitle>
                        </Card>
                        <CancelBox>
                            <Radio
                                style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}
                                uncheckedIcon={<Icon name='circle' size={14}/>}
                                value={this.state.form.cancelReason}
                                onChange={(value) => {
                                    this.handleChange('cancelReason', value)
                                }}>
                                {
                                    testDriverCancelReason.map((item, i) => {
                                        return (<Radio.Item value={item.dictKey}
                                                            key={i}
                                                            renderItem={(checked) => {
                                                                return this.renderItem(checked, i, item.dictValue)
                                                            }}/>)
                                    })
                                }
                            </Radio>
                        </CancelBox>
                        <Card style={{paddingHorizontal: 10, paddingBottom: 15}}>
                            <CardTitle>
                                <Text>详细描述</Text>
                            </CardTitle>
                            <CancelBoxDesc>
                                <Textarea
                                    onChangeText={value => {
                                        this.handleChange('cancelDetail', value)
                                    }}
                                    defaultValue={this.state.form.cancelDetail}
                                    maxLength={50}
                                    placeholder={'请输入'}
                                    placeholderTextColor={'#c7c7c7'}
                                    underlineColorAndroid={'transparent'}
                                />
                            </CancelBoxDesc>
                            <ButtonWrapper>
                                <Button
                                    testID='submit'
                                    type='primary'
                                    disabled={this.state.loading}
                                    onPress={this.save.bind(this)}>
                                    确认取消
                                </Button>
                            </ButtonWrapper>
                        </Card>
                    </Form>
                </ScrollView>
            </CustomerBg>
        )
    }
}
