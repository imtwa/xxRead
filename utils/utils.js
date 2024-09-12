/**
 * date转化为hh:mm
 */
export function dateToStr(date) {
  if (typeof date !== 'number') {
    return ''
  }
  date = new Date(date)
  let hh = date.getHours()
  let mm = date.getMinutes()
  if (hh < 10) {
    hh = '0' + hh
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  return hh + ':' + mm
}

import { ftPYStr, simpPYStr, qqPYStr } from './pyStr'

export function traditionalized(cc) {
  var str = ''
  if (cc) {
    for (var i = 0; i < cc.length; i++) {
      if (simpPYStr().indexOf(cc.charAt(i)) != -1)
        str += ftPYStr().charAt(simpPYStr().indexOf(cc.charAt(i)))
      else if (qqPYStr().indexOf(cc.charAt(i)) != -1)
        str += ftPYStr().charAt(qqPYStr().indexOf(cc.charAt(i)))
      else str += cc.charAt(i)
    }
  }
  return str
}
export function simplized(cc) {
  var str = ''
  if (cc) {
    for (var i = 0; i < cc.length; i++) {
      if (ftPYStr().indexOf(cc.charAt(i)) != -1)
        str += simpPYStr().charAt(ftPYStr().indexOf(cc.charAt(i)))
      else if (qqPYStr().indexOf(cc.charAt(i)) != -1)
        str += simpPYStr().charAt(qqPYStr().indexOf(cc.charAt(i)))
      else str += cc.charAt(i)
    }
  }
  return str
}
function qqlized(cc) {
  var str = ''
  for (var i = 0; i < cc.length; i++) {
    if (ftPYStr().indexOf(cc.charAt(i)) != -1)
      str += qqPYStr().charAt(ftPYStr().indexOf(cc.charAt(i)))
    else if (simpPYStr().indexOf(cc.charAt(i)) != -1)
      str += qqPYStr().charAt(simpPYStr().indexOf(cc.charAt(i)))
    else str += cc.charAt(i)
  }
  return str
}

/**
 * 清除文本中连续重复超过指定次数的字符。
 *
 * @param {string} text - 需要处理的文本字符串。
 * @param {number} maxRepeat - 允许的最大连续重复字符数。
 * @returns {string} 处理后的文本字符串，其中连续重复超过maxRepeat次的字符被替换为单个字符重复maxRepeat次。
 *
 */
export function clearExcessiveRepeats(text, maxRepeat) {
  return text.replace(new RegExp(`(.)\\1{${maxRepeat},}`, 'g'), '$1'.repeat(maxRepeat))
}

/**
 * 获取十六进制颜色的互补色。
 *
 * @param {string} hexColor - 十六进制颜色字符串，格式为 '#RRGGBB' 或 '#RGB'。
 * @returns {string} - 互补色的十六进制字符串。
 */
export function getComplementaryColor(hexColor) {
  // 检查输入是否为有效的十六进制颜色
  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexColor)) {
    return '#000000'
  }

  // 提取颜色通道
  const [r, g, b] = hexColor
    .replace('#', '')
    .match(/.{2}/g)
    .map(c => parseInt(c, 16))

  // 计算互补色
  const complementary = {
    r: 255 - r,
    g: 255 - g,
    b: 255 - b
  }

  // 转换回十六进制字符串
  const complementaryHex =
    '#' +
    complementary.r.toString(16).padStart(2, '0') +
    complementary.g.toString(16).padStart(2, '0') +
    complementary.b.toString(16).padStart(2, '0')

  return complementaryHex
}

/**
 * 判断是否是对象类型
 * @param {*} value
 * @returns
 */
function isObject(value) {
  const valueType = typeof value
  return value !== null && (valueType === 'object' || valueType === 'function')
}

