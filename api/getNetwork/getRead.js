import HTMLParser from "@/uni_modules/html-parser/js_sdk/index.js"
import origins from '@/getNetwork/origins.json'

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

const getRead = {
	read0: async (bookurl) => {
		// 拿到这个章节的url
		const chapterurl = bookurl
		let url = chapterurl
		// #ifdef H5
		url = extractHostname(url)
		// #endif
		try {
			const res = await uni.request({
				url: url,
				method: 'GET'
			});
			const doc = new HTMLParser(res.data.toString().trim());
			// 获取正文
			const intro = doc.getElementById('content');
			let int = intro.innerHTML
				.replace(/<br ?\/?>[\s　]*<br ?\/?>/g, '<br>')
				.replace(/&nbsp;/g, ' ')
				.replace(/<div class="con_l">(.|\n)*/, '')
				.replace(/\s/g, "")
				.trim();
			let replacedStr = int.split('<br>')
				.filter(line => line.trim() !== '')
				.map(line => `<p>${line.trim()}</p>`)
				.join('');

			return replacedStr
		} catch (e) {
			console.log(e);
			return -1
		}
	},
	read1: async (bookurl) => {
		// 拿到这个章节的url
		const chapterurl = bookurl
		let url = chapterurl
		// #ifdef H5
		url = extractHostname(url)
		// #endif
		try {
			const res = await uni.request({
				url: url,
				method: 'GET'
			});
			const doc = new HTMLParser(res.data.toString().trim());

			// 获取正文
			const intro = doc.getElementById('content');
			let int = intro.innerHTML
				.replace(/<br ?\/?>[\s　]*<br ?\/?>/g, '<br>')
				.replace(/\s/g, "");
			console.log(int);
			let replacedStr = int.split('<br>')
				.filter(line => line.trim() !== '')
				.map(line => `<p>${line.trim()}</p>`)
				.join('');

			return replacedStr
		} catch (e) {
			console.log(e);
			return -1
		}
	},
	read2: async (bookurl) => {
		// 拿到这个章节的url
		const chapterurl = bookurl
		let url = chapterurl
		// #ifdef H5
		url = extractHostname(url)
		// #endif
		try {
			let replacedStr = "";
			// 这个书源的阅读页面分页
			while (true) {
				const res = await uni.request({
					url: url,
					method: 'GET'
				});
				const doc = new HTMLParser(res.data.toString().trim());
				// 获取正文
				const intro = doc.getElementsByClassName('content')[0];
				let int = intro.innerHTML.replace(/\s/g, "")
					.replace(/<div class="posterror">(.|\n)*/, '')
					.replace(/<br ?\/?>[\s　]*<br ?\/?>/g, '<br>');

				replacedStr += int.split('<br>')
					.filter(line => line.trim() !== '')
					.map(line => `<p>${line.trim()}</p>`)
					.join('');

				// 判断是否有下一页
				const next = new HTMLParser(doc.getElementsByClassName('section-opt')[0].innerHTML)
					.getElementsByTagName("a")[2]
				url = "http://www.caz178.com/" + next.attributes.href;
				// #ifdef H5
				url = extractHostname(url)
				// #endif
				if (next.innerHTML !== "下一页") {
					break;
				}
			}
			return replacedStr.replace(/\s/g, "")
		} catch (e) {
			console.log(e);
			return -1
		}
	},
	read3: async (bookurl) => {
		// 拿到这个章节的url
		const chapterurl = bookurl
		let url = chapterurl
		// #ifdef H5
		url = extractHostname(url)
		// #endif
		try {
			const res = await uni.request({
				url: url,
				method: 'GET'
			});
			const doc = new HTMLParser(res.data.toString().trim());
			// 获取正文
			const intro = doc.getElementById('text');
			let int = intro.innerHTML.replace(/<br ?\/?>[\s　]*<br ?\/?>/g, '<br>')
				.replace(/\s/g, "");

			let replacedStr = int.split('<br>')
				.filter(line => line.trim() !== '')
				.map(line => `<p>${line.trim()}</p>`)
				.join('');

			return replacedStr.replace(/\s/g, "");
		} catch (e) {
			console.log(e);
			return -1
		}
	},
	read4: async (bookurl) => {
		// 拿到这个章节的url
		const chapterurl = bookurl
		let BookID = bookurl.split("-&-")[0]
		let ChapterSeqNo = bookurl.split("-&-")[1]
		try {

			let replacedStr = "";
			const res = await uni.request({
				url: " https://novel.html5.qq.com/be-api/content/ads-read",
				method: 'POST',
				data: {
					"Scene": "chapter",
					"ContentAnchorBatch": [{
						"BookID": BookID,
						"ChapterSeqNo": [ChapterSeqNo]
					}]
				},
				header: {
					"Q-GUID": "4aa27c7cf2d9aca3359656ea186488cb"
				}
			});
			// console.log(res.data);
			
			// 获取正文
			const intro = res.data.data.Content[0].Content
			let int = intro[0]
			replacedStr += int.split('\n')
				.filter(line => line.trim() !== '')
				.map(line => `<p>${line.trim()}</p>`)
				.join('');;

			return replacedStr
		} catch (e) {
			console.log(e);
			return -1
		}
	},
	read5: async (bookurl) => {
		// 拿到这个章节的url
		const chapterurl = bookurl
		let url = chapterurl
		// #ifdef H5
		url = extractHostname(url)
		// #endif
		try {
			const res = await uni.request({
				url: url,
				method: 'GET'
			});
			const doc = new HTMLParser(res.data.toString().trim());
			// 获取正文
			const intro = doc.getElementsByClassName("content")[0]
			let int = intro.innerHTML
				.replace(/&nbsp;/g, ' ')
				.replace(/\s/g, "");

			let replacedStr = int.split('<br/>')
				.filter(line => line.trim() !== '')
				.map(line => `<p>${line.trim()}</p>`)
				.join('');

			return replacedStr
		} catch (e) {
			console.log(e);
			return -1
		}
	},
	read6: async (bookurl) => {
		// 拿到这个章节的url
		const chapterurl = bookurl
		let url = chapterurl

		// 创建一个新的 URL 对象  
		// let parsedUrl = new URL(url);
		// 获取主站名(书源)
		let parsedOrigin = getOriginsUrl(url)

		// #ifdef H5
		url = extractHostname(url)
		// #endif
		try {

			let replacedStr = "";
			// 这个书源的阅读页面分页
			while (true) {
				const res = await uni.request({
					url: url,
					method: 'GET'
				});
				const doc = new HTMLParser(res.data.toString().trim());
				// 获取正文
				const intro = doc.getElementById('booktxt');
				let int = intro.innerHTML.replace("『加入书签，方便阅读』", '')
					.replace(/&nbsp;/g, ' ')
					.replace("本站最新网址：www\.biquge66\.net", "")
					.replace(/<br ?\/?>[\s　]*<br ?\/?>/g, '<br>')
					.replace(/\s/g, "");

				replacedStr += int.split('<br>')
					.filter(line => line.trim() !== '')
					.map(line => `<p>${line.trim()}</p>`)
					.join('');

				// 判断是否有下一页
				const next = doc.getElementById('next_url')

				const match1 = url.match(/(\d+)\/\d+/);
				const cnum1 = match1 ? match1[0] : null;
				const match2 = next.attributes.href.match(/(\d+)\/\d+/);
				const cnum2 = match2 ? match2[0] : null;

				url = parsedOrigin + next.attributes.href;

				// #ifdef H5
				url = extractHostname(url)
				// #endif

				if (cnum1 !== cnum2) {
					break;
				}
			}
			return replacedStr
		} catch (e) {
			console.log(e);
			return -1
		}
	},
	read7: async (bookurl) => {
		// 拿到这个章节的url
		const chapterurl = bookurl
		let url = chapterurl

		let parsedOrigin = getOriginsUrl(url)

		// #ifdef H5
		url = extractHostname(url)
		// #endif

		try {

			let replacedStr = "";
			// 这个书源的阅读页面分页
			while (true) {
				const res = await uni.request({
					url: url,
					method: 'GET'
				});
				const doc = new HTMLParser(res.data.toString().trim());
				console.log(res.data);
				// 获取正文
				const intro = doc.getElementsByTagName('article');
				console.log(intro);
				let int = intro.innerHTML
					.replace(/&nbsp;/g, ' ')
					.replace("（本章未完，请点击下一页继续阅读）", "")
					.replace(/<br ?\/?>[\s　]*<br ?\/?>/g, '<br>')
					.replace(/\s/g, "");

				replacedStr += int.split('<br>')
					.filter(line => line.trim() !== '')
					.map(line => `<p>${line.trim()}</p>`)
					.join('');

				// 判断是否有下一页
				const nextbot = new HTMLParser(doc.getElementsByClassName("section-opt")[0].innerHTML)
				const next = nextbot.getElementsByTagName("a")[2]
				const match1 = url.match(/(\d+)\/\d+/);
				const cnum1 = match1 ? match1[0] : null;
				const match2 = next.attributes.href.match(/(\d+)\/\d+/);
				const cnum2 = match2 ? match2[0] : null;

				url = parsedOrigin + next.attributes.href;

				// #ifdef H5
				url = extractHostname(url)
				// #endif

				if (cnum1 !== cnum2) {
					break;
				}
			}
			return replacedStr
		} catch (e) {
			console.log(e);
			return -1
		}
	},
	read8: async (bookurl) => {
		// 拿到这个章节的url
		const chapterurl = bookurl
		let url = chapterurl

		let parsedOrigin = getOriginsUrl(url)
		// #ifdef H5
		url = extractHostname(url)
		// #endif
		try {
			let replacedStr = "";
			// 这个书源的阅读页面分页
			while (true) {
				const res = await uni.request({
					url: url,
					method: 'GET'
				});
				const doc = new HTMLParser(res.data.toString().trim());
				// 获取正文
				const intro = doc.getElementsByClassName('content')[0];

				let int = intro.innerHTML.replace(/\s/g, "")
					.replace(/<div class="posterror">(.|\n)*/, '')
					.replace("章节错误,点此举报(免注册)", "")
					.replace(",举报后维护人员会在两分钟内校正章节内容,请耐心等待,并刷新页面。", "")
					.replace(/<br ?\/?>[\s　]*<br ?\/?>/g, '<br>')


				replacedStr += int.split('<br>')
					.filter(line => line.trim() !== '')
					.map(line => `<p>${line.trim()}</p>`)
					.join('');

				// 判断是否有下一页
				const next = new HTMLParser(doc.getElementsByClassName('section-opt')[0].innerHTML)
					.getElementsByTagName("a")[2]
				url = parsedOrigin + next.attributes.href;
				// #ifdef H5
				url = extractHostname(url)
				// #endif
				if (next.innerHTML !== "下一页") {
					break;
				}
			}
			return replacedStr.replace(/\s/g, "")
		} catch (e) {
			console.log(e);
			return -1
		}
	},
	read9: async (bookurl) => {
		// 拿到这个章节的url
		const chapterurl = bookurl
		let url = chapterurl

		let parsedOrigin = getOriginsUrl(url)
		// #ifdef H5
		url = extractHostname(url)
		// #endif
		try {
			let replacedStr = "";
			// 这个书源的阅读页面分页
			while (true) {
				const res = await uni.request({
					url: url,
					method: 'GET'
				});
				const doc = new HTMLParser(res.data.toString().trim());
				// 获取正文
				const intro = doc.getElementById("booktxt");
				let int = intro.innerHTML.replace(/\s/g, "")
					.replace(/<br ?\/?>[\s　]*<br ?\/?>/g, '<br>')

				replacedStr += int.split('<br>')
					.filter(line => line.trim() !== '')
					.map(line => `<p>${line.trim()}</p>`)
					.join('');

				// 判断是否有下一页
				const next = new HTMLParser(doc.getElementsByClassName('readPager')[0].innerHTML)
					.getElementsByTagName("a")[2]

				url = next.attributes.href;
				// #ifdef H5
				url = extractHostname(url)
				// #endif
				if (next.innerHTML !== "下一页") {
					break;
				}
			}
			return replacedStr.replace(/\s/g, "")
		} catch (e) {
			console.log(e);
			return -1
		}
	},
	read10: async (bookurl) => {
		// 拿到这个章节的url
		const chapterurl = bookurl
		let url = chapterurl

		let parsedOrigin = getOriginsUrl(url)
		// #ifdef H5
		url = extractHostname(url)
		// #endif
		try {
			let replacedStr = "";
			// 这个书源的阅读页面分页
			while (true) {
				const res = await uni.request({
					url: url,
					method: 'GET'
				});
				const doc = new HTMLParser(res.data.toString().trim());
				// 获取正文
				const intro = doc.getElementById("bodybox");
				let int = intro.innerHTML.replace(/\s/g, "")
					.replace(/<br ?\/?>[\s　]*<br ?\/?>/g, '<br>')

				replacedStr += int.split('<br>')
					.filter(line => line.trim() !== '')
					.map(line => `<p>${line.trim()}</p>`)
					.join('');

				// 判断是否有下一页
				const next = new HTMLParser(doc.getElementsByClassName('u')[0].innerHTML)
					.getElementsByTagName("a")[2]
				url = next.attributes.href;
				// #ifdef H5
				url = extractHostname(url)
				// #endif
				if (next.innerHTML !== "下一页") {
					break;
				}
			}
			return replacedStr.replace(/\s/g, "")
		} catch (e) {
			console.log(e);
			return -1
		}
	},
	read11: async (bookurl) => {
		// 拿到这个章节的url
		const chapterurl = bookurl
		let url = chapterurl

		let parsedOrigin = getOriginsUrl(url)
		// #ifdef H5
		url = extractHostname(url)
		// #endif

		try {
			let replacedStr = "";
			// 这个书源的阅读页面分页
			while (true) {

				const res = await uni.request({
					url: url,
					method: 'GET'
				});
				const doc = new HTMLParser(res.data.toString().trim());
				// 获取正文
				const intro = doc.getElementById("booktxt");
				let int = intro.innerHTML.replace(/\s/g, "")
					.replace("本章未完，点击下一页继续阅读。", "")
					.replace(/<br ?\/?>[\s　]*<br ?\/?>/g, '<br>')

				replacedStr += int.split('<br>')
					.filter(line => line.trim() !== '')
					.map(line => `<p>${line.trim()}</p>`)
					.join('');

				// 判断是否有下一页
				const next = new HTMLParser(doc.getElementsByClassName('readpage')[0]
						.innerHTML)
					.getElementsByTagName("a")[3]
				url = parsedOrigin + next.attributes.href;
				// #ifdef H5
				url = extractHostname(url)
				// #endif
				if (next.innerHTML !== "下一页") {
					break;
				}
			}
			return replacedStr.replace(/\s/g, "")
		} catch (e) {
			console.log(e);
			return -1
		}
	},
	read12: async (bookurl) => {
		// 拿到这个章节的url
		const chapterurl = bookurl
		let url = chapterurl

		let parsedOrigin = getOriginsUrl(url)
		// #ifdef H5
		url = extractHostname(url)
		// #endif

		try {
			let replacedStr = "";
			// 这个书源的阅读页面分页
			while (true) {

				const res = await uni.request({
					url: url,
					method: 'GET'
				});
				const doc = new HTMLParser(res.data.toString().trim());
				// 获取正文
				const intro = doc.getElementById("nr1");
				// console.log(intro);

				let int = intro.innerHTML.replace(/\s/g, "")
					.replace("本章未完，点击下一页继续阅读。", "")
					.replace(/<br ?\/?>[\s　]*<br ?\/?>/g, '<br>')

				replacedStr += int.split('<br>')
					.filter(line => line.trim() !== '')
					.map(line => `<p>${line.trim()}</p>`)
					.join('');

				// 判断是否有下一页
				const next = new HTMLParser(doc.getElementsByClassName('nr_page')[0]
						.innerHTML)
					.getElementsByTagName("a")[2]
				url = parsedOrigin + next.attributes.href;
				// #ifdef H5
				url = extractHostname(url)
				// #endif
				if (next.innerHTML !== "下一页") {
					break;
				}
			}
			return replacedStr.replace(/\s/g, "")
		} catch (e) {
			console.log(e);
			return -1
		}
	},
	read13: async (bookurl) => {
		// 拿到这个章节的url
		const chapterurl = bookurl
		let url = chapterurl

		let parsedOrigin = getOriginsUrl(url)
		// #ifdef H5
		url = extractHostname(url)
		// #endif

		try {
			let replacedStr = "";
			// 这个书源的阅读页面分页
			while (true) {

				const res = await uni.request({
					url: url,
					method: 'GET'
				});
				const doc = new HTMLParser(res.data.toString().trim());
				// 获取正文
				const intro = doc.getElementById("booktxt");
				// console.log(intro);

				let int = intro.innerHTML.replace(/\s/g, "")
					.replace("本章未完，点击下一页继续阅读。", "")
					.replace(/<br ?\/?>[\s　]*<br ?\/?>/g, '<br>')

				replacedStr += int.split('<br>')
					.filter(line => line.trim() !== '')
					.map(line => `<p>${line.trim()}</p>`)
					.join('');

				// 判断是否有下一页
				const next = new HTMLParser(doc.getElementsByClassName('bottem1')[0]
						.innerHTML)
					.getElementsByTagName("a")[2]
				url = parsedOrigin + next.attributes.href;
				// #ifdef H5
				url = extractHostname(url)
				// #endif
				if (next.innerHTML !== "下一页") {
					break;
				}
			}
			return replacedStr.replace(/\s/g, "")
		} catch (e) {
			console.log(e);
			return -1
		}
	},
	read14: async (bookurl) => {
		// 拿到这个章节的url
		const chapterurl = bookurl
		let url = chapterurl

		let parsedOrigin = getOriginsUrl(url)
		// #ifdef H5
		url = extractHostname(url)
		// #endif

		try {
			let replacedStr = "";
			// 这个书源的阅读页面分页
			while (true) {

				const res = await uni.request({
					url: url,
					method: 'GET'
				});
				const doc = new HTMLParser(res.data.toString().trim());
				// 获取正文
				const intro = doc.getElementById("content");
				// console.log(intro);

				let int = intro.innerHTML.replace(/\s/g, "")
					.replace("本章未完，点击下一页继续阅读。", "")
					.replace(/<br ?\/?>[\s　]*<br ?\/?>/g, '<br>')

				replacedStr += int.split('<br>')
					.filter(line => line.trim() !== '')
					.map(line => `<p>${line.trim()}</p>`)
					.join('');

				// 判断是否有下一页
				const next = doc.getElementById("next_url")
				url = parsedOrigin + next.attributes.href;
				// #ifdef H5
				url = extractHostname(url)
				// #endif
				if (next.innerHTML !== "下一页") {
					break;
				}
			}
			return replacedStr.replace(/\s/g, "")
		} catch (e) {
			console.log(e);
			return -1
		}
	},
	read15: async (bookurl) => {
		// 拿到这个章节的url
		const chapterurl = bookurl
		let url = chapterurl

		let parsedOrigin = getOriginsUrl(url)
		// #ifdef H5
		url = extractHostname(url)
		// #endif

		try {
			let replacedStr = "";

			const res = await uni.request({
				url: url,
				method: 'GET'
			});
			const doc = new HTMLParser(res.data.body.content)

			// 获取正文
			replacedStr += doc.getElementsByClassName("text-title-1")[0]
				.innerHTML;

			const intros = doc.getElementsByClassName("bodytext");
			// const intro = res.data.body.content;

			for (let i = 0; i < intros.length; i++) {
				let int = intros[i].innerHTML.replace(/\s/g, "")
				replacedStr += int.split('<br>')
					.filter(line => line.trim() !== '')
					.map(line => `<p>${line.trim()}</p>`)
					.join('');
			}

			return replacedStr.replace(/\s/g, "")
		} catch (e) {
			console.log(e);
			return -1
		}
	},

	read16: async (bookurl) => {
		// 拿到这个章节的url
		const chapterurl = bookurl
		let url = chapterurl

		let parsedOrigin = getOriginsUrl(url)
		// #ifdef H5
		url = extractHostname(url)
		// #endif

		try {
			let replacedStr = "";

			const res = await uni.request({
				url: url,
				method: 'GET'
			});
			const intro = res.data.content;

			let int = intro
			
			replacedStr += int.split('\n')
				.filter(line => line.trim() !== '')
				.map(line => `<p>${line.trim()}</p>`)
				.join('');

			return replacedStr.replace(/\s/g, "")
		} catch (e) {
			console.log(e);
			return -1
		}
	},
}

export default getRead