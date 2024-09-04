import HTMLParser from "@/uni_modules/html-parser/js_sdk/index.js"
import origins from '@/getNetwork/origins.json'

const CryptoJS = require("crypto-js");

/**  
 * 猫眼看书的章节路径需要处理AES解密  
 *  
 * @param {string} base64EncodedString - 需要解密的Base64编码的AES加密字符串  
 * @returns {string} - 解密后的字符串  
 */
function aesBase64DecodeToString(base64EncodedString) {
	// 将密钥和初始化向量（IV）转换为WordArray对象  
	// 注意：这里假设密钥和IV是UTF-8编码的字符串  
	const key = CryptoJS.enc.Utf8.parse('f041c49714d39908');
	const iv = CryptoJS.enc.Utf8.parse('0123456789abcdef');

	// 使用CryptoJS库中的AES.decrypt方法解密字符串  
	// 第一个参数是需要解密的字符串（注意：这里base64EncodedString已经是Base64解码后的AES加密字符串）  
	// 第二个参数是密钥  
	// 第三个参数是一个配置对象，包括iv、模式和填充方式  
	const source = CryptoJS.AES.decrypt(base64EncodedString, key, {
		iv: iv, // 初始化向量  
		mode: CryptoJS.mode.CBC, // 加密模式为CBC  
		padding: CryptoJS.pad.Pkcs7 // 填充方式为PKCS#7  
	});

	// 将解密后的WordArray对象转换为UTF-8编码的字符串  
	const sourceText = source.toString(CryptoJS.enc.Utf8);

	// 返回解密后的字符串  
	return sourceText;
}

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

