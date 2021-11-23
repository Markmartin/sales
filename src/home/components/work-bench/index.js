import React, {Component} from 'react'
import {TouchableOpacity, Image} from 'react-native'
import {Badge} from 'beeshell'
import {BenchWrapper, BenchTitle, WorkList, WorkWrapper, WorkTitle} from "./style"
import works from './works'
import navigation from '../../../common/services/navigation'
import {inject, observer} from 'mobx-react'
import {filter} from 'lodash'

// 工作台列表
@inject(['userStore']) // 注入对应的store
@observer // 监听当前组件
export default class Workbench extends Component {
	constructor(props) {
		super(props)
		this.store = this.props.userStore
	}

	// 渲染线索红点
	renderClues(work){
		if(work.path === 'Clues' &&this.store.cluesCount>0){
			return(<Badge style={{position: 'absolute', top: -5, right: '21%'}} label={this.store.cluesCount}/>)
		}else {
			return null
		}
	}


	workData() {
		// 根据角色过滤 works
		if (!this.store.role) return null
		const CurrentWorks = filter(works, work => work.role[this.store.role.roleCode])
		return CurrentWorks.map((work) =>
			<WorkWrapper key={work.path}>
				<TouchableOpacity onPress={() => navigation.navigate(work.path)}>
					{this.renderClues(work)}
					<Image source={work.image} style={{width: 50, height: 50}}/>
					<WorkTitle>
						{work.name}
					</WorkTitle>
				</TouchableOpacity>
			</WorkWrapper>
		)
	}

	render() {
		return (
			<BenchWrapper>
				<BenchTitle>工作台</BenchTitle>
				<WorkList>
					{this.workData()}
				</WorkList>
			</BenchWrapper>
		)
	}

}

