import HTMLParser from '@/uni_modules/html-parser/js_sdk/index.js'

class update {
  /**
   * 获取更新信息
   */
  static async getUpdate() {
    let url = 'http://blog.imtwa.top/index.php/archives/78/'
    // #ifdef H5
    url = '/imtwa/index.php/archives/78/'
    // #endif

    try {
      const res = await uni.request({
        url: url,
        method: 'GET'
      })
      const doc = new HTMLParser(res.data.toString().trim())
      // 获取更新信息
      const intro = new HTMLParser(doc.getElementsByClassName('joe_detail__article')[0].innerHTML)
      const p = intro.getElementsByTagName('p')[0].innerHTML.split('<br>')
      let list = []
      for (let i = 0; i < p.length; i = i + 4) {
        const description = p[i + 1]
        const title = p[i]
        const newurl = /href="([^"]+)"/.exec(p[i + 2])[1]
        list.push({
          description,
          title,
          newurl
        })
      }

      return list
    } catch (e) {
      console.log(e)
      return ''
    }
  }
}

export default update
