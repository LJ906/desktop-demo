
<template>
  <div class="page-wrp">
    <div class="page-inner">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane name="first" label="课题经费概算书">
          <book></book>
        </el-tab-pane>
        <el-tab-pane label="项目概算方案" name="second">
          <plan></plan>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
// import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import Book from './components/book'
import Plan from './components/plan'
export default {
  name: 'adviceReport',
  components: {
    Book,
    Plan
    // UploadExcelComponent
  },
  data() {
    return {
      // 查询
      activeName: 'first'
    }
  }
}
</script>
