
<template>
  <div class="page-wrp">
    <div class="page-inner">
      <search-bar
        class="btn2-width"
        :conditions="conditions"
        :operationsBtn="operationsBtn"
        @event="getQueryForm"
        size="big"
      >
        <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
        <el-button
          icon="el-icon-download"
          size="big"
          type="primary"
          @click="download"
          v-loading="downloadLoading"
        >导出</el-button>
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
        <el-table-column label="序号" type="index" width="70" align="center"></el-table-column>
        <el-table-column
          v-for="item of tableHeader"
          :key="item.id"
          :prop="item.prop"
          :label="item.label"
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
  </div>
</template>

<script>
import SearchBar from '@/components/common/SearchBar'
import PageTitle from '@/components/PageTitle'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import mock from '@/mock/mockTable'

export default {
  name: 'adviceReport',
  components: {
    SearchBar,
    PageTitle,
    UploadExcelComponent
  },
  data() {
    return {
      // 查询
      fileList: [],
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
          prop: 'classNo',
          label: '课题编号',
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
          width: 150
        },
        {
          prop: 'className',
          label: '课题名称',
          width: 150
        },
        {
          prop: 'classNo',
          label: '课题编号',
          width: 100
        },
        {
          prop: 'secret',
          label: '密集',
          width: 80
        },
        {
          prop: 'unit',
          label: '建议单位',
          width: 150
        },
        {
          prop: 'dutyPerson',
          label: '课题负责人',
          width: 120
        },
        {
          prop: 'createDate',
          label: '编制时间',
          width: 150
        }
      ],
      downloadLoading: false
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
    // handleSuccess({ results, header }) {
    //   this.tableData = results
    //   this.tableHeader = header
    // },
    handleSuccess(file) {
      this.tableData.push({
        fileName: file.name
      })
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        this.fileList.push(file)
        console.log('file', this.fileList)
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    download() {
      this.downloadLoading = true
      import('@/vendor/Export2Zip').then(zip => {
        const tHeader = ['id', 'fileName', 'className', 'classNo', 'secret']
        // const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
        // const list = this.tableData
        // const data = this.formatJson(filterVal, list)
        zip.export_txt_to_zip(tHeader, this.fileList[0], this.fileList[0].name, '项目建议书压缩包')
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    downloadByArchiver() {
      // import('@/vendor/Export2Zip').then(zip => {
      //   zip.remoteZip()
      // })
    }
  }
}
</script>
