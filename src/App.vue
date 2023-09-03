<template>
  <div id="app">
    <button @click="onClick">切换列表</button>
    <h1>{{ showVirtualList ? "Virtual List" : "Real List" }}</h1>
    <DynamicHeight
      :list-data="listData"
      :visible-height="500"
      :estimated-item-height="50"
      v-if="showVirtualList"
      v-slot="slotProps"
    >
      <ListItem :item="slotProps.item"></ListItem>
    </DynamicHeight>
    <RealList :list-data="listData" v-else />
  </div>
</template>

<script>
import { fakerListData } from "./faker";
import DynamicHeight from "./components/LongList/VirtualList/DynamicHeight.vue";
import RealList from "./components/LongList/RealList.vue";
import ListItem from "./components/LongList/VirtualList/ListItem.vue";

let staticData = [];
for (let i = 0; i < 100000; i++) {
  staticData.push({ id: i, value: i });
}

const dynamicData = fakerListData();

export default {
  name: "App",
  components: {
    DynamicHeight,
    RealList,
    ListItem,
  },
  data() {
    return {
      listData: [],
      showVirtualList: false,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      let now = Date.now();
      // 定高数据
      // this.listData = staticData;
      // 不定高数据
      this.listData = dynamicData;
      console.log("JS运行时间：", Date.now() - now);
      setTimeout(() => {
        console.log("渲染时间：", Date.now() - now);
      }, 0);
    },
    onClick() {
      this.getData();
      this.showVirtualList = !this.showVirtualList;
    },
  },
};
</script>

<style>
html {
  height: 100%;
}
body {
  height: 100%;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
