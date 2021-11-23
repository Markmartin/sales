import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../style/variables'
import {Image} from "react-native-elements"

export default class Conversion extends Component {

    constructor(props) {
        super(props)
        this.props = props;
    }

    render() {
        const conversionIcon = '../assets/images/conversion_arrow.png'
        return (
            <View style={{flexDirection: "row", alignItems: "flex-start", marginTop: this.props.top, flex:1}}>
                <Image style={styles.conversionImage}
                       source={require(conversionIcon)}/>
                <View style={{marginLeft: 10}}>
                    <Text style={{
                        color: "#f00",
                        fontSize: 16
                    }}>{this.props.percent}</Text>
                    <Text style={{color: colors.black, fontSize: 10}}>转化率</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    conversionImage: {
        height: 28,
        width: 28
    }
})
