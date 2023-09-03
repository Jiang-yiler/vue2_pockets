<template>
  <!-- 可视区域的容器 -->
  <div
    ref="list"
    class="virtual-list-container"
    :style="{ height: visibleHeight + 'px' }"
    @scroll="onScroll"
  >
    <!-- 容器内的占位，用于形成滚动条 -->
    <div
      ref="phantom"
      class="virtual-list-phantom"
      :style="{ height: totalHeight + 'px' }"
    ></div>
    <!-- 渲染区域 -->
    <div
      ref="content"
      class="virtual-list"
      :style="{ transform: `translate3d(0, ${this.offset}px, 0)` }"
    >
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
const PRE_LOAD_COUNT = 5;
export default {
  name: "StaticHeight",
  props: {
    totalData: {
      type: Array,
      default: () => [],
    },
    visibleHeight: {
      type: Number,
      default: 0,
    },
    itemHeight: {
      type: Number,
      default: 200,
    },
  },
  computed: {
    totalHeight() {
      return this.totalData.length * this.itemHeight;
    },
    itemStyle() {
      return {
        height: this.itemHeight + "px",
        lineHeight: this.itemHeight + "px",
      };
    },
    visibleCount() {
      return Math.ceil(this.visibleHeight / this.itemHeight);
    },
  },
  data() {
    return {
      offset: 0,
      visibleData: [],
    };
  },
  mounted() {
    this.getVisibleData();
  },
  methods: {
    onScroll() {
      // 顶部隐藏列表的高度
      const scrollTop = this.$refs.list.scrollTop;
      this.getVisibleData(scrollTop);
      this.getOffset(scrollTop);
    },
    // 更新列表数据
    getVisibleData(scrollTop) {
      scrollTop = scrollTop || 0;
      let startIndex = Math.floor(scrollTop / this.itemHeight) - PRE_LOAD_COUNT;
      startIndex = Math.max(startIndex, 0);
      let endIndex = startIndex + this.visibleCount + PRE_LOAD_COUNT;
      endIndex = Math.min(endIndex, this.totalData.length);
      this.visibleData = this.totalData.slice(startIndex, endIndex);
    },
    // 更新列表位置，保证其一直在可视区
    getOffset(scrollTop) {
      scrollTop = scrollTop || 0;
      this.offset = scrollTop - (scrollTop % this.itemHeight);
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
