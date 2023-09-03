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
        class="virtual-list-item"
        ref="items"
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
  computed: {
    // 这个影响的其实是渲染的条目数，保证比可以看到的大就可以了
    visibleCount() {
      return Math.ceil(this.visibleHeight / this.estimatedItemHeight);
    },
    aboveCount() {
      return Math.min(this.start, this.bufferScale * this.visibleCount);
    },
    belowCount() {
      return Math.min(
        this.listData.length - this.end,
        this.bufferScale * this.visibleCount
      );
    },
    visibleData() {
      let start = this.start - this.aboveCount;
      let end = this.end + this.belowCount;
      return this.listData.slice(start, end);
    },
  },
  created() {
    this.initPositions();
    this.onScroll = throttle(this.handleScroll, 200, { leading: false });
  },
  mounted() {
    this.start = 0;
    this.end = this.start + this.visibleCount;
  },
  updated() {
    this.$nextTick(function () {
      if (!this.$refs.items || !this.$refs.items.length) {
        return;
      }
      this.updateItemsSize();
      let height = this.positions[this.positions.length - 1].bottom;
      this.$refs.phantom.style.height = height + "px";
      this.getStartOffset();
    });
  },
  data() {
    return {
      positions: [],
      start: 0,
      end: 0,
    };
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
    getStartIndex(scrollTop = 0) {
      return this.binarySearch(this.positions, scrollTop);
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
    updateItemsSize() {
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
    getStartOffset() {
      let startOffset;
      if (this.start >= 1) {
        let size =
          this.positions[this.start].top -
          (this.positions[this.start - this.aboveCount]
            ? this.positions[this.start - this.aboveCount].top
            : 0);
        startOffset = this.positions[this.start - 1].bottom - size;
      } else {
        startOffset = 0;
      }
      this.$refs.content.style.transform = `translate3d(0,${startOffset}px,0)`;
    },
    handleScroll() {
      let scrollTop = this.$refs.list.scrollTop;
      // this.start = this.getStartIndex(scrollTop);
      this.start = this.positions.find((i) => i && i.bottom > scrollTop).index;
      this.end = this.start + this.visibleCount;
      this.getStartOffset();
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
