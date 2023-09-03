<template>
  <div>
    <p>
      <span style="color: red">{{ item.id + 1 }}. </span>{{ item.value }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
};
</script>
