import {forEach, reverse, isNil} from 'lodash'
// 为子节点设置父节点信息，添加hash信息
const setPreId = (item, hash) => {
	if (!item || isNil(item.value)) return
	hash[item.value] = item
	// 处理子节点
	if (!item.children || !item.children.length) return
	forEach(item.children, i => {
		i.preId = item.value
		hash[i.value] = i
		if (i.children && i.children.length) setPreId(i, hash)
	})
}

// 获取父节点
const getPre = (item, hash, nodes) => {
	const node = hash[item]
	if (node.preId) {
		nodes.push(node.preId)
		getPre(node.preId, hash, nodes)
	}
}

// 寻找父节点 组成数组
const getNodes = (item, hash) => {
	let nodes = [item]
	// 获取要处理节点
	getPre(item, hash, nodes)
	return reverse(nodes)
}

export {setPreId, getNodes}