const getHomePage = {
	homePage0: async (bookurl) => {
		let url = bookurl

		// #ifdef H5
		url = extractHostname(url)
		// #endif

		try {
			let book = {
				intro: "",
				chapters: [],
			}
			const res = await uni.request({
				url: url,
				method: 'GET'
			});
			const doc = new HTMLParser(res.data.toString().trim());
			// 获取简介
			const intro = new HTMLParser(doc.getElementsByClassName('intro')[0]["innerHTML"]);
			const text = intro.getElementsByTagName("p")[1]["innerHTML"];
			// 获取目录
			const list = new HTMLParser(doc.getElementsByClassName("book_con_list")[1].innerHTML);
			const dds = list.getElementsByTagName("li");
			let chapter = [];
			for (let i = 0; i < dds.length; i++) {
				let dd = dds[i]['innerHTML'];
				// 提取章节URL
				const urlRegex = /href="(.*?)"/;
				const urlMatch = dd.match(urlRegex);
				const chapterurl = urlMatch ? urlMatch[1] : '';

				// 提取章节名称
				const textRegex = />(.*?)<\/a>/;
				const textMatch = dd.match(textRegex);
				const chaptername = textMatch ? textMatch[1] : '';

				chapter.push({
					chapterurl: bookurl + chapterurl,
					chaptername: chaptername,
				});
			}

			book.intro = text;
			book.chapters = chapter;

			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}

	},

	homePage1: async (bookurl) => {
		let url = bookurl

		// #ifdef H5
		url = extractHostname(url)
		// #endif

		try {
			let book = {
				intro: "",
				chapters: [],
			}
			const res = await uni.request({
				url: url,
				method: 'GET'
			});
			const doc = new HTMLParser(res.data.toString().trim());

			// 获取简介
			const intro = doc.getElementById('intro');
			const text = intro['innerHTML'].replace(/<[^>]+>/g, '');
			// 获取目录
			const dds = doc.getElementsByTagName('dd');

			let chapter = [];
			let i = 0;
			if (dds.length < 18) {
				i = dds.length / 2;
			} else {
				i = 9;
			}
			for (i; i < dds.length; i++) {
				let dd = dds[i]['innerHTML'];
				// 提取章节URL
				const urlRegex = /href="(.*?)"/;
				const urlMatch = dd.match(urlRegex);
				const chapterurl = urlMatch ? urlMatch[1] : '';

				// 提取章节名称
				const textRegex = />(.*?)<\/a>/;
				const textMatch = dd.match(textRegex);
				const chaptername = textMatch ? textMatch[1] : '';

				chapter.push({
					chapterurl: 'http://www.paoshu8.info' + chapterurl,
					chaptername: chaptername,
				});
			}

			book.intro = text;
			book.chapters = chapter;

			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},
	homePage2: async (bookurl) => {
		let url = bookurl

		// #ifdef H5
		url = extractHostname(url)
		// #endif

		try {
			let book = {
				intro: "",
				chapters: [],
			}
			const res = await uni.request({
				url: url,
				method: 'GET'
			});
			const doc = new HTMLParser(res.data.toString().trim());

			// 这个书源没有封面，先获取封面
			const img = new HTMLParser(doc.getElementsByClassName('imgbox')[0]["innerHTML"]);
			const imgurl = img.getElementsByTagName("img")[0].attributes.src;

			// 获取简介
			const intro = doc.getElementsByClassName('xs-show')[3]["innerHTML"];
			const text = intro.replace(/<strong>简介:<\/strong>/, '');
			// 获取目录
			const list = new HTMLParser(doc.getElementsByClassName("section-box")[1][
				"innerHTML"
			]);
			const dds = list.getElementsByTagName("li");
			let chapter = [];

			for (let i = 0; i < dds.length; i++) {
				let dd = dds[i]['innerHTML'];
				// 提取章节URL
				const urlRegex = /href="(.*?)"/;
				const urlMatch = dd.match(urlRegex);
				const chapterurl = urlMatch ? urlMatch[1] : '';

				// 提取章节名称
				const textRegex = />(.*?)<\/a>/;
				const textMatch = dd.match(textRegex);
				const chaptername = textMatch ? textMatch[1] : '';

				chapter.push({
					chapterurl: url + chapterurl,
					chaptername: chaptername,
				});
			}

			book.imgurl = imgurl;
			book.intro = text;
			book.chapters = chapter;
			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},
	homePage3: async (bookurl) => {
		let url = bookurl

		// #ifdef H5
		url = extractHostname(url)
		// #endif

		try {
			let book = {
				intro: "",
				chapters: [],
			}
			const res = await uni.request({
				url: url,
				method: 'GET'
			});
			const doc = new HTMLParser(res.data.toString().trim());

			// 获取简介
			const intro = doc.getElementsByClassName('introbar')[0]["innerHTML"];
			const text = intro;
			// 获取目录
			const list = new HTMLParser(doc.getElementsByClassName("chapter")[0]["innerHTML"]);
			const dds = list.getElementsByTagName("li");
			let chapter = [];

			for (let i = 0; i < dds.length; i++) {
				let dd = dds[i]['innerHTML'];
				// 提取章节URL
				const urlRegex = /href="(.*?)"/;
				const urlMatch = dd.match(urlRegex);
				const chapterurl = urlMatch ? urlMatch[1] : '';

				// 提取章节名称
				const textRegex = />(.*?)<\/a>/;
				const textMatch = dd.match(textRegex);
				const chaptername = textMatch ? textMatch[1] : '';

				chapter.push({
					chapterurl: "https://www.sypvm.com" + chapterurl,
					chaptername: chaptername,
				});
			}

			book.intro = text;
			book.chapters = chapter;
			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},
	homePage4: async (bookurl) => {
		// 只获取id
		bookurl = bookurl.replace("https://bookshelf.html5.qq.com", "");
		let url = "https://bookshelf.html5.qq.com/qbread/api/book/all-chapter?bookId=" + bookurl

		try {
			let book = {
				chapters: [],
			}
			const res = await uni.request({
				url: url,
				method: 'GET',
				header: {
					"Referer": "https://bookshelf.html5.qq.com/qbread"
				}
			});

			let dds = res.data.rows
			let chapter = [];

			for (let i = 0; i < dds.length; i++) {
				// 组成请求data
				// 因为js对象深度对比复杂 所以这里使用字符串传递
				// bookRead.vue 第2710行使用了对比
				const chapterurl = bookurl + "-&-" + dds[i].serialID
				
				// {
				// 	"Scene": "chapter",
				// 	"ContentAnchorBatch": [{
				// 		"BookID": bookurl,
				// 		"ChapterSeqNo": [dds[i].serialID]
				// 	}]
				// };
				const chaptername = dds[i].serialName;

				chapter.push({
					chapterurl: chapterurl,
					chaptername: chaptername,
				});
			}

			book.chapters = chapter;

			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},
	homePage5: async (bookurl) => {
		let url = bookurl

		// #ifdef H5
		url = extractHostname(url)
		// #endif

		try {
			let book = {
				intro: "",
				chapters: [],
			}
			const res = await uni.request({
				url: url,
				method: 'GET'
			});
			const doc = new HTMLParser(res.data.toString().trim());
			// 获取简介
			const intro = doc.getElementsByClassName('intro');
			const text = intro[0]["innerHTML"]


			// 使用www一次性全部获取（就是无法获得标题）
			let chapurl = bookurl.replace(/web/, 'www');
			let chapter = [];

			const newres = await uni.request({
				url: chapurl,
				method: "GET"
			})

			const chapdoc = new HTMLParser(newres.data.toString().trim());
			const clist = chapdoc.getElementsByClassName("col-md-3")

			for (let i = 0; i < clist.length; i++) {
				let dd = clist[i]["innerHTML"];

				// 提取章节URL
				const urlRegex = /href="(.*?)"/;
				const urlMatch = dd.match(urlRegex);
				let chapterurl = urlMatch ? urlMatch[1] : '';
				// 有的是有开头了不用自己加，没有的才加一下
				if (!chapterurl.startsWith('http')) {
					chapterurl = 'https://web.biqugeone.com' + chapterurl;
				} else {
					chapterurl = chapterurl.replace(/www/, 'web');
				}
				const chaptername = "第" + (i + 1) + "章"
				chapter.push({
					chapterurl: chapterurl,
					chaptername: chaptername,
				});
			}

			book.intro = text;
			book.chapters = chapter;
			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},
	homePage6: async (bookurl) => {
		let url = bookurl

		// #ifdef H5
		url = extractHostname(url)
		// #endif

		try {
			let book = {
				intro: "",
				chapters: [],
			}
			const res = await uni.request({
				url: url,
				method: 'GET'
			});
			const doc = new HTMLParser(res.data.toString().trim());
			// 获取简介
			const intro = doc.getElementById('intro')["innerHTML"];
			const text = intro;

			// 获取目录
			const list = new HTMLParser(doc.getElementById("list").innerHTML);
			const dds = list.getElementsByTagName("li");
			let chapter = [];

			for (let i = 0; i < dds.length - 1; i++) {
				let dd = dds[i]['innerHTML'];
				// 提取章节URL
				const urlRegex = /href="(.*?)"/;
				const urlMatch = dd.match(urlRegex);
				const chapterurl = urlMatch ? urlMatch[1] : '';

				// 提取章节名称
				const textRegex = />(.*?)<\/a>/;
				const textMatch = dd.match(textRegex);
				const chaptername = textMatch ? textMatch[1] : '';

				chapter.push({
					chapterurl: "https://www.biquge66.net" + chapterurl,
					chaptername: chaptername,
				});
			}

			book.intro = text;
			book.chapters = chapter;

			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},

	homePage7: async (bookurl) => {
		try {
			let url = bookurl
			// 创建一个新的 URL 对象
			// let parsedUrl = new URL(url);
			// console.log(parsedUrl);
			// 获取主站名(书源)
			let parsedOrigin = getOriginsUrl(url)
			// #ifdef H5
			url = extractHostname(url)
			// #endif

			let book = {
				intro: "",
				chapters: [],
			}

			const res = await uni.request({
				url: url,
				method: 'GET'
			});

			const doc = new HTMLParser(res.data.toString().trim());
			// 获取简介
			const intro = doc.getElementsByClassName("xdesc")[0]["innerHTML"];
			const text = intro;

			// 获取目录
			const list = new HTMLParser(doc.getElementsByClassName("section-list")[1].innerHTML);
			const dds = list.getElementsByTagName("li");
			let chapter = [];

			for (let i = 0; i < dds.length - 1; i++) {
				let dd = new HTMLParser(dds[i]['innerHTML']);

				const chapterurl = dd.getElementsByTagName("a")[0].attributes.href;

				const chaptername = dd.getElementsByTagName("a")[0].innerHTML;

				chapter.push({
					chapterurl: parsedOrigin + chapterurl,
					chaptername: chaptername,
				});
			}

			// 获取imgurl
			book.imgurl = doc.getElementsByTagName("img")[0].attributes.src
			book.intro = text;
			book.chapters = chapter;

			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},

	homePage8: async (bookurl) => {
		let url = bookurl

		// #ifdef H5
		url = extractHostname(url)
		// #endif

		try {
			let book = {
				intro: "",
				chapters: [],
			}
			const res = await uni.request({
				url: url,
				method: 'GET'
			});
			const doc = new HTMLParser(res.data.toString().trim());

			// 这个书源没有封面，先获取封面
			const img = new HTMLParser(doc.getElementsByClassName('imgbox')[0]["innerHTML"]);
			const imgurl = img.getElementsByTagName("img")[0].attributes.src;

			// 获取简介
			const intro = doc.getElementsByClassName('xs-show')[3]["innerHTML"];
			const text = intro.replace(/<strong>简介:<\/strong>/, '');
			// 获取目录
			const list = new HTMLParser(doc.getElementsByClassName("section-box")[1][
				"innerHTML"
			]);
			const dds = list.getElementsByTagName("li");
			let chapter = [];

			for (let i = 0; i < dds.length; i++) {
				let dd = dds[i]['innerHTML'];
				// 提取章节URL
				const urlRegex = /href="(.*?)"/;
				const urlMatch = dd.match(urlRegex);
				const chapterurl = urlMatch ? urlMatch[1] : '';

				// 提取章节名称
				const textRegex = />(.*?)<\/a>/;
				const textMatch = dd.match(textRegex);
				const chaptername = textMatch ? textMatch[1] : '';

				chapter.push({
					chapterurl: url + chapterurl,
					chaptername: chaptername,
				});
			}

			book.imgurl = imgurl;
			book.intro = text;
			book.chapters = chapter;
			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},

	homePage9: async (bookurl) => {
		let url = bookurl

		let parsedOrigin = getOriginsUrl(url)

		// #ifdef H5
		url = extractHostname(url)
		// #endif

		try {
			let book = {
				intro: "",
				chapters: [],
			}

			const res = await uni.request({
				url: url,
				method: 'GET'
			});
			const doc = new HTMLParser(res.data.toString().trim());


			// 这个书源没有封面，先获取封面
			// const img = new HTMLParser(doc.getElementsByClassName('imgbox')[0]["innerHTML"]);
			const imgurl = doc.getElementsByTagName("img")[0].attributes.src;
			// 获取简介
			const intro = doc.getElementsByClassName("hidden-xs")[3].innerHTML;
			const text = intro;

			// 获取目录
			const list = new HTMLParser(doc.getElementsByClassName("panel-chapterlist")[0][
				"innerHTML"
			]);
			const dds = list.getElementsByClassName("col-sm-3");
			let chapter = [];

			for (let i = 0; i < dds.length; i++) {
				let dd = dds[i]['innerHTML'];
				// 提取章节URL
				const urlRegex = /href="(.*?)"/;
				const urlMatch = dd.match(urlRegex);
				const chapterurl = urlMatch ? urlMatch[1] : '';

				// 提取章节名称
				const textRegex = />(.*?)<\/a>/;
				const textMatch = dd.match(textRegex);
				const chaptername = textMatch ? textMatch[1] : '';

				chapter.push({
					chapterurl: parsedOrigin + chapterurl,
					chaptername: chaptername,
				});
			}

			book.imgurl = imgurl;
			book.intro = text;
			book.chapters = chapter;
			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},

	homePage10: async (bookurl) => {
		let url = bookurl
		let parsedOrigin = getOriginsUrl(url)

		// #ifdef H5
		url = extractHostname(url)
		// #endif

		try {
			let book = {
				intro: "",
				chapters: [],
			}
			const res = await uni.request({
				url: url,
				method: 'GET'
			});
			const doc = new HTMLParser(res.data.toString().trim());

			// 这个书源没有封面，先获取封面
			// const img = new HTMLParser(doc.getElementsByClassName('imgbox')[0]["innerHTML"]);
			const imgurl = ""

			// 获取简介
			const intro = "简介：空";
			const text = intro;

			// 获取目录
			const list = new HTMLParser(doc.getElementById("booklistBox")[
				"innerHTML"
			]);
			const dds = list.getElementsByTagName("li")
			let chapter = [];

			for (let i = 0; i < dds.length; i++) {
				let dd = dds[i]['innerHTML'];
				// 提取章节URL
				const urlRegex = /href="(.*?)"/;
				const urlMatch = dd.match(urlRegex);
				const chapterurl = urlMatch ? urlMatch[1] : '';

				// 提取章节名称
				const textRegex = />(.*?)<\/a>/;
				const textMatch = dd.match(textRegex);
				const chaptername = textMatch ? textMatch[1] : '';

				chapter.push({
					chapterurl: parsedOrigin + chapterurl,
					chaptername: chaptername,
				});
			}

			book.imgurl = imgurl;
			book.intro = text;
			book.chapters = chapter;
			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},

	homePage11: async (bookurl) => {
		let url = bookurl
		// www页面目录有缺失
		let parsedOrigin = getOriginsUrl(url).replace("www", "m");
		url = parsedOrigin + "/indexlist/" + /\d+/g.exec(bookurl)[0];

		// #ifdef H5
		url = extractHostname(url)
		// #endif

		try {
			let book = {
				intro: "",
				chapters: [],
			}
			let chapter = [];

			let urls = [];
			const urlres = await uni.request({
				url: url,
				method: 'GET'
			});
			const urldoc = new HTMLParser(urlres.data.toString().trim());
			const urllist = new HTMLParser(urldoc.getElementById("indexselect").innerHTML)
				.getElementsByTagName("option")
			for (let i = 0; i < urllist.length; i++) {
				urls.push({
					url: parsedOrigin + urllist[i].attributes.value,
					urlid: i
				})
			}

			const requests = urls.map(async config => {
				console.log(config.urlid);
				try {
					const res = await uni.request({
						url: config.url,
						method: 'GET'
					});
					console.log(config.urlid);
					const doc = new HTMLParser(res.data.toString().trim());
					// 获取目录
					const list = new HTMLParser(doc.getElementsByClassName("mt0")[0].innerHTML);
					const dds = list.getElementsByTagName("li")

					for (let i = 0; i < dds.length; i++) {
						let dd = dds[i]['innerHTML'];
						// console.log(dd);
						// 提取章节URL
						const urlRegex = /href="(.*?)"/;
						const urlMatch = dd.match(urlRegex);
						const chapterurl = urlMatch ? urlMatch[1] : '';

						// 提取章节名称
						const textRegex = />(.*?)<\/a>/;
						const textMatch = dd.match(textRegex);
						const chaptername = textMatch ? textMatch[1] : '';

						chapter.push({
							chapterurl: parsedOrigin + chapterurl,
							chaptername: chaptername,
							chapterid: config.urlid * 1007 + i,
						});
					}
				} catch (error) {
					console.error("Error occurred while fetching book details:", error);
					throw error; // 在Promise链中抛出错误，以便在Promise.all的catch中捕获  
				}
			});

			return Promise.all(requests)
				.then(results => {
					const imgurl = ""

					// 获取简介
					const intro = "简介：空";
					const text = intro;

					book.imgurl = imgurl;
					book.intro = text;

					chapter.sort((a, b) => {
						return Number(a.chapterid) - Number(b.chapterid);
					});
					// 清除临时的id属性
					for (let i = 0; i < chapter.length; i++) {
						delete chapter[i].chapterid
					}

					book.chapters = chapter;

					return book;
				})
				.catch(error => {
					console.log("请求错误:", error);
					return -1;
				});

			// for (let u = 0; u < urls.length; u++) {
			// 	const res = await uni.request({
			// 		url: urls[u],
			// 		method: 'GET'
			// 	});
			// 	const doc = new HTMLParser(res.data.toString().trim());
			// 	// 获取目录
			// 	const list = new HTMLParser(doc.getElementsByClassName("mt0")[0][
			// 		"innerHTML"
			// 	]);
			// 	const dds = list.getElementsByTagName("li")

			// 	for (let i = 0; i < dds.length; i++) {
			// 		let dd = dds[i]['innerHTML'];
			// 		// console.log(dd);
			// 		// 提取章节URL
			// 		const urlRegex = /href="(.*?)"/;
			// 		const urlMatch = dd.match(urlRegex);
			// 		const chapterurl = urlMatch ? urlMatch[1] : '';

			// 		// 提取章节名称
			// 		const textRegex = />(.*?)<\/a>/;
			// 		const textMatch = dd.match(textRegex);
			// 		const chaptername = textMatch ? textMatch[1] : '';

			// 		chapter.push({
			// 			chapterurl: parsedOrigin + chapterurl,
			// 			chaptername: chaptername,
			// 		});
			// 	}
			// }

		} catch (e) {
			console.log(e);
			return -1;
		}
	},

	homePage12: async (bookurl) => {
		let url = bookurl
		let parsedOrigin = getOriginsUrl(url).replace("www", "m")
		// #ifdef H5
		url = extractHostname(url)
		// #endif

		try {
			let book = {
				intro: "",
				chapters: [],
			}
			let chapter = [];

			const res = await uni.request({
				url: url,
				method: 'GET'
			});
			// console.log(res.data);
			const doc = new HTMLParser(res.data.toString().trim());
			// 获取目录
			const list = new HTMLParser(doc.getElementsByClassName("chapter")[0][
				"innerHTML"
			]);
			const dds = list.getElementsByTagName("li")

			for (let i = 0; i < dds.length; i++) {
				let dd = dds[i]['innerHTML'];
				// console.log(dd);
				// 提取章节URL
				const urlRegex = /href="(.*?)"/;
				const urlMatch = dd.match(urlRegex);
				const chapterurl = urlMatch ? urlMatch[1] : '';

				// 提取章节名称
				const textRegex = />(.*?)<\/a>/;
				const textMatch = dd.match(textRegex);
				const chaptername = textMatch ? textMatch[1] : '';

				chapter.push({
					chapterurl: parsedOrigin + chapterurl,
					chaptername: chaptername,
				});
			}

			// 获取简介
			const intro = new HTMLParser(doc.getElementsByClassName("lb_jj")[0].innerHTML)
				.getElementsByTagName("div")[3].innerHTML;
			const text = intro;

			book.intro = text;
			book.chapters = chapter.reverse();
			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},

	homePage13: async (bookurl) => {
		let url = bookurl.replace("book", "list")
		let parsedOrigin = getOriginsUrl(url)
		// #ifdef H5
		url = extractHostname(url)
		// #endif

		try {
			let book = {
				intro: "",
				chapters: [],
			}
			let chapter = [];

			let urls = [];
			const urlres = await uni.request({
				url: url,
				method: 'GET'
			});
			const urldoc = new HTMLParser(urlres.data.toString().trim());
			const urllist = new HTMLParser(urldoc.getElementById("indexselect").innerHTML)
				.getElementsByTagName("option")

			for (let i = 0; i < urllist.length; i++) {
				urls.push({
					url: parsedOrigin + urllist[i].attributes.value,
					urlid: i
				})
			}

			const requests = urls.map(async config => {
				console.log(config.urlid);
				try {
					const res = await uni.request({
						url: config.url,
						method: 'GET'
					});
					console.log(config.urlid);
					const doc = new HTMLParser(res.data.toString().trim());
					// 获取目录
					const list = new HTMLParser(doc.getElementById("content_1").innerHTML)
					const dds = list.getElementsByTagName("a")

					for (let i = 0; i < dds.length; i++) {
						let dd = dds[i]['outerHTML'];
						// console.log(dd);
						// 提取章节URL
						const urlRegex = /href="(.*?)"/;
						const urlMatch = dd.match(urlRegex);
						const chapterurl = urlMatch ? urlMatch[1] : '';

						// 提取章节名称
						const textRegex = />(.*?)<\/a>/;
						const textMatch = dd.match(textRegex);
						const chaptername = textMatch ? textMatch[1] : '';

						chapter.push({
							chapterurl: parsedOrigin + chapterurl,
							chaptername: chaptername.replace(/<[^>]*>/g, ""),
							chapterid: config.urlid * 1007 + i,
						});
					}
				} catch (error) {
					console.error("Error occurred while fetching book details:", error);
					throw error; // 在Promise链中抛出错误，以便在Promise.all的catch中捕获  
				}
			});

			return Promise.all(requests)
				.then(results => {
					const imgurl = ""

					// 获取简介
					const intro = "简介：空";
					const text = intro;
					book.intro = text;

					chapter.sort((a, b) => {
						return Number(a.chapterid) - Number(b.chapterid);
					});
					// 清除临时的id属性
					for (let i = 0; i < chapter.length; i++) {
						delete chapter[i].chapterid
					}

					book.chapters = chapter;

					return book;
				})
				.catch(error => {
					console.log("请求错误:", error);
					return -1;
				});

			// for (let i = 0; i < urllist.length; i++) {
			// 	urls.push(parsedOrigin + urllist[i].attributes.value)
			// }

			// for (let u = 0; u < urls.length; u++) {
			// 	const res = await uni.request({
			// 		url: urls[u],
			// 		method: 'GET'
			// 	});
			// 	const doc = new HTMLParser(res.data.toString().trim());
			// 	// 获取目录
			// 	const list = new HTMLParser(doc.getElementById("content_1").innerHTML)
			// 	const dds = list.getElementsByTagName("a")

			// 	for (let i = 0; i < dds.length; i++) {
			// 		let dd = dds[i]['outerHTML'];
			// 		// console.log(dd);
			// 		// 提取章节URL
			// 		const urlRegex = /href="(.*?)"/;
			// 		const urlMatch = dd.match(urlRegex);
			// 		const chapterurl = urlMatch ? urlMatch[1] : '';

			// 		// 提取章节名称
			// 		const textRegex = />(.*?)<\/a>/;
			// 		const textMatch = dd.match(textRegex);
			// 		const chaptername = textMatch ? textMatch[1] : '';

			// 		chapter.push({
			// 			chapterurl: parsedOrigin + chapterurl,
			// 			chaptername: chaptername.replace(/<[^>]*>/g, ""),
			// 		});
			// 	}
			// }
			// 获取简介
			// const intro = "简介：空";
			// const text = intro;

			// book.intro = text;
			// book.chapters = chapter;
			// return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},

	homePage14: async (bookurl) => {
		let url = bookurl
		let parsedOrigin = getOriginsUrl(url)
		// #ifdef H5
		url = extractHostname(url)
		// #endif

		try {
			let book = {
				intro: "",
				chapters: [],
			}
			let chapter = [];

			const res = await uni.request({
				url: url,
				method: 'GET'
			});

			const doc = new HTMLParser(res.data.toString().trim());

			// 获取目录
			const list = new HTMLParser(doc.getElementById('list').innerHTML);
			const dds = list.getElementsByTagName("dd")
			let i = 0;
			if (dds.length < 12) {
				i = dds.length / 2;
			} else {
				i = 12;
			}
			for (i; i < dds.length; i++) {
				let dd = dds[i]['innerHTML'];
				// console.log(dd);
				// 提取章节URL
				const urlRegex = /href="(.*?)"/;
				const urlMatch = dd.match(urlRegex);
				const chapterurl = urlMatch ? urlMatch[1] : '';

				// 提取章节名称
				const textRegex = />(.*?)<\/a>/;
				const textMatch = dd.match(textRegex);
				const chaptername = textMatch ? textMatch[1] : '';

				chapter.push({
					chapterurl: parsedOrigin + chapterurl,
					chaptername: chaptername,
				});
			}

			// 获取简介
			const intro = doc.getElementById('intro').innerHTML;
			const text = intro;

			book.imgurl = doc.getElementsByTagName("img")[0].attributes.src
			book.intro = text;
			book.chapters = chapter
			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},

	homePage15: async (bookurl) => {
		// 只获取id
		bookurl = bookurl.replace("https://wechat.idejian.com", "");
		let url = 'https://wechat.idejian.com/api/wechat/allcatalog/' + bookurl
		/*
		该api返回格式为：
		{
		    "code": 0,
		    "msg": "ok",
		    "body": {
		        "chapterList": [],
		        "bookInfo": {
		            "chapterCount": 0
		        }
		    }
		}
		*/

		try {
			let book = {
				chapters: [],
			}
			let chapter = [];

			const res = await uni.request({
				url: url,
				method: 'GET'
			});

			let dds = res.data.body.chapterList;

			for (let i = 0; i < dds.length; i++) {

				// 提取章节URL
				const chapterurl = "https://wechat.idejian.com/api/wechat/book/" + bookurl + "/" + dds[i].id;

				// 提取章节名称
				const chaptername = dds[i].name;

				chapter.push({
					chapterurl: chapterurl,
					chaptername: chaptername,
				});
			}

			book.chapters = chapter
			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},

	homePage16: async (bookurl) => {
		// 只获取id
		bookurl = bookurl.replace("http://download.maoyankanshu.la", "");
		let url = 'http://api.jxgtzxc.com/novel/' + bookurl + '/chapters'
		let novelurl = 'http://api.jxgtzxc.com/novel/' + bookurl;
		/*
		该api返回格式为：
		{
		    "request_id": "dc4009e5-747f-48cd-9463-1b31cf313c76",
		    "msg": "success",
		    "code": 200,
		    "data":{}
		}
		需要解密
		const secretKey = "f041c49714d39908"; // 16字节密钥，对应128位AES加密  
		const cipherMode = "AES/CBC/PKCS7"; 
		const iv = "0123456789abcdef"; // 初始化向量，应该是16字节长  
		*/
		try {
			let book = {
				intro: "",
				chapters: [],
			}
			let chapter = [];

			let res = await uni.request({
				url: url,
				method: 'GET',
				header: {
					"User-Agent": "okhttp/4.9.2",
					"client-device": "LND-AL40",
					"client-version": "2.2.0",
					"client-brand": "HONOR",
					"client-source": "android",
					"client-name": "app.maoyankanshu.novel",
					"Authorization": "bearereyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuam1sbGRzYy5jb21cL2F1dGhcL3RoaXJkIiwiaWF0IjoxNjY1OTU4NzE0LCJleHAiOjE3NTkyNzA3MTQsIm5iZiI6MTY2NTk1ODcxNCwianRpIjoiTzdkNGZXZGo4b3JEZVBTbCIsInN1YiI6MjEwMjgsInBydiI6ImExY2IwMzcxODAyOTZjNmExOTM4ZWYzMGI0Mzc5NDY3MmRkMDE2YzUifQ.QIK10Tnkc25NqBE0XW7CgdHUZFFpEY1hS7s9yxJF378"
				}
			});

			let dds = res.data.data.list;

			for (let i = 0; i < dds.length; i++) {

				// 提取章节URL
				const chapterurl = aesBase64DecodeToString(dds[i].path);

				// 提取章节名称
				const chaptername = dds[i].chapterName;

				chapter.push({
					chapterurl: chapterurl,
					chaptername: chaptername,
				});
			}
			// 获取简介
			res = await uni.request({
				url: novelurl,
				method: 'GET',
				header: {
					"User-Agent": "okhttp/4.9.2",
					"client-device": "LND-AL40",
					"client-version": "2.2.0",
					"client-brand": "HONOR",
					"client-source": "android",
					"client-name": "app.maoyankanshu.novel",
					"Authorization": "bearereyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuam1sbGRzYy5jb21cL2F1dGhcL3RoaXJkIiwiaWF0IjoxNjY1OTU4NzE0LCJleHAiOjE3NTkyNzA3MTQsIm5iZiI6MTY2NTk1ODcxNCwianRpIjoiTzdkNGZXZGo4b3JEZVBTbCIsInN1YiI6MjEwMjgsInBydiI6ImExY2IwMzcxODAyOTZjNmExOTM4ZWYzMGI0Mzc5NDY3MmRkMDE2YzUifQ.QIK10Tnkc25NqBE0XW7CgdHUZFFpEY1hS7s9yxJF378"
				}
			});

			book.intro = res.data.data.summary;
			book.chapters = chapter
			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},

}

export default getHomePage