<template>
  <view>
    <u-loading-page :loading="!visShow"></u-loading-page>
    <view class="container" v-if="visShow">
      <view v-for="(config, index) in bookConfigs">
        <BookClass :Ftitle="classify.title" :config="config"> </BookClass>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      classify: {},
      bookConfigs: [],
      visShow: false,
    };
  },
  onLoad(e) {
    this.classify = JSON.parse(e.book);
    // 动态设置标题
    uni.setNavigationBarTitle({
      title: this.classify.title,
    });
    this.bookConfigs = this.classify.class;
    this.int();
  },
  //监听用户下拉刷新动作
  onPullDownRefresh() {
    // 检查更新
    this.int();
  },
  computed: {},
  methods: {
    int() {
      const requests = this.bookConfigs.map((it, index) => {
        const url = it.url.replace("{{page}}", 1);
        return new Promise((resolve, reject) => {
          uni.request({
            url: url,
            method: "GET",
            success: (res) => {
              const origin = "http://download.maoyankanshu.la";
              const search = res.data.data;

              let book = [];
              for (let i = 0; i < search.length; i++) {
                const regex = /<b\s*style="color:red">|<\/b>/g;
                let imgurl = search[i].cover;
                // 加上书源 否则id可能和其它书源的url重复
                let bookurl = origin + search[i].novelId;
                let bookname = search[i].novelName
                  .replace(regex, "")
                  .replace(/\s/g, "");
                let author = search[i].authorName
                  .replace(regex, "")
                  .replace(/\s/g, "");
                let intro = search[i].summary || "";
                let createdAt = search[i].createdAt;
                let tags = [];
                if (search[i].categoryNames[0].className) {
                  tags.push(search[i].categoryNames[0].className);
                }
                if (search[i].wordNum) {
                  tags.push(search[i].wordNum);
                }
                if (search[i].rankInfo) {
                  tags.push(search[i].rankInfo);
                }
                if (search[i].averageScore > 0) {
                  tags.push(search[i].averageScore + "分");
                }

                book.push({
                  imgurl: imgurl,
                  bookurl: bookurl,
                  bookname: bookname,
                  author: author,
                  origin: origin,
                  intro: intro,
                  createdAt: createdAt,
                  tags: tags,
                });
              }
              resolve(book);
            },
          });
        });
      });
      Promise.all(requests)
        .then((results) => {
          if (this.bookConfigs[0].hasOwnProperty("list")) {
            uni.showToast({
              title: "刷新成功",
              icon: "none",
            });
            uni.stopPullDownRefresh(); //停止刷新
          }

          for (let i = 0; i < results.length; i++) {
            this.bookConfigs[i].list = results[i];
          }
          this.visShow = true;
        })
        .catch((error) => {
          console.log("请求错误:", error);
        });
    },
  },
};
</script>

<style>
.container {
  background-color: #f5f5f5;
  padding: 4px 0;
}
</style>
