import React, {Component} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {colors} from "../../../style/variables";

export default class Treaty extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: ''
        }
        this.getLoad = this.getLoad.bind(this)
    }
    componentDidMount() {
        const { navigation } = this.props;
        // let handleId = navigation.getParam('id')
        this.getLoad()
    }
    getLoad () {
        return axios.get('/admin/satTestDrive/aggreeMent')
            .then(({data}) => {
                this.setState(() => {
                    return {
                        data: data
                    }
                })
            })
    }
    render() {
        return (
            <View style={{flex: 1, backgroundColor: colors.background, paddingBottom: 10}}>
                <ScrollView contentContainerStyle={{padding: 0, margin: 0, flex: 1}}>
                    <View style={{backgroundColor: '#ffffff', marginTop: 10, marginRight: 16, marginLeft: 16,paddingTop: 10,paddingLeft: 10,paddingRight: 10,paddingBottom: 10, flex: 1}}>
                        <Text style={{flex: 1}}>{this.state.data}</Text>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
