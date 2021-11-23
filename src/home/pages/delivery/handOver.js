import React, {Component} from 'react';
import {Text, View, StyleSheet,ScrollView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/dist/Feather';
import navigation from "../../../common/services/navigation";
import {colors, size} from "../../../style/variables";

export default class Handle extends Component {
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
        }
    }
    goBack = () => {
        navigation.navigate('Home')
    };
    componentDidMount() {
        this.props.navigation.setParams({ show: this.goBack });
    }
    render() {
        return (
            <View style={{flex: 1}}>
                <ScrollView>
                    <View style={styles.checkBox}>
                        <Icon name='check' size={30} color='#ffffff' style={{textAlign: 'center'}}></Icon>
                    </View>
                    <View>
                        <Text style={styles.textH1}>交接车辆成功</Text>
                    </View>
                    <View>
                        <Text style={styles.textH2}>恭喜您，交接车辆已经完成！</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Home')
                        }}>
                        <View style={styles.btn}>
                            <Text style={{textAlign:'center',color: colors.primary,fontSize: 16}}>返回首页</Text>
                        </View>
                    </TouchableOpacity>
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
        borderRadius: 2
    }
});
