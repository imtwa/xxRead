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

/**
 * @description H5+下载App
 * @param downloadUrl:App下载链接
 * @param progressCallBack:下载进度回调
 */
export const downloadApp = (downloadUrl, progressCallBack = () => {}) => {
  return new Promise((resolve, reject) => {
    //创建下载任务
    const downloadTask = plus.downloader.createDownload(
      downloadUrl,
      {
        method: 'GET'
      },
      (task, status) => {
        console.log(status, 'status')
        if (status == 200) {
          //下载成功
          resolve(task.filename)
        } else {
          reject('fail')
          uni.showToast({
            title: '下载失败',
            duration: 1500,
            icon: 'none'
          })
        }
      }
    )
    //监听下载过程
    downloadTask.addEventListener('statechanged', (task, status) => {
      switch (task.state) {
        case 1: // 开始
          break
        case 2: //已连接到服务器
          break
        case 3: // 已接收到数据
          let hasProgress = task.totalSize && task.totalSize > 0 //是否能获取到App大小
          if (hasProgress) {
            let current = parseInt((100 * task.downloadedSize) / task.totalSize) //获取下载进度百分比
            progressCallBack(current, task.downloadedSize, task.totalSize)
          }
          break
        case 4: // 下载完成
          break
      }
    })
    //开始执行下载
    downloadTask.start()
  })
}
/**
 * @description H5+安装APP
 * @param fileName:app文件名
 * @param callBack:安装成功回调
 */
export const installApp = (fileName, callBack = () => {}) => {
  //注册广播监听app安装情况
  onInstallListening(callBack)
  //开始安装
  plus.runtime.install(
    plus.io.convertLocalFileSystemURL(fileName),
    {},
    () => {
      //成功跳转到安装界面
    },
    function (error) {
      uni.showToast({
        title: '安装失败',
        duration: 1500,
        icon: 'none'
      })
    }
  )
}
/**
 * @description 注册广播监听APP是否安装成功
 * @param callBack:安装成功回调函数
 */
const onInstallListening = (callBack = () => {}) => {
  let mainActivity = plus.android.runtimeMainActivity() //获取activity
  //生成广播接收器
  let receiver = plus.android.implements('io.dcloud.android.content.BroadcastReceiver', {
    onReceive: (context, intent) => {
      //接收广播回调
      plus.android.importClass(intent)
      mainActivity.unregisterReceiver(receiver) //取消监听
      callBack()
    }
  })
  let IntentFilter = plus.android.importClass('android.content.IntentFilter')
  let Intent = plus.android.importClass('android.content.Intent')
  let filter = new IntentFilter()
  filter.addAction(Intent.ACTION_PACKAGE_ADDED) //监听APP安装
  filter.addDataScheme('package')
  mainActivity.registerReceiver(receiver, filter) //注册广播
}

/* 
	使用该类应开启以下权限（读取和写入）
	<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
	<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
 */
/* 
	文件编码
	ansi（ascii）：英文标准码0-127，包括控制符和其他英文字符编码，这在后来一直统一没再变过，当然它只需要一个字节保存
	gb2312和gbk：这两个是ancii码加上汉字的扩展，汉字多达10万，在ancii编码基础上再加一个字节表示汉字，共可表示字符65535个，包括了繁体字。因此一个中文字符包含两个字节。eclipse中默认编码方式为gbk。在Windows中文系统中ANSI是默认的编码方式。对于英文文件是ASCII编码，对于简体中文文件是GB2312编码。
	Unicode编码：顾名思义，这是国际统一标准编码，在这之前各国标准编码不统一，微软等公司需要为各国的计算机系统定制符合不同编码标准的系统，显然，成本太高，并且互联网的出现让不同编码标准的计算机交互变得困难，如：两国的邮件系统，会因为使用不同的编码标准而导致接受方收到的邮件是乱码。
	utf-8和utf-16编码：UTF的意思是（UCS Transfer Format），显然是随着互联网的出现，需要解决Unicode在网络上的传输问题。顾名思义，UTF8就是每次8个位传输数据，而UTF16就是每次16个位，只不过为了传输时的可靠性，从UNICODE到UTF时并不是直接的对应，而是要过一些算法和规则来转换。UTF-8就是在互联网上使用最广的一种unicode的实现方式。
*/

