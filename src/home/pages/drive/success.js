import React, {Component} from 'react';
import {Text, View, StyleSheet,ScrollView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/dist/Feather';
import navigation from "../../../common/services/navigation";
import {colors, size} from "../../../style/variables";

export default class Success extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: (
                <Icon
                    onPress={navigation.getParam('show')}
                    name='x'
                    size={24}
                    color='#F5FBFF' light/>
            )
        };
    };
    constructor(props) {
        super(props)
        this.state = {
            type: ''
        }
    }
    goBack = () => {
        navigation.navigate('Home')
    };
    componentDidMount() {
        this.props.navigation.setParams({ show: this.goBack });
        const { navigation } = this.props;
        let type = navigation.getParam('type')
        this.setState({type: type})
    }
    render() {
        return (
            <View style={{flex: 1}}>
                <ScrollView>
                    <View style={styles.checkBox}>
                        <Icon name='check' size={30} color='#ffffff' style={{textAlign: 'center'}}></Icon>
                    </View>
                    <View>
                        <Text style={styles.textH1}>{this.state.type != '1' ? '试驾签订完成' : '试驾完成'}</Text>
                    </View>
                    <View>
                        <Text style={styles.textH2}>{this.state.type != '1' ? '试驾协议已经签订完成，可以进行试驾'
                        : '恭喜您，已带领客户完成试驾，请通知品鉴顾问继续进行跟进' }</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('Home')
                            }}>
                            <View style={styles.btn}>
                                <Text style={{textAlign:'center',color: colors.primary,fontSize: 16}}>返回首页</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('Driver')
                            }}>
                            <View style={styles.btn}>
                                <Text style={{textAlign:'center',color: colors.primary,fontSize: 16}}>试驾管理</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    checkBox: {
        width: 53,
        height: 53,
        marginTop: 35,
        marginBottom: 28,
        backgroundColor: colors.primary,
        borderRadius: 30,
        alignSelf: 'center',
        textAlignVertical: 'center',
        justifyContent: 'center'
    },
    textH1: {
        fontSize: 20,
        fontWeight: size.fontWeightBold,
        alignSelf: 'center'
    },
    textH2: {
        fontSize: 15,
        alignSelf: 'center',
        paddingTop: 20,
        paddingBottom: 32
    },
    btn: {
        width: 114,
        height: 40,
        borderTopColor: colors.primary,
        borderBottomColor: colors.primary,
        borderLeftColor: colors.primary,
        borderRightColor: colors.primary,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        marginLeft: 8,
        marginRight: 8
    }
});
