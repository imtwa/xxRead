import HTMLParser from "@/uni_modules/html-parser/js_sdk/index.js"
import origins from '@/api/getNetwork/origins.json'

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

const getSearch = {

	search0: async (keyword) => {
		const origin = "http://www.qiushu.info";
		let url = "http://www.qiushu.info/search.php";

		// #ifdef H5  
		url = extractHostname(url) //"/qiushu/search.php"
		// #endif  

		try {
			const res = await uni.request({
				url: url,
				method: "POST",
				data: {
					searchkey: keyword
				},
			});
			const doc = new HTMLParser(res.data.toString().trim());
			const ui = new HTMLParser(doc.getElementsByClassName("read_list")[0]["innerHTML"]);
			const trList = ui.getElementsByTagName('li');

			let book = [];
			for (let i = 0; i < trList.length; i++) {
				const trdoc = new HTMLParser(trList[i]['innerHTML']);
				// 获取封面  
				const trimg = trdoc.getElementsByTagName('img')[0];
				const imgurl = trimg.attributes.src;
				// 获取链接和作者  
				const spant1 = trdoc.getElementsByClassName("t1")[0]["innerHTML"];
				const patternt1 = /<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>/;
				const matcht1 = spant1.match(patternt1);
				// 获取书籍链接和书名  
				const bookurl = matcht1[1];
				const bookname = matcht1[2].replace(/《|》/g, '').replace(/\s/g, "");
				// 获取作者  
				const spant2 = trdoc.getElementsByClassName("t2")[0]["innerHTML"];
				const patternt2 = /作者：([^<]+)/;
				const matcht2 = spant2.match(patternt2);
				const author = matcht2[1].replace(/\s/g, "");

				book.push({
					imgurl: imgurl,
					bookurl: origin + bookurl,
					bookname: bookname,
					author: author,
					origin: origin,
				});
			}
			//赋值找到的书籍列表  
			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},

	search1: async (keyword) => {
		const origin = "http://www.paoshu8.info";
		let url = "http://www.paoshu8.info/modules/article/search.php";

		// #ifdef H5  
		url = extractHostname(url)
		// #endif  

		try {
			const res = await uni.request({
				url: url,
				method: "GET",
				data: {
					searchkey: keyword
				},
			});
			const doc = new HTMLParser(res.data.toString().trim());
			const trList = doc.getElementsByTagName('tr');
			let book = [];

			if (trList.length > 1) {
				for (let i = 1; i < trList.length; i++) {
					const trdoc = new HTMLParser(trList[i]['innerHTML']);
					const trodd = trdoc.getElementsByClassName('odd');

					const tra = trodd[0]['innerHTML'];

					// 提取URL
					const urlRegex = /href="(.*?)"/;
					const urlMatch = tra.match(urlRegex);
					const bookurl = urlMatch ? urlMatch[1] : '';

					// 提取文本
					const textRegex = />(.*?)<\/a>/;
					const textMatch = tra.match(textRegex);
					const bookname = textMatch ? textMatch[1].replace(/\s/g, "") : '';
					// 提取作者
					const author = trodd[1]['innerHTML'].replace(/\s/g, "");

					// 获取图片的url
					const imgRegex = /\/(\d+)_(\d+)\//;
					const imgMatch = bookurl.match(imgRegex);
					const imgurl =
						`http://www.paoshu8.info/files/article/image/${imgMatch[1]}/${imgMatch[2]}/${imgMatch[2]}s.jpg`;

					let tags = [];
					// 字数 分类
					tags.push(trdoc.getElementsByClassName("even")[1].innerHTML + "字")
					tags.push(trdoc.getElementsByClassName("even")[2].innerHTML)


					book.push({
						imgurl: imgurl,
						bookurl: bookurl,
						bookname: bookname,
						author: author,
						origin: origin,
						tags: tags
					});

				}
			}
			return book;

		} catch (e) {
			console.log(e);
			return -1;
		}
	},
	search2: async (keyword) => {
		// 这个网站搜索界面没有封面
		const origin = "http://www.caz178.com";
		let url = "http://www.caz178.com/ar.php";
		// #ifdef H5
		url = extractHostname(url)
		// #endif

		try {
			const res = await uni.request({
				url: url,
				method: "GET",
				data: {
					keyWord: keyword
				},
			});

			const doc = new HTMLParser(res.data.toString().trim());
			const ui = new HTMLParser(doc.getElementsByClassName("txt-list-row5")[0][
				"innerHTML"
			]);
			const trList = ui.getElementsByTagName('li');
			let book = [];
			// 该网站下标从1开始
			for (let i = 1; i < trList.length; i++) {
				const trdoc = new HTMLParser(trList[i]['innerHTML']);
				// 获取封面
				const imgurl = "";
				// 获取链接和作者
				const spant1 = trdoc.getElementsByTagName("a")[0];
				const bookurl = spant1.attributes.href;
				const bookname = spant1["innerHTML"].replace(/\s/g, "");
				// 获取作者
				const spant2 = trdoc.getElementsByClassName("s4")[0]["innerHTML"].replace(/\s/g, "");
				const author = spant2;

				book.push({
					imgurl: imgurl,
					bookurl: origin + bookurl,
					bookname: bookname,
					author: author,
					origin: origin,
				});
			}
			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},
	search3: async (keyword) => {
		const origin = "https://www.sypvm.com";
		let url = "https://www.sypvm.com/api/search?";
		// #ifdef H5
		url = extractHostname(url)
		// #endif
		try {
			const res = await uni.request({
				url: url,
				method: "GET",
				data: {
					q: keyword
				},
			});
			const search = res.data.data.search;
			let book = [];
			for (let i = 0; i < search.length; i++) {
				const regex = /<b\s*style="color:red">|<\/b>/g;

				let imgurl = origin + search[i].cover;
				let bookurl = origin + search[i].book_list_url;
				let bookname = search[i].book_name.replace(regex, '').replace(/\s/g, "");
				let author = search[i].author.replace(regex, '').replace(/\s/g, "");
				book.push({
					imgurl: imgurl,
					bookurl: bookurl,
					bookname: bookname,
					author: author,
					origin: origin,
				});
			}
			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}

	},
	search4: async (keyword) => {
		const origin = "https://bookshelf.html5.qq.com";
		let url = 'https://newopensearch.reader.qq.com/wechat'

		try {
			const num = 20;
			let page = 1;
			let book = [];
			while (true) {
				let start = (page - 1) * num;
				let end = page * num - 1;
				const res = await uni.request({
					url: url,
					method: "GET",
					data: {
						keyword: keyword,
						start: start,
						end: end
					}
				})

				if (page > 10) {
					break
				}

				page = page + 1;

				if (res.data.booklist) {
					const search = res.data.booklist;

					for (let i = 0; i < search.length; i++) {

						let s = search[i].bid;
						let a = s.slice(-3)
						let n = "";
						if (a < 10) {
							n = s.slice(-1)
						} else if (a < 100) {
							n = s.slice(-2)
						} else {
							n = a
						}

						let imgurl = "http://wfqqreader-1252317822.image.myqcloud.com/cover/" + n + "/" + s +
							"/b_" + s + ".jpg";

						let id = 1100000000 + parseInt(search[i].bid)
						// 加上书源 否则id可能和其它书源的url重复
						let bookurl = origin + id;
						let bookname = search[i].title
						let author = search[i].author
						let intro = search[i].intro;
						let tags = [];

						let categoryInfoV4 = search[i].categoryInfoV4;
						categoryInfoV4 = categoryInfoV4.split(",")[2].split(":")[1];

						tags.push(categoryInfoV4)

						if (search[i].totalWords) {
							if (search[i].totalWords > 10000) {
								let word = (search[i].totalWords / 10000)
									.toFixed(2)
								tags.push(word + "万字")
							} else {
								tags.push(search[i].totalWords + "字")
							}
						}
						book.push({
							imgurl: imgurl,
							bookurl: bookurl,
							bookname: bookname,
							author: author,
							origin: origin,
							intro: intro,
							tags: tags,
						});
					}
				} else {
					break;
				}
			}

			//赋值找到的书籍列表  
			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},
	search5: async (keyword) => {
		const origin = "";
		let url = ""

		try {
			const res = await uni.request({
				url: url,
				method: "GET",
				data: {
					searchkey: keyword
				},
			});
			const doc = new HTMLParser(res.data.toString().trim());
			const trList = doc.getElementsByTagName('dl');

			let book = [];
			if (trList.length > 0) {
				for (let i = 0; i < trList.length; i++) {

					let htmlCode = trList[i]['innerHTML'];

					// 提取图片URL
					const imgRegex = /<img src="(.*?)"[^>]*>/;
					const imgMatch = htmlCode.match(imgRegex);
					const imgurl = imgMatch ? imgMatch[1] : '';

					// 提取书籍URL
					const bookRegex = /href="(.*?)"/;
					const bookMatch = htmlCode.match(bookRegex);
					let bookurl = bookMatch ? bookMatch[1] : '';
					// 获取到书籍主页 https://web.biqugeone.com/book/47842/11582177.html
					// 只要47842 再拼接成https://www.biqugeone.com/info/47842.html

					const bookurlregex = /\/book\/(\d+)\//;
					const bookurlmatch = bookurl.match(bookurlregex);
					const extractedId = bookurlmatch ? bookurlmatch[1] : "";
					bookurl = extractedId + ".html"

					// 提取书籍名称
					const booknameRegex = /<dt>(.*?)<\/dt>/;
					const booknameMatch = htmlCode.match(booknameRegex);
					const bookname = booknameMatch ? booknameMatch[1].replace(/\s/g, "") : '';

					// 提取作者
					const authorRegex = /\[作者\]：<span>(.*?)<\/span>/;
					const authorMatch = htmlCode.match(authorRegex);
					const author = authorMatch ? authorMatch[1].replace(/\s/g, "") : '';


					book.push({
						imgurl: imgurl,
						bookurl: bookurl,
						bookname: bookname,
						author: author,
						origin: origin
					});

				}
			}
			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},
	search6: async (keyword) => {

		const origin = "https://www.biquge66.net";
		let url = "https://www.biquge66.net/search";

		//浏览器端有跨域请求，需进行判断
		// #ifdef H5
		url = extractHostname(url)
		// #endif
		try {
			const res = await uni.request({
				url: url,
				method: "GET",
				data: {
					searchkey: keyword
				},
			});
			const doc = new HTMLParser(res.data.toString().trim());
			const trList = doc.getElementsByClassName('item');

			let book = [];
			if (trList.length > 0) {
				for (let i = 0; i < trList.length; i++) {
					const trdoc = new HTMLParser(trList[i]['innerHTML']);

					// 获取链接和书名
					const bookurl = origin + trdoc.getElementsByTagName("a")[0].attributes
						.href;
					const bookname = trdoc.getElementsByTagName("a")[0].attributes.title;

					// 获取作者  
					const author = trdoc.getElementsByTagName("a")[2].attributes.title;
					// 获取封面  
					// 获取图片的url
					const imgurl = trdoc.getElementsByTagName("img")[0].attributes.src

					book.push({
						imgurl: imgurl,
						bookurl: bookurl,
						bookname: bookname,
						author: author,
						origin: origin
					});

				}
			}
			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},
	search7: async (keyword) => {

		const origin = "http://www.dule.cc";

		let url = origin + `/ar.php?keyWord=${keyword}`;

		//浏览器端有跨域请求，需进行判断
		// #ifdef H5
		url = extractHostname(url)
		// #endif
		try {
			const res = await uni.request({
				url: url,
				method: "GET"
			});
			const doc = new HTMLParser(res.data.toString().trim());
			const ui = new HTMLParser(doc.getElementsByClassName("txt-list")[0][
				'innerHTML'
			]);
			const trList = ui.getElementsByTagName('li');

			let book = [];
			if (trList.length > 0) {
				for (let i = 1; i < trList.length; i++) {
					const trdoc = new HTMLParser(trList[i]['innerHTML']);
					// 获取链接和书名
					const bookurl = origin + trdoc.getElementsByTagName("a")[0]
						.attributes
						.href;
					const bookname = trdoc.getElementsByTagName("a")[0].innerHTML;
					// 获取作者  
					const author = trdoc.getElementsByClassName("s4")[0].innerHTML;
					// 获取封面  
					// 获取图片的url
					const imgurl = ""

					let tags = [];
					// 分类
					tags.push(trdoc.getElementsByClassName("s1")[0].innerHTML)

					book.push({
						imgurl: imgurl,
						bookurl: bookurl,
						bookname: bookname,
						author: author,
						origin: origin,
						tags: tags
					});

				}
			}
			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},
	search8: async (keyword) => {

		const origin = "http://www.lidapoly.com";

		let url = origin + `/ar.php?KeyWord=${keyword}`;

		//浏览器端有跨域请求，需进行判断
		// #ifdef H5
		url = extractHostname(url)
		// #endif
		try {
			const res = await uni.request({
				url: url,
				method: "GET",
				data: {
					searchkey: keyword
				},
			});
			const doc = new HTMLParser(res.data.toString().trim());
			const ui = new HTMLParser(doc.getElementsByClassName("txt-list-row5")[0]
				[
					"innerHTML"
				]);
			const trList = ui.getElementsByTagName('li');
			let book = [];
			// 该网站下标从1开始
			for (let i = 1; i < trList.length; i++) {
				const trdoc = new HTMLParser(trList[i]['innerHTML']);
				// 获取封面
				const imgurl = "";
				// 获取链接和作者
				const spant1 = trdoc.getElementsByTagName("a")[0];
				const bookurl = spant1.attributes.href;
				const bookname = spant1["innerHTML"].replace(/\s/g, "");
				// 获取作者
				const spant2 = trdoc.getElementsByClassName("s4")[0]["innerHTML"]
					.replace(/\s/g, "");
				const author = spant2;

				book.push({
					imgurl: imgurl,
					bookurl: origin + bookurl,
					bookname: bookname,
					author: author,
					origin: origin,
				});
			}
			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},
	search9: async (keyword) => {

		const origin = "https://www.babazw.com";

		let url = "https://www.babazw.com/plus/search.php?keyword=" + keyword;

		//浏览器端有跨域请求，需进行判断
		// #ifdef H5
		url = extractHostname(url)
		// #endif
		try {
			const res = await uni.request({
				url: url,
				method: "GET"
			});
			const doc = new HTMLParser(res.data.toString().trim());
			const ui = new HTMLParser(doc.getElementsByClassName("panel-body")[
				0][
				"innerHTML"
			]);
			const trList = ui.getElementsByClassName('book-coverlist');
			let book = [];
			for (let i = 0; i < trList.length; i++) {
				const trdoc = new HTMLParser(trList[i]['innerHTML']);
				// 获取封面
				const imgurl = "";
				// 获取链接和作者
				const spant1 = trdoc.getElementsByTagName("a")[1];
				const bookurl = spant1.attributes.href;

				const bookname = spant1.attributes.title.replace(/\s/g, "");
				// 获取作者
				const spant2 = trdoc.getElementsByClassName("text-muted")[1][
						"innerHTML"
					]
					.replace(/\s/g, "")
					.replace(/<[^>]*>/g, "");

				const author = spant2;

				book.push({
					imgurl: imgurl,
					bookurl: bookurl,
					bookname: bookname,
					author: author,
					origin: origin,
				});
			}
			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},
	search10: async (keyword) => {

		const origin = "http://www.hljcxzj.com";

		let url = "http://www.hljcxzj.com/so/keyword/".replace("keyword",
			keyword);

		//浏览器端有跨域请求，需进行判断
		// #ifdef H5
		url = extractHostname(url)
		// #endif
		try {
			const res = await uni.request({
				url: url,
				method: "GET"
			});
			const doc = new HTMLParser(res.data.toString().trim());
			const ui = new HTMLParser(doc.getElementsByClassName(
					"ul_m_list")[0]
				[
					"innerHTML"
				]);
			const trList = ui.getElementsByTagName('li');
			let book = [];
			for (let i = 0; i < trList.length; i++) {
				const trdoc = new HTMLParser(trList[i]['innerHTML']);
				// 获取封面
				const imgurl = "";
				// 获取链接和作者
				const spant1 = trdoc.getElementsByTagName("a")[1];
				const bookurl = spant1.attributes.href + "/1.html";
				const bookname = spant1.attributes.title.replace(/\s/g, "");
				// 获取作者
				const spant2 = trdoc.getElementsByTagName("a")[3].attributes
					.title.replace(
						/\s/g, "");
				const author = spant2;

				let tags = [];
				// 分类 字数 状态
				tags.push(new HTMLParser(trdoc.getElementsByClassName("c")[
							0]
						.innerHTML)
					.getElementsByTagName(
						"a")[0].attributes.title)
				tags.push(trdoc.getElementsByClassName("words")[0]
					.innerHTML +
					"字")
				tags.push(new HTMLParser(trdoc.getElementsByClassName(
						"abover")[
						0].innerHTML)
					.getElementsByTagName("font")[0].innerHTML)

				book.push({
					imgurl: imgurl,
					bookurl: origin + bookurl,
					bookname: bookname,
					author: author,
					origin: origin,
					tags: tags
				});
			}
			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},
	search11: async (keyword) => {

		const origin = "https://www.maodouzw.com";

		let url =
			"https://www.maodouzw.com/search3?searchkey=keyword&searchtype=all"
			.replace("keyword",
				keyword);

		//浏览器端有跨域请求，需进行判断
		// #ifdef H5
		url = extractHostname(url)
		// #endif
		try {
			const res = await uni.request({
				url: url,
				method: "POST"
			});

			const doc = new HTMLParser(res.data.toString().trim());
			const ui = new HTMLParser(doc.getElementsByClassName(
					"table")[0]
				[
					"innerHTML"
				]);
			const trList = ui.getElementsByTagName('tr');
			let book = [];
			for (let i = 1; i < trList.length; i++) {
				const trdoc = new HTMLParser(trList[i]['innerHTML']);
				// 获取封面
				const imgurl = "";
				// 获取链接和作者
				const spant1 = trdoc.getElementsByTagName("a")[0];
				const bookurl = spant1.attributes.href;
				const bookname = spant1.attributes.title.replace(/\s/g,
					"");
				// 获取作者
				const spant2 = trdoc.getElementsByClassName(
						"text-muted")[1]
					.innerHTML
					.replace(/\s/g, "");
				const author = spant2;

				book.push({
					imgurl: imgurl,
					bookurl: origin + bookurl,
					bookname: bookname,
					author: author,
					origin: origin,
				});
			}
			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},

	search12: async (keyword) => {

		const origin = "https://www.sdhear.com";

		let url = "https://www.sdhear.com/api/search?q=KEYword"
			.replace(
				"KEYword",
				keyword);

		//浏览器端有跨域请求，需进行判断
		// #ifdef H5
		url = extractHostname(url)
		// #endif
		try {
			const res = await uni.request({
				url: url,
				method: "GET"
			});
			let book = [];

			const booksearch = res.data.data.search;
			for (let i = 0; i < booksearch.length; i++) {
				const booksc = booksearch[i];
				let tags = []
				// 分类 状态
				tags.push(booksc.cate_name)
				tags.push(booksc.status_str)
				book.push({
					imgurl: origin + booksc.cover,
					bookurl: origin + booksc.book_list_url,
					bookname: booksc.title.replace(
						/<[^>]*>/g,
						""),
					author: booksc.author.replace(
						/<[^>]*>/g,
						""),
					origin: origin,
					tags: tags
				});
			}

			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},

	search13: async (keyword) => {

		const origin = "http://www.shuyaya.net";

		let url =
			"http://www.shuyaya.net/search/?searchkey=KEYword"
			.replace(
				"KEYword", keyword);

		//浏览器端有跨域请求，需进行判断
		// #ifdef H5
		url = extractHostname(url)
		// #endif
		try {
			const res = await uni.request({
				url: url,
				method: "GET"
			});
			const doc = new HTMLParser(res.data.toString()
				.trim());
			const ui = new HTMLParser(doc.getElementById(
				"hotcontent").innerHTML);
			const trList = ui.getElementsByClassName('item');
			let book = [];
			for (let i = 0; i < trList.length; i++) {
				const trdoc = new HTMLParser(trList[i][
					'innerHTML'
				]);

				// 获取封面
				const imgurl = trdoc.getElementsByClassName(
					"lazy")[
					0].attributes[
					"data-original"];
				// 获取链接和作者
				const spant1 = trdoc.getElementsByTagName("a")[
					0];
				const bookurl = origin + spant1.attributes.href;
				const bookname = spant1.attributes.title
					.replace(
						/\s/g, "");
				// 获取作者
				const spant2 = trdoc.getElementsByTagName("a")[
						2]
					.innerHTML.replace(
						/\s/g, "");
				const author = spant2;

				book.push({
					imgurl: imgurl,
					bookurl: bookurl,
					bookname: bookname,
					author: author,
					origin: origin,
				});
			}
			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},

	search14: async (keyword) => {

		const origin = "http://www.ppxs.net";

		let url =
			"http://www.ppxs.net/search/?searchkey=KEYword"
			.replace(
				"KEYword", keyword);

		//浏览器端有跨域请求，需进行判断
		// #ifdef H5
		url = extractHostname(url)
		// #endif
		try {
			const res = await uni.request({
				url: url,
				method: "POST"
			});
			const doc = new HTMLParser(res.data.toString()
				.trim());
			const ui = new HTMLParser(doc.getElementById(
					"main")
				.innerHTML);
			const trList = ui.getElementsByTagName('li');
			let book = [];
			for (let i = 1; i < trList.length; i++) {
				const trdoc = new HTMLParser(trList[i][
					'innerHTML'
				]);
				// 获取封面
				const imgurl = "";
				// 获取链接和作者
				const spant1 = trdoc.getElementsByTagName(
					"a")[
					0];
				const bookurl = origin + spant1.attributes
					.href;
				const bookname = spant1.innerHTML.replace(
					/\s/g,
					"");
				// 获取作者
				const spant2 = trdoc.getElementsByClassName(
						"s4")[0].innerHTML
					.replace(/\s/g, "");
				const author = spant2;

				let tags = []
				// 分类 状态
				tags.push(trdoc.getElementsByClassName(
						"s1")[0]
					.innerHTML)
				tags.push(trdoc.getElementsByClassName(
						"s6")[0]
					.innerHTML)

				book.push({
					imgurl: imgurl,
					bookurl: bookurl,
					bookname: bookname,
					author: author,
					origin: origin,
					tags: tags
				});
			}
			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},
	search15: async (keyword) => {
		const origin = "https://wechat.idejian.com";
		let url =
			"https://wechat.idejian.com/api/wechat/search/do?keyword=KEYword"
			.replace("KEYword", keyword);
		// 浏览器端有跨域请求，需进行判断  
		// #ifdef H5  
		url = extractHostname(url);
		// #endif  

		/*
		该api返回格式为：
		{
		    "code": 0,
		    "msg": "ok",
		    "body": {
		        "keyword": "你好",
		        "books": [],
		        "pageInfo": {
		            "page": 4,
		            "pageSize": 20,
		            "totalPage": 4
		        }
		    }
		}
		后端的规定搜索分页 所以第一次搜索后获取该搜索有几页 并继续搜索
		*/

		try {
			let page = 1;
			let totalPage = 1;
			let book = [];
			let promises = []; // 用于存放所有请求的 Promise  

			// 首先发送一个请求获取总页数  
			const firstResponse = await uni.request({
				url: url,
				method: "GET",
				data: {
					page: page
				},
			});
			totalPage = firstResponse.data.body.pageInfo
				.totalPage;

			// 创建所有页面的请求 Promise  
			for (page = 1; page <= totalPage; page++) {
				promises.push(new Promise((resolve,
					reject) => {
					uni.request({
						url: url,
						method: "GET",
						data: {
							page: page
						},
						success: (
							res
						) => {
							const
								search =
								res
								.data
								.body
								.books;
							for (
								let i =
									0; i <
								search
								.length; i++
							) {
								const
									regex =
									/<b\s*style="color:red">|<\/b>/g;
								let imgurl =
									search[
										i
									]
									.picUrl;
								// 加上书源 否则id可能和其它书源的url重复
								let bookurl =
									origin +
									search[
										i
									]
									.bookId;
								let bookname =
									search[
										i
									]
									.bookName
									.replace(
										regex,
										''
									)
									.replace(
										/\s/g,
										""
									);
								let author =
									search[
										i
									]
									.author
									.replace(
										regex,
										''
									)
									.replace(
										/\s/g,
										""
									);
								let intro =
									search[
										i
									]
									.desc;
								let
									tags = [];
								if (search[
										i
									]
									.tag
								) {
									tags.push(
										search[
											i
										]
										.tag
									)
								}
								book.push({
									imgurl: imgurl,
									bookurl: bookurl,
									bookname: bookname,
									author: author,
									origin: origin,
									intro: intro,
									tags: tags,
								});
							}
							resolve
								(); // 请求成功，解析 Promise  
						},
						fail: (
							error
						) => {
							reject
								(
									error
								); // 请求失败，拒绝 Promise  
						}
					});
				}));
			}

			// 等待所有请求完成  
			await Promise.all(promises);

			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},

	search16: async (keyword) => {
		const origin =
			"http://download.maoyankanshu.la";
		let url =
			"http://api.jxgtzxc.com/search?keyword=KEYword"
			.replace("KEYword", keyword);
		// 浏览器端有跨域请求，需进行判断  
		// #ifdef H5  
		url = extractHostname(url);
		// #endif  

		/*
		该api返回格式为：
		{
		    "request_id": "2b5d8788-71d5-421f-8b2c-e3515cc75aed",
		    "msg": "success",
		    "code": 200,
		    "data": []
		}
		后端的规定搜索分页 但无总页数
		*/

		try {
			let page = 1;
			let book = [];

			while (true) {
				const res = await uni.request({
					url: url,
					method: "GET",
					data: {
						page: page
					},
					header: {
						"User-Agent": "okhttp/4.9.2",
						"client-device": "LND-AL40",
						"client-version": "2.2.0",
						"client-brand": "HONOR",
						"client-source": "android",
						"client-name": "app.maoyankanshu.novel",
						"Authorization": "bearereyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuam1sbGRzYy5jb21cL2F1dGhcL3RoaXJkIiwiaWF0IjoxNjY1OTU4NzE0LCJleHAiOjE3NTkyNzA3MTQsIm5iZiI6MTY2NTk1ODcxNCwianRpIjoiTzdkNGZXZGo4b3JEZVBTbCIsInN1YiI6MjEwMjgsInBydiI6ImExY2IwMzcxODAyOTZjNmExOTM4ZWYzMGI0Mzc5NDY3MmRkMDE2YzUifQ.QIK10Tnkc25NqBE0XW7CgdHUZFFpEY1hS7s9yxJF378"
					}
				})

				const search = res.data.data;
				if (search.length < 1) {
					break;
				}
				for (let i = 0; i < search
					.length; i++) {
					const regex =
						/<b\s*style="color:red">|<\/b>/g;
					let imgurl = search[i].cover;
					// 加上书源 否则id可能和其它书源的url重复
					let bookurl = origin + search[i]
						.novelId;
					let bookname = search[i]
						.novelName
						.replace(regex,
							'')
						.replace(/\s/g, "");
					let author = search[i]
						.authorName
						.replace(regex, '')
						.replace(/\s/g, "");
					let intro = search[i].summary;
					let tags = [];
					if (search[i].wordNum) {
						tags.push(search[i].wordNum)
					}
					if (search[i].categoryNames[0]
						.className) {
						tags.push(search[i]
							.categoryNames[0]
							.className)
					}
					if (search[i].averageScore >
						0) {
						tags.push(search[i]
							.averageScore + "分")
					}
					book.push({
						imgurl: imgurl,
						bookurl: bookurl,
						bookname: bookname,
						author: author,
						origin: origin,
						intro: intro,
						tags: tags,
					});
				}
				page = page + 1;
			}

			return book;
		} catch (e) {
			console.log(e);
			return -1;
		}
	},

}

export default getSearch