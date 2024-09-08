<template>
  <view>
    <HM-dragSorts
      ref="dragSorts"
      :list="list"
      :autoScroll="true"
      :feedbackGenerator="true"
      :rowHeight="55"
      @change="change"
      @confirm="confirm"
      @toggleCheck="toggleCheck"
      @=""
    >
    </HM-dragSorts>
  </view>
</template>

<script>
import list from "@/uni_modules/uview-ui/libs/config/props/list";
export default {
  data() {
    return {
      list: [],
      isChecked: false,
    };
  },
  onLoad() {
    // 深拷贝书源
    this.list = JSON.parse(JSON.stringify(this.$store.state.bookOrigins));
  },

  methods: {
    toggleCheck() {
      this.isChecked = !this.isChecked;
    },

    clear() {
      // 清空数组
      this.$refs.dragSorts.splice(0, this.list.length);
    },
    push() {
      // 和数组的push使用方法一致，可以push单行，也可以push多行
      this.list.forEach((item) => {
        this.$refs.dragSorts.push(item);
      });
    },
    unshit() {
      // 和数组的unshit使用方法一致，可以unshit单行，也可以unshit多行
      // this.$refs.dragSorts.unshit({
      // 	"name": "unshit行",
      // 	"icon": "/static/img/2.png"
      // });
    },
    splice() {
      // 和数组的unshit使用方法一致 下标1开始删除1个并在下标1位置插入行
      // this.$refs.dragSorts.splice(1, 1, {
      // 	"name": "splice行",
      // 	"icon": "/static/img/2.png"
      // });
    },
    toggleCheck(e) {
      console.log("改变选中");
      console.log(e.list);
      this.upBookOrigins(e.list);
    },
    change(e) {
      console.log("=== change start ===");
      console.log("被拖动行: " + JSON.stringify(e.moveRow));
      console.log("原始下标：", e.index);
      console.log("移动到：", e.moveTo);
      console.log("=== change end ===");
    },
    confirm(e) {
      console.log("=== confirm start ===");
      console.log("被拖动行: " + JSON.stringify(e.moveRow));
      console.log("原始下标：", e.index);
      console.log("移动到：", e.moveTo);
      console.log("改变后列表", e.list);
      console.log("=== confirm end ===");
      this.upBookOrigins(e.list);
    },
    upBookOrigins(list) {
      this.$store.commit("modifyBookOrigins", list);
    },
  },
};
</script>

<style lang="scss" scoped>
.checkbox {
  height: 20px;
  width: 20px;
  vertical-align: -0.8rem;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  margin: 0.4rem;
  outline: none;
}

.checkbox-void {
  width: 100%;
  height: 100%;
  border: 2px solid #ffc107;
  transition: all 0.15s ease-out 0s;
}

.checked {
  height: 100%;
  width: 100%;
  background: #ffc107;
  transition: all 0.15s ease-out 0s;
}

.checked:before,
.checked:after {
  display: block;
  position: relative;
  content: "";
  // transform: translate(-50%, -50%);
  background: #fff;
  transform-origin: 0 0;
}

.checked:before {
  top: 50%;
  left: 20%;
  width: 30%;
  height: 10%;
  transform: rotate(45deg);
  animation: line-before 0.15s ease-out forwards;
}

.checked:after {
  // left: 58%;
  // top: 5%;
  opacity: 0;
  top: 65%;
  left: 30%;
  width: 70%;
  height: 10%;
  transform: rotate(-45deg);
  animation: line-after 0.3s ease-out forwards;
  // animation-delay: .2s;
}

@keyframes line-before {
  0% {
    width: 0%;
  }

  100% {
    width: 30%;
  }
}

@keyframes line-after {
  0% {
    opacity: 1;
    width: 0%;
  }

  100% {
    opacity: 1;
    width: 70%;
  }
}
</style>
