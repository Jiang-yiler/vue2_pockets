<template>
  <!-- 可视区域的容器 -->
  <div
    ref="list"
    class="virtual-list-container"
    :style="{ height: visibleHeight + 'px' }"
    @scroll="onScroll"
  >
    <!-- 容器内的占位，高度为总列表高度，用于形成滚动条 -->
    <div
      class="virtual-list-phantom"
      :style="{ height: totalHeight + 'px' }"
    ></div>
    <!-- 渲染区域 -->
    <div class="virtual-list" :style="{ transform: getTransform }">
      <div
        ref="items"
        class="virtual-list-item"
        v-for="item in visibleData"
        :key="item.id"
        :style="itemStyle"
      >
        {{ item.value }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VirtualList",
  props: {
    //所有列表数据
    totalData: {
      type: Array,
      default: () => [],
    },
    //可视区域高度
    visibleHeight: {
      type: Number,
      default: 0,
    },
    //每项高度
    itemHeight: {
      type: Number,
      default: 200,
    },
  },
  computed: {
    //列表总高度
    totalHeight() {
      return this.totalData.length * this.itemHeight;
    },
    // 每个条目的高度
    itemStyle() {
      return {
        height: this.itemHeight + "px",
        lineHeight: this.itemHeight + "px",
      };
    },
    //可显示的列表项数
    visibleCount() {
      return Math.ceil(this.visibleHeight / this.itemHeight);
    },
    //偏移量对应的style
    getTransform() {
      return `translate3d(0, ${this.startIndexOffset}px, 0)`;
    },
    //获取真实显示列表数据
    visibleData() {
      return this.totalData.slice(
        this.startIndex,
        Math.min(this.endIndex, this.totalData.length)
      );
    },
  },
  data() {
    return {
      //偏移量
      startIndexOffset: 0,
      //起始索引
      startIndex: 0,
      //结束索引
      endIndex: null,
    };
  },
  mounted() {
    this.startIndex = 0;
    this.endIndex = this.startIndex + this.visibleCount;
  },
  methods: {
    onScroll() {
      //当前滚动位置
      const scrollTop = this.$refs.list.scrollTop;
      //此时的开始索引
      this.startIndex = Math.floor(scrollTop / this.itemHeight);
      //此时的结束索引
      this.endIndex = this.startIndex + this.visibleCount;
      //此时的偏移量
      this.startIndexOffset = scrollTop - (scrollTop % this.itemHeight);
    },
  },
};
</script>

<style scoped>
.virtual-list-container {
  position: relative;
  margin: 0 auto;
  width: 50%;
  overflow: auto;
  /* border: 1px dashed #000; */
}

.virtual-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.virtual-list {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  text-align: center;
}

.virtual-list-item {
  box-sizing: border-box;
  border-bottom: 1px dotted #999;
}
</style>
