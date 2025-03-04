<template>
  <div class="demo-progress">

    <el-progress
        :percentage="percentage"
        :stroke-width="15"
        status="exception"
        striped
        striped-flow
    />

  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue'

const percentage = ref<number>(70)
</script>

<style scoped>
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  max-width: 600px;
}
</style>
