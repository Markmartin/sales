import React from "react";

import {Text, View, SafeAreaView} from 'react-native';
import { BottomModal, Scrollpicker,Datepicker } from 'beeshell';

import moment from 'moment'



class TroubleTime extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            temDate:'',
        }
    }
    
    // 打开modal
	open() {
		return this.faultDateModal.open()
	}
    renderSafeArea() {
		return (
			<View style={{maxHeight: 30}}>
				<SafeAreaView style={{flex: 1}}>
					<View style={{height: 30}}/>
				</SafeAreaView>
			</View>
		)
	}
    render() {
        return (
            <View>
            <BottomModal
              title='试驾时间'
              ref={c => this.faultDateModal = c}
              cancelable={true}
              rightCallback={() => {
                if(this.state.temDate === '') {
                    this.props.rightCallback(moment().format('YYYY-MM-DD'))
                }else {
                    this.props.rightCallback(this.state.temDate)
                }
              }}>
                  <View style={{ paddingVertical: 15 }}>
                    <Datepicker
                      style={{ paddingHorizontal: 50 }}
                      proportion={[1, 1, 1]}
                      startYear={2016}
                      numberOfYears={20}
                      date={this.state.temDate}
                      onChange={(value) => {
                        this.setState({
                          temDate:value
                        })

                      }}
                    />
                  </View>
                  {this.renderSafeArea()}
              </BottomModal>
            </View>
        )
    }
}


export default TroubleTime