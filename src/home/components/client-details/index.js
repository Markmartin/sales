import React, {Component} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {colors} from "../../../style/variables";
import ImagePickerCamera from '../../../common/components/image-picker-camera'
export default class ClientDetails extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let img = (item) => {
            return(
                <View style={styles.imgBox} key={item.label}>
                    <View style={{justifyContent:'center'}}>
                        <Text style={styles.txt}>{item.label}</Text>
                    </View>
                    <ImagePickerCamera description={'拍照上传附件'} callBack={value => {}}/>
                </View>
            )
        }
        let text = (item) => {
            return (
                <Text style={{paddingBottom: 16}} key={item.label}>
                    <Text style={styles.txt}>{item.label}</Text>
                    <Text style={{marginLeft: 8},styles.txt}> {this.props.filterHandel(item)}</Text>
                </Text>
            )
        }
        return (
            <View style={{backgroundColor: '#fff', borderRadius: 4}}>
                <View style={styles.cont}>
                    {
                        this.props.dataForm.map(item => (
                        item.key === 'contractImgPath' ? img(item) : text(item)
                        ))
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    imgBox: {
        width: 100,
        height: 133,
        flexDirection: 'row'
    },

    cont: {
        padding: 16
    },
    txt: {
        color: colors.grey0,
    }
})
