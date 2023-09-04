<template>
  <div
    ref="list"
    :style="{ height: visibleHeight + 'px' }"
    class="virtual-list-container"
    @scroll="onScroll"
  >
    <div ref="phantom" class="virtual-list-phantom"></div>
    <div ref="content" class="virtual-list">
      <div
        ref="items"
        class="virtual-list-item"
        :id="item.id"
        :key="item.id"
        v-for="item in visibleData"
      >
        <slot ref="slot" :item="item"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import throttle from "lodash/throttle";
export default {
  name: "VirtualList",
  props: {
    listData: {
      type: Array,
      default: () => [],
    },
    estimatedItemHeight: {
      type: Number,
      required: true,
    },
    bufferScale: {
      type: Number,
      default: 1,
    },
    visibleHeight: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      positions: [],
      startIndex: 0,
      onScroll: null,
    };
  },
  computed: {
    // 这个影响的其实是渲染的条目数，保证比可以看到的大就可以了
    visibleCount() {
      return Math.ceil(this.visibleHeight / this.estimatedItemHeight);
    },
    endIndex() {
      return this.startIndex + this.visibleCount;
    },
    topBufferSize() {
      return Math.min(this.startIndex, this.bufferScale * this.visibleCount);
    },
    bottomBufferSize() {
      return Math.min(
        this.listData.length - this.endIndex,
        this.bufferScale * this.visibleCount
      );
    },
    visibleData() {
      let renderStart = this.startIndex - this.topBufferSize;
      let renderEnd = this.endIndex + this.bottomBufferSize;
      return this.listData.slice(renderStart, renderEnd);
    },
  },
  created() {
    this.initPositions();
    this.onScroll = throttle(this.handleScroll, 200, { leading: false });
  },
  mounted() {
    this.updateStartIndex();
  },
  updated() {
    this.$nextTick(function () {
      if (!this.$refs.items || !this.$refs.items.length) {
        return;
      }
      this.updatePositions();
      let height = this.positions[this.positions.length - 1].bottom;
      this.$refs.phantom.style.height = height + "px";
    });
  },
  methods: {
    initPositions() {
      this.positions = this.listData.map((item, index) => ({
        index,
        height: this.estimatedItemHeight,
        top: index * this.estimatedItemHeight,
        bottom: (index + 1) * this.estimatedItemHeight,
      }));
    },
    // 在updated钩子中获取真实的位置信息
    updatePositions() {
      let nodes = this.$refs.items;
      nodes.forEach((node) => {
        let rect = node.getBoundingClientRect();
        let height = rect.height;
        let index = +node.id.slice(1);
        let oldHeight = this.positions[index].height;
        let dValue = oldHeight - height;
        if (dValue) {
          this.positions[index].bottom = this.positions[index].bottom - dValue;
          this.positions[index].height = height;
          for (let k = index + 1; k < this.positions.length; k++) {
            this.positions[k].top = this.positions[k - 1].bottom;
            this.positions[k].bottom = this.positions[k].bottom - dValue;
          }
        }
      });
    },
    handleScroll() {
      let scrollTop = this.$refs.list.scrollTop;
      this.updateStartIndex(scrollTop);
      this.updateOffset();
    },
    updateStartIndex(scrollTop = 0) {
      // 1. 基本计算
      let start = this.positions.find(
        (item) => item && item.bottom >= scrollTop
      ).index;
      // 2. 使用二分查找优化
      // let start = this.binarySearch(this.positions, scrollTop);
      this.startIndex = start;
    },
    updateOffset() {
      const offset = this.positions[this.startIndex - this.topBufferSize]
        ? this.positions[this.startIndex - this.topBufferSize].top
        : 0;
      this.$refs.content.style.transform = `translate3d(0,${offset}px,0)`;
    },
    binarySearch(list, value) {
      let start = 0;
      let end = list.length - 1;
      let tempIndex = null;

      while (start <= end) {
        let midIndex = parseInt((start + end) / 2);
        let midValue = list[midIndex].bottom;
        if (midValue === value) {
          return midIndex + 1;
        } else if (midValue < value) {
          start = midIndex + 1;
        } else if (midValue > value) {
          if (tempIndex === null || tempIndex > midIndex) {
            tempIndex = midIndex;
          }
          end = end - 1;
        }
      }
      return tempIndex;
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
  text-align: left;
}

.virtual-list-item {
  box-sizing: border-box;
  border-bottom: 1px dotted #999;
}
</style>