/**
 * 深拷贝函数
 *
 * 该函数接受一个 `originValue` 作为输入，并返回一个新对象，该对象是 `originValue` 的完全复制品。
 * 深拷贝意味着它不仅复制对象本身，还递归地复制对象内部的所有嵌套对象。
 *
 * @param {any} originValue - 需要被复制的原始值。
 * @param {WeakMap} [map=new WeakMap()] - 用于跟踪已访问的对象以避免循环引用。
 * @returns {any} - 返回一个新的对象，它是 `originValue` 的深拷贝。
 */
export function deepCopy(originValue, map = new WeakMap()) {
  if (originValue instanceof Set) {
    return new Set([...originValue])
  }
  if (originValue instanceof Map) {
    return new Map([...originValue])
  }
  if (typeof originValue === 'symbol') {
    return Symbol(originValue.description)
  }
  if (typeof originValue === 'function') {
    return originValue
  }
  if (!isObject(originValue)) {
    return originValue
  }
  // 解决循环引用
  if (map.has(originValue)) {
    return map.get(originValue)
  }
  const newObject = Array.isArray(originValue) ? [] : {}
  map.set(originValue, newObject) // 解决循环引用

  for (const key in originValue) {
    newObject[key] = deepCopy(originValue[key], map)
  }

  // 对Symbol的key进行特殊的处理
  const symbolKeys = Object.getOwnPropertySymbols(originValue)
  for (const sKey of symbolKeys) {
    newObject[sKey] = deepCopy(originValue[sKey], map)
  }

  // 返回新对象
  return newObject
}

/**
 * @description 深度克隆
 * @param {object} obj 需要深度克隆的对象
 * @param cache 缓存
 * @returns {*} 克隆后的对象或者原值（不是对象）
 */
export function deepClone(obj, cache = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj
  if (cache.has(obj)) return cache.get(obj)
  let clone
  if (obj instanceof Date) {
    clone = new Date(obj.getTime())
  } else if (obj instanceof RegExp) {
    clone = new RegExp(obj)
  } else if (obj instanceof Map) {
    clone = new Map(Array.from(obj, ([key, value]) => [key, deepClone(value, cache)]))
  } else if (obj instanceof Set) {
    clone = new Set(Array.from(obj, value => deepClone(value, cache)))
  } else if (Array.isArray(obj)) {
    clone = obj.map(value => deepClone(value, cache))
  } else if (Object.prototype.toString.call(obj) === '[object Object]') {
    clone = Object.create(Object.getPrototypeOf(obj))
    cache.set(obj, clone)
    for (const [key, value] of Object.entries(obj)) {
      clone[key] = deepClone(value, cache)
    }
  } else {
    clone = Object.assign({}, obj)
  }
  cache.set(obj, clone)
  return clone
}

/**
 * @description JS对象深度合并
 * @param {object} target 需要拷贝的对象
 * @param {object} source 拷贝的来源对象
 * @returns {object|boolean} 深度合并后的对象或者false（入参有不是对象）
 */
export function deepMerge(target = {}, source = {}) {
  target = deepClone(target)
  if (
    typeof target !== 'object' ||
    target === null ||
    typeof source !== 'object' ||
    source === null
  )
    return target
  const merged = Array.isArray(target) ? target.slice() : Object.assign({}, target)
  for (const prop in source) {
    if (!source.hasOwnProperty(prop)) continue
    const sourceValue = source[prop]
    const targetValue = merged[prop]
    if (sourceValue instanceof Date) {
      merged[prop] = new Date(sourceValue)
    } else if (sourceValue instanceof RegExp) {
      merged[prop] = new RegExp(sourceValue)
    } else if (sourceValue instanceof Map) {
      merged[prop] = new Map(sourceValue)
    } else if (sourceValue instanceof Set) {
      merged[prop] = new Set(sourceValue)
    } else if (typeof sourceValue === 'object' && sourceValue !== null) {
      merged[prop] = deepMerge(targetValue, sourceValue)
    } else {
      merged[prop] = sourceValue
    }
  }
  return merged
}
