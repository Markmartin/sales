/**
 * @param {Array，key} 根据key hash化数组
 * @returns {Array}
 */
import {zipObject,map} from 'lodash'

export default (array, key) => zipObject(map(array, key), array)
