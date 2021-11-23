/**
 * @description 用来选择日期，到天对外传递数据
 * @param {rightCallback} 是关闭弹窗接收的函数
 */

import React, {Component} from 'react';
import {Text, View, SafeAreaView} from 'react-native';
import {Scrollpicker, BottomModal} from 'beeshell';
import {remove} from 'lodash'

export default class DatePicker extends Component {
	constructor(props) {
		super(props)
		this.state = {
			date: moment().format('YYYY-MM-DD'),
			startYear: moment().year(),
			list: [[]],
			value: [0, 0, 0]
		}
	}

	init() {
		// 生成初始化数据
		const {startYear} = this.state
		let {endDate, numberOfYears, showPastDate} = this.props
		let endYear
		let endMonth
		let endDay
		const years = []

		// 存在 numberOfYears
		numberOfYears = numberOfYears ? numberOfYears : 10

		// 存在结束日期
		if (endDate !== undefined) {
			[endYear, endMonth, endDay] = endDate.split('-')
			endYear = Number(endYear)
			endMonth = Number(endMonth)
			numberOfYears = Number(endYear) - Number(startYear)
		}
		for (let i = 0; i <= numberOfYears; i++) {
			years.push(Number(startYear) + i)
		}

		// 生成月份
		let currentMonth = moment().month() + 1
		const months = []
		endMonth = endMonth && startYear === endYear ? endMonth : 12
		// 是否屏蔽过去时间
		let startMonth = showPastDate ? 1 : currentMonth
		for (let i = startMonth; i <= endMonth; i++) {
			months.push(convert2Digit(i))
		}

		// 获取天数
		const currentDay = moment().date()
		let startDay = showPastDate ? 1 : currentDay
		if (endDate !== undefined && startYear === endYear && currentMonth === endMonth) {
			endDay = Number(endDay)
		} else {
			endDay = moment().daysInMonth()
		}

		const days = []
		for (let i = startDay; i <= endDay; i++) {
			days.push(convert2Digit(i))
		}
		this.setState({
			list: [years, months, days],
			value:[0,0,0]
		})
	}

	componentDidMount() {
		this.init()
	}

	// 如果prevProps中有了endDate 则响应变化
	componentDidUpdate(prevProps, prevState) {
		const {endDate} = this.props
		// 如果一样则不管,或者变动过
		if (endDate === prevProps.endDate) return
		this.init()
	}

	// 相应变化
	handleChange(columnIndex, rowIndex) {
		const {value, list, startYear} = this.state
		const {endDate, showPastDate} = this.props
		let endYear
		let endMonth
		let endDay

		// 存在结束日期
		if (endDate !== undefined) {
			[endYear, endMonth, endDay] = endDate.split('-')
			endYear = Number(endYear)
		}
		let currentYear = list[0][value[0]]

		// 如果年份发生变化 判断月份是否结束月份，过去月份
		if (columnIndex === 0) {
			// 生成月份
			currentYear = list[0][rowIndex]
			const currentMonth = moment().month() + 1
			const months = []
			endMonth = endMonth && currentYear === endYear ? Number(endMonth) : 12
			// 是否屏蔽过去时间
			let startMonth = !showPastDate && startYear === currentYear ? currentMonth : 1
			for (let i = startMonth; i <= endMonth; i++) {
				months.push(convert2Digit(i))
			}
			list[1] = months
			value[0] = rowIndex
			value[1] = 0

			// 重置天数
			const currentDay = moment().date()
			let startDay = !showPastDate && startYear === currentYear && currentMonth === moment().month() + 1 ? currentDay : 1
			if (endDate !== undefined && currentYear === endYear && Number(months[0]) === endMonth) {
				endDay = Number(endDay)
			} else {
				// months[0] 为年份改变后的自动选中的月
				endDay = moment(`${currentYear}-${months[0]}`, "YYYY-MM").daysInMonth()
			}

			const days = []
			for (let i = startDay; i <= endDay; i++) {
				days.push(convert2Digit(i))
			}
			list[2] = days
			value[2] = 0
		}

		// 如果月份发生变化则改变days
		if (columnIndex === 1) {
			// 生成天数
			const currentMonth = list[1][rowIndex]
			// 获取天数
			const currentDay = moment().date()
			let startDay = !showPastDate && startYear === currentYear && currentMonth === moment().month() + 1 ? currentDay : 1
			if (endDate !== undefined && currentYear === endYear && currentMonth === endMonth) {
				endDay = Number(endDay)
			} else {
				endDay = moment(`${currentYear}-${currentMonth}`, "YYYY-MM").daysInMonth()
			}

			const days = []
			for (let i = startDay; i <= endDay; i++) {
				days.push(convert2Digit(i))
			}
			list[2] = days
			value[1] = rowIndex
			value[2] = 0
		}

		// 如果改变的是天
		if (columnIndex === 2) {
			value[2] = rowIndex
		}

		// 设置value
		const dateArray = list.map((item, index) => item[value[index]])
		const date = dateArray.join('-')

		this.setState({
			value: [...value],
			list: [...list],
			date
		})
	}

	// 打开modal
	open() {
		return this.bottomModal.open()
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
		const {list, value, date} = this.state
		return (
			<BottomModal ref={c => this.bottomModal = c}
						 title='请选择日期'
						 rightCallback={() => {
							 this.props.rightCallback(date)
						 }}
						 cancelable={true}>
				<View style={{paddingVertical: 15}}>
					<Scrollpicker
						style={{paddingHorizontal: 80}}
						offsetCount={3}
						list={list}
						onChange={(columnIndex, rowIndex) => this.handleChange(columnIndex, rowIndex)}
						value={value}
					/>
				</View>
				{this.renderSafeArea()}
			</BottomModal>
		);
	}
}

function convert2Digit(i) {
	i = Number(i);
	if (i >= 0 && i < 10) {
		i = '0' + i;
	} else {
		i = '' + i;
	}
	return i;
}
