/**
 * 数据字典服务
 * 登陆后主页请求数据字典
 * @format
 */
import {action, configure, runInAction, computed} from 'mobx';
import {forEach} from "lodash";
import hashWith from "../common/tool/hash-with";

// 不允许在动作外部修改状态
configure({enforceActions: "observed"});

class Dict {
	constructor() {
		this.originalData = []
		this.hashData = {}
	}

	@action // 登陆
	setData = () => {
		return axios.get('admin/dict/listAll')
			.then(({data}) => {
				runInAction(() => this.originalData = data)
				// hash化数组存入
				let obj = {}
				forEach(data, (value, key) => {
					obj[key] =  hashWith(value, 'dictKey')
				})
				runInAction(() => this.hashData = obj)
			})
	}
}

const dictStore = new Dict()

export default dictStore
