import HTMLParser from "@/uni_modules/html-parser/js_sdk/index.js"

/**
 * 正则匹配 H5需要转发请求
 */
function extractHostname(url) {
	const regex = /^http[s]?:\/\/www\.(.*?)\.(.*?)\/(.*)$/;
	const match = url.match(regex);
	if (match && match[2] && match[3]) {
		const convertedUrl = '/' + match[1] + '/' + match[3];
		return convertedUrl;
	} else {
		return -1;
	}
}
/**
 * 正则匹配 获取网站源
 */
function getOriginsUrl(url) {
	const regex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/g;
	const match = url.match(regex);
	if (match) {
		return match[0];
	} else {
		return null;
	}
}

import origins from '@/getNetwork/origins.json'
import getSearch from '@/getNetwork/getSearch.js'
import getHomePage from '@/getNetwork/getHomePage.js'
import getRead from '@/getNetwork/getRead.js'

const getNetwork = {

	/**
	 * @name search
	 * @description 用于执行指定索引的搜索函数，返回搜索结果列表
	 * @param {number} index - 搜索函数的索引
	 * @param {string} keyword - 搜索关键字
	 * @returns {Array} - 搜索结果列表
	 * @time 2023-10-27
	 */
	async search(index, keyword) {
		console.log("获取书源" + index + "的" + keyword);
		let list = [];
		
		const functionString = origins[index].functionSearch
		list = await getSearch[functionString](keyword);

		// 添加属性
		if (list.length > 0) {
			list.forEach((item, i) => {
				item.bookSourceName = origins[index].bookSourceName;
				// item.bookname = item.bookname.trim()
			});
		}
		return list;
	},

	/**
	 * @name homePage
	 * @description 获取书籍详情
	 * @param {} book - 书籍对象 包含 imgurl，bookurl，bookname，author，origin
	 * @returns {} - 详情对象，包含 imgurl，bookurl，bookname，author，origin，intro，chapters，readIndex
	 * @time 2023-10-27
	 */
	async homePage(book) {
		// 创建新对象，不然会改变引用
		let newbook = JSON.parse(JSON.stringify(book));
		// let newbook = Object.assign({}, book);

		// const index = origins.indexOf(book.origin);
		const index = origins.findIndex(item => item.bookSourceUrl === newbook.origin);

		console.log("获取书源" + index + "的" + newbook.bookname + "详情");
		if (-1 === index) {
			return -1
		}
		
		const functionString = origins[index].functionHomePage
		const getbook = await getHomePage[functionString](newbook.bookurl)

		//将getbook对象的所有属性（包括其子属性）复制到newbook对象中
		Object.assign(newbook, getbook);
		// console.log(newbook);
		return newbook;
	},

	/**
	 * @name read
	 * @description 获取章节内容
	 * @param {String} origin - 书源
	 * @param {String} bookurl - 章节链接
	 * @returns {String} text - 本章内容
	 * @time 2023-10-27
	 */
	async read(origin, chapurl) {
		// const index = origins.indexOf(origin);

		const index = origins.findIndex(item => item.bookSourceUrl === origin);
		console.log("获取书源" + index + "的" + chapurl + "章节内容");
		if (-1 === index) {
			return -1
		}

		const functionString = origins[index].functionRead
		const text = await getRead[functionString](chapurl)
		return text;
	},

}
export default getNetwork