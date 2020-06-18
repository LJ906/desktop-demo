<template>
  <div class="cn-table" :class="{'custom-head': customHead}">
    <el-table
      ref="Ntable"
      :data="data.content"
      :highlight-current-row="highlightCurrentRow"
      @selection-change="handleSelectionChange"
      @select="onSelect"
      @select-all="selectAll"
      :height="height"
      :border="border"
      :stripe="stripe"
      :show-overflow-tooltip="showOverflowTooltip"
      :max-height="maxHeight"
      :size="size"
      :align="align"
      :head-align="align"
      v-loading="loading"
      :element-loading-text="loadingText"
      @current-change="currentChange"
    >
      <el-table-column type="selection" v-if="isSelection" align="center"></el-table-column>
      <el-table-column label="序号" v-if="isShowIndex" type="index" width="70" align="center"></el-table-column>

      <template v-for="column in columns">
        <el-table-column
          :key="column.id"
          v-if="!column.hidden && column.renderBtn"
          :label="column.label"
          :width="column.width"
          :min-width="typeof column.minWidth === 'number' ? column.minWidth + 'px' : column.minWidth"
          :fixed="column.fixed"
          :type="column.type"
          :sortable="column.sortable==null?false:column.sortable"
          :prop="column.prop"
          :formatter="column.formatter"
          header-align="center"
          align="center"
          :size="size"
        >
          <template slot-scope="scope">
            <el-button
              v-for="operation in column.renderBtn"
              :type="operation.type"
              :key="operation.name"
              :label="operation.label"
              :size="operation.size || size"
              @click="clickFun(operation.clickName, scope.row, scope.$index)"
              :disabled="isFn(operation.disabled) ? operation.disabled(scope.row) : operation.disabledNow"
            >{{operation.label}}</el-button>
          </template>
        </el-table-column>
        <!-- 合并表头 -->
        <el-table-column
          v-else-if="column.children"
          :key="column.id"
          :label="column.label"
          align="center"
        >
          <el-table-column
            v-for="item in column.children"
            :prop="item.prop"
            :key="item.prop"
            :label="item.label"
            :width="item.width"
            :min-width="item.minWidth"
            align="center"
          ></el-table-column>
        </el-table-column>
        <!-- end -->
        <el-table-column
          :key="column.id"
          v-else-if="column.hidden==true?false:true"
          :label="column.label"
          :width="column.width"
          :min-width="typeof column.minWidth === 'number' ? column.minWidth + 'px' : column.minWidth"
          :fixed="column.fixed"
          :type="column.type"
          :sortable="column.sortable==null?false:column.sortable"
          :prop="column.prop"
          :formatter="column.formatter"
          header-align="center"
          align="center"
          :size="size"
        ></el-table-column>
      </template>

      <el-table-column
        v-if="isCustomeOperation"
        header-align="center"
        align="center"
        label="操作"
        :width="customOperationWith"
        :fixed="fixed"
      >
        <template slot-scope="scope">
          <template v-for="operation in operations">
            <el-button
              v-if="!operation.hidden || (operation.showFn(scope.row))"
              :perms="operation.perms"
              :type="operation.type"
              :key="operation.name"
              :label="operation.label"
              :size="operation.size || size"
              :icon="operation.icon"
              @click="clickFun(operation.clickName, scope.row, scope.$index)"
            >{{operation.label}}</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="toolbar" v-if="showPagination">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :current-page="pageRequest.pageNo"
        @current-change="handelCurrentChange"
        :page-size="pageRequest.pageSize"
        :total="data.totalSize"
        align="right"
        style="margin: 20px 0;"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'Ntable',
  props: {
    columns: Array,
    data: {
      type: Object,
      default: () => {
        return {
          content: [],
          totalSize: 0
        }
      }
    },
    size: {
      type: String,
      default: 'mini'
    },
    align: {
      type: String,
      default: 'center'
    },
    highlightCurrentRow: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: true
    },
    stripe: {
      // 是否显示斑马线
      type: Boolean,
      default: false
    },
    showOverflowTooltip: {
      type: Boolean,
      default: true
    },
    maxHeight: {
      type: Number
    },
    height: {
      type: Number
    },
    isSelection: {
      // 是否显示多选框
      type: Boolean,
      default: true
    },
    isCustomeOperation: {
      type: Boolean,
      default: false
    },
    operations: Array,
    customOperationWith: Number,
    showPagination: {
      type: Boolean,
      default: true
    },
    isShowIndex: {
      type: Boolean,
      default: false
    },
    fixed: String,
    customHead: {
      type: Boolean,
      default: true
    }
  },
  components: {
    // CnButton
  },
  data: function() {
    return {
      // 分页信息
      pageRequest: {
        pageNo: 1,
        pageSize: 10
      },
      loading: false,
      loadingText: '正在加载数据，请稍后...',
      selectColums: [],
      abc: 'wolaile'
    }
  },
  methods: {
    handleSelectionChange: function(val) {
      this.selectColums = val
      this.$emit('getSelectColums', val)
    },
    selectAll(selection) {
      this.$emit('selectAll', selection)
    },
    onSelect: function(selection, row) {
      // this.selectColums = val
      this.$emit('onSelect', selection, row)
    },
    currentChange: function() {},
    handelCurrentChange: function(pageNo) {
      this.pageRequest.pageNo = pageNo
      this.findPage()
    },
    findPage: function() {
      var $this = this
      $this.loading = true
      let callback = function(res) {
        $this.loading = false
      }
      this.$emit('findPage', {
        pageRequest: this.pageRequest,
        callback: callback
      })
    },
    handleView: function(index, row) {},
    clickFun: function(funName, rows, index = null) {
      let $this = this
      $this.loading = true
      let callback = function(res) {
        $this.loading = false
      }

      if (_.isFunction(funName)) {
        funName({ rows: rows, callback: callback, index: index })
      } else {
        this.$emit(funName, { rows: rows, callback: callback })
      }
    },
    isFn(fn) {
      return _.isFunction(fn)
    }
  }
}
</script>

<style>
.custom-head .el-table__header th,
.custom-head .el-table__header tr {
  padding: 10px 0;
  background-color: #EDF2FC;
  font-family: Source Han Sans CN;
  font-size: 14px;
}
.cn-table .toolbar {
  margin: 20px 0;
}
</style>
