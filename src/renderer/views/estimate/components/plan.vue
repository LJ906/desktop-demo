
<template>
  <div>
    <search-bar
      class="btn2-width"
      :conditions="conditions"
      :operationsBtn="operationsBtn"
      @event="getQueryForm"
      size="big"
    >
      <el-button icon="el-icon-upload" size="big" type="primary">导入</el-button>
      <!-- <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" /> -->
    </search-bar>
    <PageTitle title="列表"></PageTitle>
    <el-table
      :data="tableData"
      border
      highlight-current-row
      size="big"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="50"></el-table-column>
      <!-- <el-table-column label="序号" type="index" width="70" align="center"></el-table-column> -->
      <el-table-column
        v-for="item of tableHeader"
        :key="item.id"
        :prop="item.prop"
        :label="item.label"
        :minWidth="item.minWidth"
      />
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-delete"
            size="small"
            type="danger"
            @click="handleDelete(scope.$index)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import SearchBar from '@/components/common/SearchBar'
import PageTitle from '@/components/PageTitle'
// import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import mock from '@/mock/mockTable'

export default {
  name: 'adviceReport',
  components: {
    SearchBar,
    PageTitle
    // UploadExcelComponent
  },
  data() {
    return {
      // 查询
      queryForm: {},
      operationsBtn: [
        {
          type: 'primary',
          label: '查询',
          icon: 'el-icon-search',
          event: this.handleSearch
        },
        {
          type: 'primary',
          label: '重置',
          icon: 'el-icon-refresh',
          event: this.handleClear
        }
      ],
      conditions: [
        {
          prop: 'fileName',
          label: '文件名称',
          value: '',
          type: 'text'
        },
        {
          prop: 'className',
          label: '课题名称',
          value: '',
          type: 'text'
        },
        {
          prop: 'projectNo',
          label: '项目编号',
          value: '',
          type: 'text'
        },
        {
          prop: 'secret',
          label: '密集',
          value: '',
          type: 'select',
          option: {
            加密: '加密',
            公开: '公开'
          }
        }
      ],
      // 表格
      tableData: mock,
      tableHeader: [
        {
          prop: 'fileName',
          label: '文件名称',
          minWidth: 150
        },
        {
          prop: 'className',
          label: '课题名称',
          minWidth: 150
        },
        {
          prop: 'projectNo',
          label: '项目编号',
          minWidth: 100
        },
        {
          prop: 'secret',
          label: '密集',
          minWidth: 80
        },
        {
          prop: 'reportUnit',
          label: '项目类型',
          minWidth: 150
        },
        {
          prop: 'reporter',
          label: '编报人员',
          minWidth: 100
        },
        {
          prop: 'reportDate',
          label: '编报时间',
          minWidth: 150
        }
      ]
    }
  },
  methods: {
    getQueryForm(queryForm) {
      this.queryForm = queryForm
    },
    handleSearch(form) {
      let keys = Object.keys(form).filter(k => {
        let v = form[k]
        return v
      })
      keys.forEach(k => {
        let v = form[k]
        this.tableData = this.tableData.filter(col => col[k] === v)
      })
    },
    handleClear() {
      this.conditions.forEach(o => {
        o.value = ''
      })
    },
    handleSelectionChange(selected) {},

    handleDelete(index) {
      this.$confirm('确认删除该条数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.tableData.splice(index, 1)
        })
        .catch(() => {})
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    }
  }
}
</script>
