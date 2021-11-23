import React, {Component} from 'react'
import {RowContentView} from "./style";
import {StyleSheet, Text} from "react-native";
import {size} from "../../../style/variables";


export default class LineView extends Component {
    constructor(props) {
        super(props);

        // 绑定
        this.filterNullString = this.filterNullString.bind(this);
    }
    // 对所有取用的字段，做非空校验
    filterNullString(content) {
        return (content == null || content === 'undefined' ? '' : content);
    }
    render() {
        return(
            <RowContentView>
                <Text style={[styles.lineTitleStyle, {alignSelf: 'flex-start'}]}>{this.props.title}</Text>
                <Text style={[styles.lineContentStyle, {flex: 1}]}>{this.filterNullString(this.props.content)}</Text>
            </RowContentView>
        )
    }
}

const styles = StyleSheet.create({
    lineTitleStyle:{
        fontSize: size.fontSizeBase,
        color: '#323233',
        width: 115,
        marginLeft: 16,
        marginTop: 16
    },
    lineContentStyle:{
        fontSize: size.fontSizeBase,
        color: '#323233',
        width: 115,
        marginTop: 16
    }
})
