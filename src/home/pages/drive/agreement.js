import React, {Component} from 'react';
import {Text,View, StyleSheet,ScrollView} from 'react-native';
import {Image} from "react-native-elements";
import { Radio, Input, Button } from 'beeshell';
import {colors} from "../../../style/variables";

import {NewsWrapper, CardWrapper, InvitationType, InvitationItem, InvitationItemLabel, InvitationItemValue, InvitationImage,InvitationImageBox} from "./style";
import {ButtonWrapper} from "../../../login/style";

export default class Agreement extends Component {
    constructor (props) {
        super(props);
        this.state = {
            methods: '',
            radio: 1,
            radio1: 1,
            radio2: 1,
            input: '试驾很舒服~~~就是不想买~~~'
        }
    }
    componentDidMount() {
        const { navigation } = this.props;
        const methods = navigation.getParam('methods');
        this.setState({methods})

        this.submitHandle = this.submitHandle.bind(this)
    }
    submitHandle () {
        alert('提交完啦')
    }
    render () {
        return (
            <ScrollView>
                <NewsWrapper>
                    <CardWrapper>
                        <InvitationType>
                            <Text>{this.state.methods}</Text>
                        </InvitationType>
                        <InvitationItem>
                            <InvitationItemLabel><Text>客户电话：</Text></InvitationItemLabel>
                            <InvitationItemValue><Text>1593369965</Text></InvitationItemValue>
                        </InvitationItem>
                        <InvitationItem>
                            <InvitationItemLabel><Text>客户姓名：</Text></InvitationItemLabel>
                            <InvitationItemValue><Text>王先生</Text></InvitationItemValue>
                        </InvitationItem>
                        <InvitationItem>
                            <InvitationItemLabel><Text>试驾时间：</Text></InvitationItemLabel>
                            <InvitationItemValue><Text>2019-12-31 22:22:22</Text></InvitationItemValue>
                        </InvitationItem>
                        <InvitationItem>
                            <InvitationItemLabel><Text>试驾车系：</Text></InvitationItemLabel>
                            <InvitationItemValue><Text>U</Text></InvitationItemValue>
                        </InvitationItem>
                        <InvitationItem>
                            <InvitationItemLabel><Text>试驾路线：</Text></InvitationItemLabel>
                            <InvitationItemValue><Text>路线一</Text></InvitationItemValue>
                        </InvitationItem>
                        <InvitationItem>
                            <InvitationItemLabel><Text>备注：</Text></InvitationItemLabel>
                            <InvitationItemValue><Text>备注备注备注备注备注备注备注备注</Text></InvitationItemValue>
                        </InvitationItem>
                        <InvitationItem>
                            <InvitationItemLabel><Text>试驾专家描述：</Text></InvitationItemLabel>
                            <InvitationItemValue><Text>备注备注备注备注备注备注备注备注</Text></InvitationItemValue>
                        </InvitationItem>
                        <InvitationItem>
                            <InvitationItemLabel><Text>试驾方式：</Text></InvitationItemLabel>
                            <InvitationItemValue>
                                <Radio
                                    style={styles.radio}
                                    value={this.state.radio}
                                    onChange={(value) => {
                                        this.setState({
                                            radio: value
                                        })
                                    }}
                                    checkedIcon={false}
                                    uncheckedIcon={false}>
                                    <Radio.Item label='上门试驾' value={1} />
                                    <Radio.Item label='到店试驾' value={2} />
                                </Radio>
                            </InvitationItemValue>
                        </InvitationItem>
                        <InvitationItem>
                            <InvitationItemLabel><Text>试驾类型：</Text></InvitationItemLabel>
                            <InvitationItemValue>
                                <Radio
                                    style={styles.radio}
                                    value={this.state.radio1}
                                    onChange={(value) => {
                                        this.setState({
                                            radio1: value
                                        })
                                    }}
                                    checkedIcon={false}
                                    uncheckedIcon={false}>
                                    <Radio.Item label='本人试驾' value={1} />
                                    <Radio.Item label='他人试驾' value={2} />
                                </Radio>
                            </InvitationItemValue>
                        </InvitationItem>
                        <InvitationItem>
                            <InvitationItemLabel><Text>证件类型：</Text></InvitationItemLabel>
                            <InvitationItemValue>
                                <Radio
                                    style={styles.radio}
                                    value={this.state.radio2}
                                    onChange={(value) => {
                                        this.setState({
                                            radio2: value
                                        })
                                    }}
                                    checkedIcon={false}
                                    uncheckedIcon={false}>
                                    <Radio.Item label='身份证' value={1} />
                                    <Radio.Item label='驾驶证' value={2} />
                                </Radio>
                            </InvitationItemValue>
                        </InvitationItem>
                        <InvitationItem>
                            <InvitationImageBox>
                                <InvitationImage>
                                    <Image source={require('../../../assets/images/ic_next.png')} style={{width:150,height:150,backgroundColor: '#cccccc'}}/>
                                    <Text style={styles.text}>证件拍照</Text>
                                </InvitationImage>
                                <InvitationImage>
                                    <Image source={require('../../../assets/images/ic_next.png')} style={{width:150,height:150,backgroundColor: '#cccccc'}}/>
                                    <Text style={styles.text}>证件拍照</Text>
                                </InvitationImage>
                            </InvitationImageBox>
                        </InvitationItem>
                        <InvitationItem>
                            <Text>已经认真阅读《试驾车使用规范协议》</Text>
                        </InvitationItem>
                        <InvitationItem>
                            <InvitationItemLabel><Text>试驾评价：</Text></InvitationItemLabel>
                            <View/>
                            <Input testID='input' value={this.state.input}
                                   onChange={(value) => {
                                       this.setState({
                                           input: value
                                       })
                                   }}/>
                        </InvitationItem>
                        <Button
                            testID='submit'
                            type='primary'
                            onPress={this.submitHandle}>
                            保存并下一步
                        </Button>
                    </CardWrapper>
                </NewsWrapper>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    radio: {
        display: 'flex',
        flexDirection: 'row',
        margin: 0,
        padding: 0,
        textAlignVertical: 'center',
        paddingVertical: 0
    },
    radioItem: {
        paddingRight: 20,
        paddingLeft: 20,
        marginRight: 5,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderTopColor: colors.primary,
        borderRightColor: colors.primary,
        borderBottomColor: colors.primary,
        borderLeftColor: colors.primary,
        borderRadius: 20,
        textAlignVertical: 'center',
        paddingVertical: 0
    },
    text: {
        textAlign: 'center'
    }
})