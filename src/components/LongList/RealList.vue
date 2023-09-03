<template>
  <div>
    <div class="vl-box" :style="{ height: boxHeight + 'px' }">
      <div
        class="vl-box-item"
        :style="{
          height: itemHeight + 'px',
          lineHeight: itemHeight + 'px',
        }"
        v-for="item in listData"
        :key="item.id"
      >
        <span style="color: red">{{ item.id + 1 }}</span>
        {{ item.value }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RealList",
  props: {
    listData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      boxHeight: 500,
      itemHeight: 50,
    };
  },
};
</script>

<style scoped>
.vl-box {
  margin: 0 auto;
  width: 50%;
  /* border: 2px solid #0094ff; */
  overflow: auto;
}

.vl-box-item {
  box-sizing: border-box;
  border-bottom: 1px solid red;
}
</style>
