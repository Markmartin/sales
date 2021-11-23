/**
 * @description 封装的步骤条 具体使用参考https://github.com/24ark/react-native-step-indicator
 */


import React, {Component} from 'react';
import StepIndicator from 'react-native-step-indicator';
import {colors} from "../../../style/variables";

const customStyles = {
	stepIndicatorSize: 25,
	currentStepIndicatorSize:30,
	separatorStrokeWidth: 2,
	currentStepStrokeWidth: 3,
	stepStrokeWidth: 3,
	stepStrokeUnFinishedColor: '#aaaaaa',
	separatorUnFinishedColor: '#aaaaaa',
	stepIndicatorUnFinishedColor: '#ffffff',
	stepIndicatorCurrentColor: '#ffffff',
	stepIndicatorLabelFontSize: 13,
	currentStepIndicatorLabelFontSize: 13,
	stepIndicatorLabelFinishedColor: '#ffffff',
	stepIndicatorLabelUnFinishedColor: '#aaaaaa',
	labelColor: '#999999',
	stepStrokeCurrentColor: colors.primary,
	stepStrokeFinishedColor: colors.primary,
	separatorFinishedColor: colors.primary,
	stepIndicatorFinishedColor: colors.primary,
	stepIndicatorLabelCurrentColor: colors.primary,
	labelSize: 13,
	currentStepLabelColor: colors.primary
}

export default class Steps extends Component{
	render() {
		return (
			<StepIndicator customStyles={customStyles}  {...this.props}
			/>
		);
	}
}
