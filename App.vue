<script>
import store from './store/index.js'
import iconv from 'iconv-lite'
import getNetwork from '@/api/getNetwork/getNetwork.js'

export default {
  onLaunch: function () {
    console.log('App Launch')
    //在初始化的时候读取缓存数据
    this.$store.commit('getBookShelfFromStorage')
    this.$store.commit('getUserInfo')

    // 检查更新
    // this.$store.commit('updateBookshelf')
    // this.updateBookshelf();
    // 查看使用的内存
    // uni.getStorageInfo({
    // 	success: function(res) {
    // 		console.log(res.keys);
    // 		console.log(res.currentSize);
    // 		console.log(res.limitSize);
    // 	}
    // });
  },
  onShow: function () {
    // console.log('App Show')
  },
  onHide: function () {
    //在页面进入后台时将数据缓存
    this.$store.commit('setBookShelfFromStorage')
    // console.log('App Hide')
  },
  methods: {}
}
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import '@/uni_modules/uview-ui/index.scss';
@import 'static/fonts/fontFace.css';

/* 每个页面公共css */
view {
  box-sizing: border-box;
}
</style>
