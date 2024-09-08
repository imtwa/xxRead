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
function simpPYStr() {
  return '啊啊啊'
}
function ftPYStr() {
  return '啊啊啊'
}
function qqPYStr() {
  return '啊啊啊'
}
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
  // 一、进行类型判断和特殊处理
  // 判断是否是一个Set类型
  if (originValue instanceof Set) {
    return new Set([...originValue])
  }

  // 判断是否是一个Map类型
  if (originValue instanceof Map) {
    return new Map([...originValue])
  }

  // 判断如果是Symbol的value, 那么创建一个新的Symbol
  if (typeof originValue === 'symbol') {
    return Symbol(originValue.description)
  }

  // 判断如果是函数类型, 那么直接使用同一个函数
  if (typeof originValue === 'function') {
    return originValue
  }

  // 判断传入的originValue是否是一个对象类型
  if (!isObject(originValue)) {
    return originValue
  }

  // 解决循环引用
  if (map.has(originValue)) {
    return map.get(originValue)
  }

  // 判断传入的对象是数组, 还是对象
  const newObject = Array.isArray(originValue) ? [] : {}
  map.set(originValue, newObject) // 解决循环引用

  // 二、值处理
  for (const key in originValue) {
    newObject[key] = deepCopy(originValue[key], map)
  }

  // 对Symbol的key进行特殊的处理
  const symbolKeys = Object.getOwnPropertySymbols(originValue)
  for (const sKey of symbolKeys) {
    newObject[sKey] = deepCopy(originValue[sKey], map)
  }

  // 三、返回新对象
  return newObject
}
