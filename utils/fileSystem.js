import { stripPTags } from './utils.js'

/**
 *
 * @param {Object} bookTxt - 书籍对象
 * @returns 格式化后的txt文件字符串
 */
export function outputTxT(bookTxt) {
  let str = ''
  str += `${bookTxt.bookname.trim()}\n作者：${bookTxt.author}\n内容简介：\n${bookTxt.intro}\n\n`
  for (const item in bookTxt.chapters) {
    if (Object.prototype.hasOwnProperty.call(bookTxt.chapters, item)) {
      const element = bookTxt.chapters[item]
      str += `${element.chaptername}\n`
      if (element.hasOwnProperty('text')) {
        const text = stripPTags(element.text)
        str += `${text}\n`
      } else {
        str += `\n`
      }
    }
  }
  return str
}
