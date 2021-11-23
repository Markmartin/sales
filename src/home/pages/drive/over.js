import React, {Component} from 'react';
import {Text, View, StyleSheet, ScrollView, Image} from 'react-native';
import {Button, Form, Actionsheet, Tip} from 'beeshell';
import navigation from "../../../common/services/navigation";
import {CluesBg} from './style'
import {colors} from "../../../style/variables";
import Textarea from 'react-native-textarea';
import {Content, InfoItem, Line, StepsBox, StepsBoxItem, StepsBoxItemText, StepsBoxItemTitle} from "../delivery/styles";
import Icon from "react-native-vector-icons/dist/Feather";

export default class DriveOver extends Component {
    constructor(props) {
        super(props)
        this.state = {
            driveInfo: '',
            driveId: '',
            loading: false
        }
        this.onChange = this.onChange.bind(this)
        this.saveHandle = this.saveHandle.bind(this)
    }
    componentDidMount() {
        const { navigation } = this.props;
        let driveId = navigation.getParam('driveId')
        this.setState({
            driveId: driveId
        })
    }
    componentDidUpdate() {
    }
    onChange(value) {
        this.setState({
            driveInfo: value
        })
    }
    saveHandle() {
        this.setState({loading:true})
        axios.post('/admin/satTestDrive/complete', this.state)
            .then(({data}) => {
                navigation.navigate('Success', {type: '1'})
            })
            .finally(()=>this.setState({loading:false}))
    }
    render() {
        return (
            <CluesBg>
                <ScrollView>
                    <StepsBox>
                        <StepsBoxItem>
                            <View style={styles.StepsBoxItem}>
                                <StepsBoxItemText>
                                    <Icon name='check' size={16} style={{alignSelf: 'center',paddingTop: 2}} color='white'></Icon>
                                </StepsBoxItemText>
                            </View>
                            <View>
                                <StepsBoxItemTitle>确认信息</StepsBoxItemTitle>
                            </View>
                        </StepsBoxItem>
                        <Line style={{backgroundColor: colors.primary}}></Line>
                        <StepsBoxItem>
                            <View style={styles.StepsBoxItem}>
                                <StepsBoxItemText><Text style={{alignSelf: 'center', color: 'white', paddingTop: 1}}>2</Text></StepsBoxItemText>
                            </View>
                            <View>
                                <StepsBoxItemTitle>试驾感知</StepsBoxItemTitle>
                            </View>
                        </StepsBoxItem>
                    </StepsBox>
                    <Content style={styles.content}>
                        <InfoItem style={{borderBottomWidth: 1, borderBottomColor: colors.grey5}}>
                            <Text>试驾描述</Text>
                        </InfoItem>
                        <Textarea
                            onChangeText={this.onChange}
                            defaultValue={this.state.driveInfo}
                            maxLength={50}
                            placeholder={'请输入试驾描述'}
                            placeholderTextColor={'#c7c7c7'}
                            underlineColorAndroid={'transparent'}
                        />
                    </Content>
                    <View style={{paddingLeft: 16, paddingRight: 16, marginTop: 36, marginBottom: 20}}>
                        <Button
                            testID='submit'
                            type='primary'
                            disabled={this.state.loading}
                            onPress={this.saveHandle}>
                            保存并提交
                        </Button>
                    </View>
                </ScrollView>
            </CluesBg>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        backgroundColor: 'white',
        paddingTop: 17,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 17,
        marginLeft: 16,
        marginRight: 16,
        borderRadius: 4,
        overflow: 'hidden'
    },
    textArea: {
        backgroundColor: 'white',
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 17
    },
    StepsBoxItem: {paddingLeft: 22,paddingBottom: 10}
});