/**
 * 获取手机内置存储的根路径
 * @return {String}
 */
const root = function () {
  const environment = plus.android.importClass('android.os.Environment')
  return environment.getExternalStorageDirectory()
}

/**
 * 获取指定文件夹下的所有文件和文件夹列表
 * @param {String} path 文件夹路径
 * @return {Array<String>} 文件和文件夹列表
 */
const filelist = function (dir = '') {
  const File = plus.android.importClass('java.io.File')
  let list = []
  let file = new File(dir)
  let tempList = file.listFiles()
  for (let i = 0; i < tempList.length; i++) {
    let fileName = tempList[i].getName()
    list.push(fileName)
  }
  return list
}

/**
 * 创建文件
 * @return {boolean} flase=失败（已存在、操作失败），true=成功
 */
const createNewFile = function (path = '') {
  const File = plus.android.importClass('java.io.File')
  let file = new File(path)
  if (!file.exists()) {
    return file.createNewFile()
  }
  return false
}

/**
 * 创建文件夹
 * @return {boolean} flase=失败（已存在、操作失败），true=成功
 */
const mkdirs = function (path = '') {
  const File = plus.android.importClass('java.io.File')
  let file = new File(path)
  if (!file.exists()) {
    return file.mkdirs()
  }
  return false
}

/**
 * 读取文件
 * @param {String} path 文件路径
 * @param {String} charset 编码
 * @return {Array<String>} 内容列表（按行读取）,文件不存在或异常则返回false
 */
const readTxt = function (path = '', charset = 'utf-8') {
  const File = plus.android.importClass('java.io.File')
  const InputStreamReader = plus.android.importClass('java.io.InputStreamReader')
  const BufferedReader = plus.android.importClass('java.io.BufferedReader')
  const FileInputStream = plus.android.importClass('java.io.FileInputStream')
  let file = new File(path)
  let inputStreamReader = null
  let bufferedReader = null
  let list = []
  try {
    if (!file.exists()) {
      return false
    }
    inputStreamReader = new InputStreamReader(new FileInputStream(file), charset)
    bufferedReader = new BufferedReader(inputStreamReader)
    let line = ''
    while (null != (line = bufferedReader.readLine())) {
      list.push(line)
    }
    bufferedReader.close()
    inputStreamReader.close()
  } catch (e) {
    if (null != bufferedReader) {
      bufferedReader.close()
    }
    if (null != inputStreamReader) {
      inputStreamReader.close()
    }
    return false
  }
  return list
}

/**
 * 写入文件内容
 * @param {String} path 文件路径
 * @param {String} content 内容
 * @param {boolean} append 内容写入类型，false=不追加（覆盖原有内容），true=追加（从内容尾部写入）
 * @param {String} charset 编码
 * @return {boolean} true=成功，false=失败
 */
const writeTxt = function (path = '', content = '', append = false, charset = 'utf-8') {
  const File = plus.android.importClass('java.io.File')
  const FileOutputStream = plus.android.importClass('java.io.FileOutputStream')
  const OutputStreamWriter = plus.android.importClass('java.io.OutputStreamWriter')

  let outputStreamWriter
  let file = new File(path)
  try {
    //不存在则创建新的文件
    if (!file.exists()) {
      file.createNewFile()
    }
    outputStreamWriter = new OutputStreamWriter(new FileOutputStream(path, append), charset)
    outputStreamWriter.write(content)
    outputStreamWriter.close()
  } catch (e) {
    if (null != outputStreamWriter) {
      outputStreamWriter.close()
    }
    return false
  }
  return true
}

/**
 * 判断文件是否存在
 * @param path 文件路径
 * @return true=存在 false=不存在
 */
const isFileExist = function (path = '') {
  const File = plus.android.importClass('java.io.File')
  return new File(path).exists()
}

/**
 * 删除文件
 * @param {String} path
 */
const deleteFile = function (path = '') {
  const File = plus.android.importClass('java.io.File')
  let file = new File(path)
  if (file.exists()) {
    return file.delete()
  }
  return false
}

export default {
  root,
  filelist,
  createNewFile,
  mkdirs,
  readTxt,
  writeTxt,
  isFileExist,
  deleteFile
}
