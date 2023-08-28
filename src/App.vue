<template>
  <div id="app">
    <button @click="onClick">切换列表</button>
    <h1>{{ showVirtualList ? "Virtual List" : "Real List" }}</h1>
    <VirtualList
      :total-data="listData"
      :visible-height="500"
      :item-height="50"
      v-if="showVirtualList"
    />
    <RealList :list-data="listData" v-else />
  </div>
</template>

<script>
import VirtualList from "./components/LongList/VirtualList.vue";
import RealList from "./components/LongList/RealList.vue";

let data = [];
for (let i = 0; i < 100000; i++) {
  data.push({ id: i, value: i });
}

export default {
  name: "App",
  components: {
    VirtualList,
    RealList,
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
      this.listData = data;
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
