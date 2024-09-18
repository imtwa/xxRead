import Vue from 'vue'
import Vuex from 'vuex'
import HTMLParser from '@/uni_modules/html-parser/js_sdk/index.js'
import origins from '@/api/getNetwork/origins.json'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    //公共的变量，这里的变量不能随便修改，只能通过触发mutations的方法才能改变

    // 这是书架列表，书本对象有属性 imgurl，bookurl，bookname，author，intro，origin，readIndex，readAll，isUpdated,chapters
    bookShelf: [],
    // 浏览历史列表
    bookHistoryList: [],
    // 历史记录列表，只储存20条，多余则删除最先的数据
    historyItems: [],
    // 导出txt列表
    bookTxts: [],
    // 总推荐，总排行，总收藏，总字数，最近更新
    bookConfigs: [
      {
        url: 'http://www.qiushu.info/top/lastupdate.html',
        title: '最近更新'
      },
      {
        url: 'http://www.qiushu.info/top/goodnum.html',
        title: '总收藏榜'
      },
      {
        url: 'http://www.qiushu.info/top/allvote.html',
        title: '总推荐榜'
      },
      {
        url: 'http://www.qiushu.info/top/allvisit.html',
        title: '总排行榜'
      },
      {
        url: 'http://www.qiushu.info/top/size.html',
        title: '总字数榜'
      }
    ],
    // 书架
    bookLists: [],
    userInfo: {
      avatarUrl: '/static/images/user/userImage.png',
      nickname: 'tx1115',
      bio: '这是一个简介~'
    },
    // 书源列表
    // origins: [],
    // 可以设置选用的书源
    bookOrigins: []
  },
  mutations: {
    //相当于同步的操作
    getUserInfo(state) {
      const accountInfo = uni.getSystemInfoSync()
      // 获取用户信息
      state.userInfo.nickname = accountInfo.deviceId.slice(-6)
    },
    //将书籍添加进书架
    addBookShelf(state, newbook) {
      // 查找是否在书架中
      const index = state.bookShelf.findIndex(book => book.bookurl === newbook.bookurl)
      // 如果不在，则添加进书架
      if (index === -1) {
        state.bookShelf.push(newbook)
      }
      console.log(state.bookShelf.length)
    },
    //将书籍添加进浏览历史记录
    addBookHistoryList(state, newbook) {
      // 查找是否在浏览历史中
      const index = state.bookHistoryList.findIndex(book => book.bookurl === newbook.bookurl)
      // 如果不在，则添加进去
      if (index === -1) {
        state.bookHistoryList.push(newbook)
      } else {
        // 如果在，更新
        state.bookHistoryList[index] = newbook
      }
      console.log(state.bookHistoryList.length)
    },

    //将书籍在书架中删除，传入bookurl
    deleteBook(state, bookurl) {
      // 查找是否在书架中
      const index = state.bookShelf.findIndex(book => book.bookurl === bookurl)
      // 如果在则删除
      if (index != -1) {
        state.bookShelf.splice(index, 1)
      }
      const key = 'bookall' + bookurl
      // 同时清空缓存
      uni.removeStorage({
        key: key,
        success: function (res) {
          console.log('清除全书缓存成功')
        }
      })
    },

    //将书籍在历史记录中删除，传入bookurl
    deleteBookHistoryList(state, bookurl) {
      // 查找是否在书架中
      const index = state.bookHistoryList.findIndex(book => book.bookurl === bookurl)
      // 如果在则删除
      if (index != -1) {
        state.bookHistoryList.splice(index, 1)
      }
    },

    //修改该书在缓存中的储存，需要传入book对象
    modifyBook(state, newbook) {
      // 查找在书架中的索引
      const index = state.bookShelf.findIndex(book => book.bookurl === newbook.bookurl)
      // 更新
      state.bookShelf[index] = newbook
    },
    modifyBookLists(state, newBookLists) {
      // 更新
      state.bookLists = newBookLists
    },
    // 更新用户信息
    modifyUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },

    modifyBookOrigins(state, list) {
      if (state.bookOrigins.length === list.length) {
        state.bookOrigins = list
      }
    },

    /**
     * 检查更新
     * */
    async updateBookshelf(state, getNetwork) {
      const requests = state.bookShelf.map(async config => {
        let book = config
        try {
          const newbook = await getNetwork.homePage(book)
          // 新获取的目录更多了===更新了
          if (newbook.chapters.length > book.chapters.length) {
            // 要用一个变量中转一下，否则报错没有book.chapters.push这个函数
            let chapter = book.chapters
            for (let k = book.chapters.length; k < newbook.chapters.length; k++) {
              chapter.push(newbook.chapters[k])
            }
            book.chapters = chapter
            // 标记为已经更新
            book.isUpdated = true
            book.readAll = newbook.chapters.length
            // 调用同步方法
            this.commit('modifyBook', book)
          }
        } catch (error) {
          console.error('Error occurred while fetching book details:', error)
          throw error // 在Promise链中抛出错误，以便在Promise.all的catch中捕获
        }
      })

      Promise.all(requests)
        .then(results => {
          uni.showToast({
            title: '刷新成功',
            icon: 'none'
          })
          uni.stopPullDownRefresh() //停止刷新
        })
        .catch(error => {
          console.log('请求错误:', error)
        })
    },

    // 添加历史记录
    addToHistoryItems(state, item) {
      // 如果不在数组中
      if (!state.historyItems.includes(item)) {
        state.historyItems.push(item) // 将新记录添加到数组末尾

        // // 最多存放二十条数据
        // if (state.historyItems.length > 20) {
        // 	state.historyItems.shift(); // 删除数组的第一个元素（最早加入的数据）
        // }
      }
    },

    // 清空历史记录
    clearHistoryItems(state) {
      state.historyItems.splice(0, state.historyItems.length)
    },

    // 清空历史记录的单项
    clearHistoryItem(state, Item) {
      let itemIndex = state.historyItems.indexOf(Item)
      if (itemIndex > -1) {
        state.historyItems.splice(itemIndex, 1)
      }
    },

    // 添加导出记录
    addBookTxts(state, item) {
      console.log(item)
      // 如果不在数组中
      if (!state.bookTxts.find(book => book.toLocalURL === item.toLocalURL)) {
        state.bookTxts.push(item) // 将新记录添加到数组末尾
        state.bookTxts = [...new Set(state.bookTxts)]
      }
    },

    /**
     * 将点击的这本书移动到书架开头
     */
    moveBookshelfToLast(state, index) {
      if (state.bookShelf[index] && index !== state.bookShelf.length - 1) {
        const element = state.bookShelf.splice(index, 1)[0]
        state.bookShelf.push(element)
      }
    },

    // 将书架数据存入缓存
    setBookShelfFromStorage(state) {
      uni.setStorage({
        key: 'bookShelf',
        data: state.bookShelf,
        success: res => {
          console.log('书架存入缓存成功')
        }
      })
      uni.setStorage({
        key: 'bookHistoryList',
        data: state.bookHistoryList,
        success: res => {
          console.log('浏览历史存入缓存成功')
        }
      })
      uni.setStorage({
        key: 'historyItems',
        data: state.historyItems,
        success: res => {
          console.log('历史记录存入缓存成功')
        }
      })
      // uni.setStorage({
      //   key: 'userInfo',
      //   data: state.userInfo,
      //   success: res => {
      //     console.log('用户信息存入缓存成功')
      //   }
      // })
      uni.setStorage({
        key: 'bookTxts',
        data: state.bookTxts,
        success: res => {
          console.log('导出记录存入缓存成功')
        }
      })
      uni.setStorage({
        key: 'bookOrigins',
        data: state.bookOrigins,
        success: res => {
          console.log('书源记录存入缓存成功')
        }
      })
    },
    // 从缓存中读取书架数据
    getBookShelfFromStorage(state) {
      // 为了APP加载时读取完书架信息
      // 这里使用同步读取
      const bookShelf = uni.getStorageSync('bookShelf')
      if (Array.isArray(bookShelf) && bookShelf.length > 0) {
        state.bookShelf = bookShelf
        console.log('书架读取缓存成功')
      } else {
        console.log('缓存内没有书架')
      }

      // 其它数据使用异步读取即可
      uni.getStorage({
        key: 'historyItems',
        success: res => {
          state.historyItems = res.data
          console.log('历史记录读取缓存成功')
        },
        fail: res => {
          console.log('缓存内没有历史记录')
        }
      })

      uni.getStorage({
        key: 'bookHistoryList',
        success: res => {
          state.bookHistoryList = res.data
          console.log('浏览记录读取缓存成功')
        },
        fail: res => {
          console.log('缓存内没有浏览记录')
        }
      })

      uni.getStorage({
        key: 'bookTxts',
        success: res => {
          state.bookTxts = res.data
          console.log('导出记录读取缓存成功')
        },
        fail: res => {
          console.log('缓存内没有导出记录')
        }
      })

      // uni.getStorage({
      //   key: 'userInfo',
      //   success: res => {
      //     state.userInfo = res.data
      //     console.log('用户数据读取缓存成功')
      //   },
      //   fail: res => {
      //     console.log('缓存内没有用户数据')
      //   }
      // })
      uni.getStorage({
        key: 'bookOrigins',
        success: res => {
          if (res.data.length != origins.length) {
            let newOrigins = []
            for (let i = 0; i < origins.length; i++) {
              const newOrigin = {
                id: i,
                name: origins[i].bookSourceName,
                isSelect: true,
                bookSourceComment: origins[i].bookSourceComment
              }
              newOrigins.push(newOrigin)
            }
            state.bookOrigins = newOrigins
          } else {
            state.bookOrigins = res.data
          }
          console.log('书源设置读取缓存成功')
        },
        fail: res => {
          console.log('缓存内没有书源数据')
          let newOrigins = []
          for (let i = 0; i < origins.length; i++) {
            const newOrigin = {
              id: i,
              name: origins[i].bookSourceName,
              isSelect: true,
              bookSourceComment: origins[i].bookSourceComment
            }
            newOrigins.push(newOrigin)
          }
          state.bookOrigins = newOrigins
        }
      })
    }
  },
  actions: {
    //相当于异步的操作,不能直接改变state的值，只能通过触发mutations的方法才能改变

    //书架查找中的某本书，需要传入参数bookurl，返回在书架中的索引
    findBookFromShelf({ state }, bookurl) {
      // 查找是否在书架中
      const index = state.bookShelf.findIndex(book => book.bookurl === bookurl)

      if (index !== -1) {
        return index // 返回index的值
      }
      return -1 // 若未找到对应的书籍，返回-1表示失败
    },

    //查找书源列表的下标
    findOrigins({ state }, originF) {
      // 查找是否在列表中
      const index = state.origins.indexOf(originF)

      if (index !== -1) {
        return index // 返回index的值
      }
      return -1 // 若未找到书源，返回-1表示失败
    },

    //将书籍在书架中删除，传入bookurl
    deleteBook({ state }, bookurl) {
      // 查找是否在书架中
      const index = state.bookShelf.findIndex(book => book.bookurl === bookurl)
      // 如果在则删除
      if (index != -1) {
        state.bookShelf.splice(index, 1)
        const key = 'bookall' + bookurl
        // 同时清空缓存
        uni.removeStorage({
          key: key,
          success: function (res) {
            console.log('清除全书缓存成功')
          }
        })
        return 0
      } else {
        console.log('删除失败，书架内没有这本书')
        return -1
      }
    },

    //将书籍在浏览记录中删除，传入bookurl
    deleteBookHistoryList({ state }, bookurl) {
      // 查找是否在书架中
      const index = state.bookHistoryList.findIndex(book => book.bookurl === bookurl)
      // 如果在则删除
      if (index != -1) {
        state.bookHistoryList.splice(index, 1)

        return 0
      } else {
        console.log('删除失败，书架内没有这本书')
        return -1
      }
    },

    //将书籍在导出记录中删除，传入toLocalURL
    deleteBookTxts({ state }, toLocalURL) {
      return new Promise((resolve, reject) => {
        // 查找是否在书架中
        const index = state.bookTxts.findIndex(book => book.toLocalURL === toLocalURL)
        // 如果在则删除
        if (index != -1) {
          uni.removeSavedFile({
            filePath: toLocalURL,
            success: function (res) {
              console.log('删除文件成功', res)
              state.bookTxts.splice(index, 1)
              resolve(0)
            },
            fail: function (err) {
              console.log('删除文件失败', err)
              reject(err)
            }
          })
        } else {
          console.log('删除失败，书架内没有这本书')
          resolve(-1)
        }
      })
    },

    //将书籍在浏览记录中删除，传入bookurl
    clearBookHistoryList({ state }) {
      // 清空浏览记录
      state.bookHistoryList.splice(0, state.bookHistoryList.length)
      return 0
    }
  }
})
export default store
