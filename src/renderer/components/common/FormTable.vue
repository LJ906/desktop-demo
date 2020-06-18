<template>
  <div class="common-table-wrp">
    <!-- <h1 class="common-table-title">标题</h1> -->
    <el-container class="common-table">
      <el-header
        v-if="searchBar"
        align="left"
        :class="['common-table-head', {'min-height60':searchBar}]"
        style="height: auto"
      >
        <base-search-bar
          v-bind="$attrs"
          v-model="queryForm"
          :conditions="conditions"
          :labelWidth="labelWidth"
          :operationsBtn="operationsBtn"
          @event="getQueryForm"
          :immediate="isRenderImmediate"
        >
          <!-- <div class="btn-bar"> -->
          <cn-button
            v-if="permsAdd != 'false'"
            type="primary"
            size="small"
            :perms="permsAdd"
            icon="el-icon-circle-plus-outline"
            @click="add()"
            label="新增"
          ></cn-button>
          <!-- </div> -->
          <!-- <div  class="btn-bar"> -->
          <cn-button
            v-if="importExport || importExportBtnsOption.includes('import')"
            type="success"
            size="small"
            @click="importData()"
            label="导入"
          ></cn-button>
          <!-- </div> -->
          <!-- <div> -->
          <cn-button
            v-if="importExport || importExportBtnsOption.includes('export')"
            type="success"
            size="small"
            icon
            @click="exportData()"
            label="导出"
          ></cn-button>
          <!-- </div> -->
          <!-- <div> -->
          <slot name="otheOperBtn" :selectColumns="selectColumns">
            <cn-button
              v-if="permsDel && showMultipleDel"
              type="danger"
              size="small"
              :perms="permsDel"
              icon="el-icon-delete"
              @click="multipleDel(selectColumns)"
              label="删除"
            ></cn-button>
          </slot>
          <!-- </div> -->
          <slot name="serchBarBtn" :queryForm="Object.assign({}, {reservedParams, queryForm})"></slot>
        </base-search-bar>
      </el-header>

      <el-main class="common-table-main">
        <div class="data-table">
          <el-table
            :data="resultList"
            :highlight-current-row="highlightCurrentRow"
            @selection-change="handleSelectionChange"
            :border="border"
            :stripe="stripe"
            :show-overflow-tooltip="showOverflowTooltip"
            :max-height="tableHeight"
            :size="size"
            :align="align"
            :head-align="align"
            @current-change="currentChange"
            :row-key="getRowKeys"
            @expand-change="expandChange"
            :expand-row-keys="expandList"
            :cell-class-name="cellClassName"
            @cell-click="cellClick"
            :height="tableHeightFromFather ? tableHeightFromFather : tableHeight"
          >
            <el-table-column v-if="childColumns && childColumns.length > 0" type="expand">
              <template slot-scope="props">
                <el-table
                  :data="childResult[props.row.id]"
                  :border="border"
                  :stripe="stripe"
                  :show-overflow-tooltip="showOverflowTooltip"
                >
                  <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
                  <template v-for="(column, index) in childColumns">
                    <el-table-column
                      :key="index"
                      v-if="column.hidden==true || column.hiddenInTable ? false:true"
                      :label="column.label"
                      :width="column.width"
                      :min-width="column.minWidth"
                      :fixed="column.fixed"
                      :sortable="column.sortable==null?false:column.sortable"
                      :prop="column.prop"
                      :formatter="column.formatter"
                      header-align="center"
                      align="center"
                      :size="size"
                    ></el-table-column>
                  </template>
                  <el-table-column
                    header-align="center"
                    align="center"
                    label="操作"
                    fixed="right"
                    :width="customOperationWith"
                    :min-width="operationMinWidth"
                  >
                    <template slot-scope="scope">
                      <cn-button
                        type="success"
                        :plain="plain"
                        size="mini"
                        :perms="permsEdit"
                        label="编辑"
                        @click="editChild(scope.row)"
                      ></cn-button>
                      <cn-button
                        type="danger"
                        :plain="plain"
                        :perms="permsDel"
                        size="mini"
                        label="删除"
                        @click="deleteChildData(scope.row)"
                      ></cn-button>
                      <cn-button
                        v-for="operation in childOperations"
                        :type="operation.type"
                        :key="operation.name"
                        :label="operation.label"
                        :size="size"
                        @click="clickFun(operation.clickName, scope.row)"
                      />
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column v-if="isSelection" type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
            <template v-for="(column, index) in columns">
              <el-table-column
                :key="index"
                v-if="column.hidden==true || column.hiddenInTable ?false:true"
                :label="column.label"
                :width="column.width"
                :min-width="column.minWidth"
                :fixed="column.fixed"
                :sortable="column.sortable==null?false:column.sortable"
                :prop="column.prop"
                :formatter="column.formatter"
                header-align="center"
                align="center"
                :size="size"
              ></el-table-column>
            </template>
            <el-table-column
              v-if="isShowOperation"
              header-align="center"
              align="center"
              label="操作"
              fixed="right"
              :width="customOperationWith"
              :min-width="operationMinWidth"
            >
              <template slot-scope="scope">
                <cn-button
                  v-if="permsEdit"
                  type="primary"
                  :plain="plain"
                  size="mini"
                  :perms="permsEdit"
                  :label="editLabel? editLabel: '编辑'"
                  @click="edit(scope.row)"
                  ref="editBtn"
                ></cn-button>
                <cn-button
                  v-if="permsDel && showDel"
                  type="danger"
                  :plain="plain"
                  :perms="permsDel"
                  size="mini"
                  label="删除"
                  @click="deleteData(scope.row)"
                ></cn-button>
                <cn-button
                  v-if="childColumns && childColumns.length > 0"
                  type="success"
                  :plain="plain"
                  :perms="permsEdit"
                  size="mini"
                  label="添加明细"
                  @click="addChildData(scope.row)"
                ></cn-button>
                <cn-button
                  v-for="operation in operations"
                  :perms="operation.perms"
                  :type="operation.type"
                  :key="operation.name"
                  :label="operation.label"
                  :plain="plain"
                  size="mini"
                  @click="clickFun(operation.clickFunction, scope.row, scope.$index)"
                ></cn-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="toolbar" v-if="isViewPage">
            <el-pagination
              background
              layout="total, prev, pager, next, jumper"
              :current-page.sync="page.pageNo"
              @current-change="handelCurrentChange"
              :page-size="page.pageSize"
              :total="total"
              align="right"
            ></el-pagination>
          </div>
        </div>
        <!-- 编辑页面 -->
        <el-dialog
          :title="diaTitle ? diaTitle : title"
          :visible.sync="addDialogVisible"
          width="750px"
          :before-close="handleClose"
          :modal-append-to-body="false"
        >
          <!--{{dataForm}}-->
          <base-form
            :formFlag="formFlag"
            v-bind="$attrs"
            v-on="$listeners"
            v-if="addDialogVisible"
            :items="editFormColumns"
            @send="ref => dataFormPage = ref"
            @bind="obj => dataForm = $_.merge(obj, dataOrigin)"
          ></base-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancelSave" size="small">{{cancelText ? cancelText : '取 消'}}</el-button>
            <el-button
              v-show="isShowConfirm"
              type="primary"
              size="small"
              @click="saveData()"
              :saveLoading="saveLoading"
            >确 定</el-button>
          </div>
        </el-dialog>
        <!--数据导入框-->
        <el-dialog title="提示" :visible.sync="importDialogVisible" width="30%">
          <form>
            <input type="file" name="fileup" id="uploadEventFile" />
          </form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="importDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleImport">确 定</el-button>
          </span>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import CnButton from '../common/CnButton'
import BaseSearchBar from './SearchBar'
import BaseForm from './AddForm'
import _ from 'lodash'

export default {
  components: {
    CnButton,
    BaseSearchBar,
    BaseForm
  },
  props: {
    columns: Array,
    tableChild: Object,
    parameters: Object,
    conditions: Array,
    PageSizefromFather: Number,
    searchBar: {
      type: Boolean,
      default: true
    },
    url: {
      type: String,
      default: ''
    },
    isCustomeOperation: {
      // 是否有自定义操作列
      type: Boolean,
      default: false
    },
    operations: Array,
    customOperationWith: {
      type: Number,
      default: null
    },
    permsAdd: {
      type: String,
      default: null
    },
    permsEdit: {
      type: String,
      default: null
    },
    permsDel: {
      type: String,
      default: null
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
    isSelection: {
      // 是否显示多选框
      type: Boolean,
      default: false
    },
    customOrderby: {
      // 排序
      type: String,
      default: ''
    },
    importExport: {
      type: Boolean,
      default: false
    },
    importExportBtnsOption: {
      // 显示几个导入，导出功能中的部分，要显示那个传那个
      type: Array,
      default: () => {
        return ['template', 'export', 'import']
      }
    },
    childColumns: Array,
    childUrl: {
      type: String,
      default: ''
    },
    parentKey: {
      type: String,
      default: ''
    },
    childOrderBy: {
      // 子表排序字段
      type: String,
      default: ''
    },
    childOperations: Array,
    conditionSpan: {
      type: Number,
      default: 3
    },
    isPageJumpTo1: {
      // 是否从第一页开始查询针对有查询按钮的筛选条件
      ype: Boolean,
      default: false
    },
    toggleIsPageJumpTo1: {
      // 切换isPageJumpTo1
      type: Function,
      default: function() {}
    },
    tableHeightFromFather: {
      type: Number
    },
    keepMultipleSelectArr: {
      // 添加弹框中的下拉多选项目传递数组
      type: Boolean,
      default: false
    },
    exportParams: {
      // 导出参数;
      type: Object,
      default: () => {}
    },
    importParams: Number, // 导入参数 数字格式
    isMultipleDelBtn: {
      type: Boolean,
      default: true
    },
    isViewPage: {
      type: Boolean,
      default: true
    },
    labelWidth: { type: String }, // 新增

    isShowOperation: {
      // 新增是否显示表格中的操作列
      type: Boolean,
      default: true
    },
    isRenderImmediate: {
      // 初始化时是否请求数据
      type: Boolean,
      default: true
    },
    allValue: Boolean,
    isEditSingle: {
      // 是否在父组件中单独编辑，true不会触发这里的编辑
      type: Boolean,
      default: false
    },
    isAddSingle: {
      // 是否在父组件中单独添加弹框
      type: Boolean,
      default: false
    },
    hiddenSearchBtn: {
      type: Boolean,
      default: false
    },
    tableUrl: {
      type: String,
      default: ''
    },
    refreshFindPage: {
      type: Boolean,
      default: false
    },
    addClassCol: {
      type: Object
    },
    requestMethod: {
      type: String,
      default: 'get'
    },
    showMultipleDel: {
      type: Boolean,
      default: false
    },
    showDel: {
      // 默认有删除按钮
      type: Boolean,
      default: true
    },
    isShowConfirm: {
      type: Boolean, // 添加框中是否显示确定按钮
      default: true
    },
    diaTitle: String,
    editLabel: String,
    cancelText: String
  },
  data() {
    return {
      // 修改start
      saveLoading: false,
      queryForm: {},
      operationsBtn: [
        {
          type: 'primary',
          label: '查询',
          size: 'small',
          icon: 'el-icon-search',
          hidden: this.hiddenSearchBtn,
          event: this.handleSearch
        }
      ],
      // end
      operationMinWidth: 180,
      isChangeEvent: true, // 查询条件change后调用event方法
      dataFormPage: null,
      tableHeight:
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight - 180,
      resultList: [],
      total: 0,
      page: {
        pageNo: 1,
        pageSize: 10
      },
      addDialogVisible: false,
      selectColumns: [], // 列表选中行
      formLabelWidth: '35%',
      title: '新增',
      dataForm: {},
      dataOrigin: {},
      // conditionSpan: 3,
      plain: false,
      addRound: false,
      editFormColumns: [],
      // 子表
      childResult: {
        '84cbfcd6458c441e9a7e50e8b59fe005': []
      },
      addChildDialogVisible: false,
      expandList: [],
      formFlag: '',
      importExportBtns: [
        {
          prop: 'template',
          icon: 'fa fa-upload',
          label: '导出模板',
          event: this.exportTemplate
        },
        {
          prop: 'export',
          icon: 'fa fa-upload',
          label: '导出数据',
          event: this.exportData
        },
        {
          prop: 'import',
          icon: 'fa fa-download',
          label: '导入数据',
          event: this.importData
        }
      ],
      importDialogVisible: false
    }
  },

  methods: {
    getRowKeys(row) {
      return row.id
    },
    expandChange: async function(row, expandedRows) {
      if (expandedRows && expandedRows.length > 0) {
        let parentId = row.id
        let data = await this.findChildPage(parentId)
        this.$nextTick(res => {
          this.$set(this.childResult, parentId, data)
        })
      }
    },
    handleSelectionChange: function(val) {
      this.selectColumns = val
    },
    currentChange() {},
    handelCurrentChange: function(pageNo) {
      this.page.pageNo = pageNo
      this.findPage()
    },
    handleCancelSave() {
      this.addDialogVisible = false
      this.$emit('onCancelSave')
    },
    handleClose: function(done) {
      // this.clearValidate(this.dataFormPage)
      this.dataForm = {}
      this.dataOrigin = {}
      done()
      this.$emit('onCancelSave')
    },
    findChildPage: async function(parentId) {
      let data = []
      let parentParam = {
        pageSize: -1
      }
      parentParam[this.parentKey] = parentId

      const res = await this.$get(this.childUrl + '/asyInitial', parentParam)
      if (res) {
        data = res.result ? res.result : []
      } else {
        this.$message({ message: res.message, type: 'error' })
      }
      return data
    },
    findPage: function(params, callback) {
      this.resultList = []
      // this.total = 0;
      let listUrl = this.tableUrl || this.url + '/asyInitial'
      if (this.requestMethod === 'post' || this.requestMethod === 'POST') {
        this.$post(listUrl, { ...this.reservedParams, ...this.queryForm })
          .then(res => {
            if (res) {
              this.resultList = res.result
              this.total = res.totalNum
            } else {
              this.$message({ message: res.message, type: 'error' })
            }
          })
          .catch(_ => {
            this.$message({ message: '请求失败！', type: 'error' })
          })
      } else {
        this.$get(listUrl, { ...this.reservedParams, ...this.queryForm })
          .then(res => {
            if (res) {
              this.resultList = res.result
              this.total = res.totalNum
            } else {
              this.$message({ message: res.message, type: 'error' })
            }
          })
          .catch(_ => {
            this.$message({ message: '请求失败！', type: 'error' })
          })
      }
      callback && callback()
    },
    deleteData: async function(row) {
      if (this.childColumns && this.childColumns.length > 0) {
        let data = await this.findChildPage(row.id)
        if (data && data.length > 0) {
          this.$message({
            message: '该数据下有子数据，不能进行此操作！',
            type: 'error'
          })
        } else {
          this.$confirm('确认删除该条数据吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            // center: true
          })
            .then(() => {
              this.commonDelete(this.url, row)
            })
            .catch(() => {})
        }
      } else {
        this.$confirm('确认删除该条数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          // center: true
        }).then(() => {
          this.commonDelete(this.url, row)
        })
      }
    },
    deleteChildData: function(row) {
      this.$confirm('确认删除该条数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.commonDelete(this.childUrl, row)
      })
    },
    commonDelete: function(url, row) {
      let array = []
      this.$post(url + '/asyDelete', _.concat(array, row)).then(res => {
        if (res.state === 0) {
          this.$message({ message: '删除成功！', type: 'success' })
          this.findPage()
        } else {
          this.$message({ message: res.msg, type: 'error' })
        }
      })
    },
    clearValidate(formRef) {
      if (formRef) {
        formRef.resetFields()
        formRef.clearValidate()
      }
    },
    add: function() {
      // 单独在父组件中添加
      if (this.isAddSingle) {
        return this.$emit('onClickAdd')
      }
      this.title = '新增'
      this.dataForm = {}
      this.dataOrigin = {}
      this.addDialogVisible = true
      this.editFormColumns = _.assign([], this.columns)
      this.formFlag = 'add'
      this.$emit('getAddDialogState', this.addDialogVisible)
    },
    edit: function(row) {
      if (this.isEditSingle) {
        return this.$emit('onClickEdit', row)
      }
      this.addDialogVisible = true
      this.$emit('getAddDialogState', this.addDialogVisible)
      this.title = '编辑'

      this.editFormColumns = _.assign([], this.columns)
      // let _row = this.multipleSelect(row);
      // 改 keepMultipleSelectArr 默认false， true 时不用转成字符串，保持数组形式
      let _row = {}
      if (!this.keepMultipleSelectArr) {
        _row = this.multipleSelect(row)
      } else {
        _row = row
      }

      // 处理一个字段回显2个输入框的情况
      let neeDivItem = _.filter(this.editFormColumns, o => {
        return o.dividedProps
      })
      neeDivItem.forEach(ele => {
        if (row[ele.prop]) {
          let val = row[ele.prop].split('*')
          ele.dividedProps.forEach((item, i) => {
            _row[item] = val[i]
          })
        }
      })

      // 编辑时是否传row 中的所有数据
      this.dataOrigin = _.assign({}, _row)
      this.formFlag = 'edit'
    },
    saveData: function() {
      let equal = _.isEqual(this.editFormColumns, this.childColumns)
      let _url = equal ? this.childUrl : this.url

      let data = _.assign({}, this.dataForm)
      this.dataFormPage.validate(valid => {
        if (valid) {
          // 处理下拉框多选问题
          let cols = _.assign([], equal ? this.childColumns : this.columns)
          if (!this.keepMultipleSelectArr) {
            // keepMultipleSelectArr 默认false， true 时不用转成字符串，保持数组形式
            let multipleSelect = _.filter(cols, function(o) {
              return o.type === 'select' && o.multiple
            })
            _.forEach(multipleSelect, function(o) {
              let value = data[o.prop]
              data[o.prop] = value.length > 0 ? _.join(value, ';') : ''
            })
          }

          // 处理级联选择器(取最后一个值)
          let cascaderSelect = _.filter(cols, o => o.type === 'cascader')
          _.forEach(cascaderSelect, o => {
            let key = o.prop
            let val = data[o.prop]
            val = Array.isArray(val) ? _.last(val) : val
            if (key.indexOf('.') >= 0) {
              let obj = {}
              obj[key.split('.')[1]] = val
              data[key.split('.')[0]] = obj
            } else {
              data[key] = val
            }
          })

          this.saveLoading = true

          // debu
          this.$post(_url + '/asySave', data)
            .then(res => {
              this.saveLoading = false
              if (res.state === 0) {
                this.addDialogVisible = false
                this.findPage()
                let notice =
                  this.formFlag === 'add'
                    ? '新增'
                    : this.formFlag === 'edit'
                      ? '编辑'
                      : this.formFlag === 'addChild'
                        ? '添加明细'
                        : '编辑明细'
                this.$message({ message: notice + '成功', type: 'success' })
                this.$emit('onSaveSuccess')
              } else {
                this.$message({ message: res.message, type: 'error' })
              }
            })
            .catch(_ => {
              this.saveLoading = false
              this.$message.error('数据连接失败')
            })
        }
      })
    },
    multipleSelect: function(row) {
      // 处理下拉框多选问题
      let cols = _.assign([], this.editFormColumns)
      let multipleSelect = _.filter(cols, function(o) {
        return o.type === 'select' && o.multiple
      })
      _.forEach(multipleSelect, function(o) {
        let value = row[o.prop]
        row[o.prop] =
          !_.isNull(value) && !_.isNaN(value) && value !== undefined
            ? _.split(value, ';')
            : []
      })

      return row
    },
    editChild: function(row) {
      this.addDialogVisible = true
      this.title = '编辑'
      this.editFormColumns = _.assign([], this.childColumns)
      let _row = this.multipleSelect(row)
      this.dataOrigin = _.assign({}, _row)
      // this.formFlag = 'edit';
      this.formFlag = 'editChild'
    },
    addChildData: function(row) {
      let parentid = row.id
      this.title = '添加明细'
      this.addDialogVisible = true
      this.editFormColumns = _.assign([], this.childColumns)
      let param = {}
      let _parentKey = this.parentKey
      if (_parentKey.indexOf('.') >= 0) {
        let _p = {}
        _p[_.split(_parentKey, '.')[1]] = parentid
        param[_.split(_parentKey, '.')[0]] = _p
      } else {
        param[this.parentKey] = parentid
      }
      this.dataOrigin = _.assign({}, param)
      // this.formFlag = 'add';
      this.formFlag = 'addChild'
    },
    clickFun: function(funName, rows, index) {
      // 操作按钮点击事件
      let callback = function(res) {
        this.findPage()
      }
      if (_.isFunction(funName)) {
        funName(rows, index)
        // this.findPage();
      } else {
        this.$emit(funName, { rows: rows, callback: callback, index: index })
      }
    },
    cellClick: function(row, column, cell, event) {
      // 单元格点击事件
      let prop = column.property
      let funName =
        this.columns.find(o => o.prop === prop && o.cellClick) &&
        this.columns.find(o => o.prop === prop && o.cellClick).clickName
      let callback = function(res) {}
      if (!funName) return false
      if (_.isFunction(funName)) {
        funName(row)
      } else {
        this.$emit(funName, { rows: row, callback: callback })
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return ''
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (this.addClassCol && this.addClassCol.prop.includes(column.property)) {
        return this.addClassCol.colClassName
      }
      return ''
    },
    exportTemplate: function() {
      this.$download(this.url + '/export/template', this.exportParams)
    },
    exportData: function() {
      // 处理导出搜索栏字段带点的问题转成对象形式
      let searchParam = {}
      Object.keys(this.queryForm).forEach(prop => {
        if (prop.includes('.')) {
          let key = prop.split('.')[0]
          let key2 = prop.split('.')[1]
          let tempobj = {}
          tempobj[key2] = this.queryForm[prop]
          searchParam[key] = { ...searchParam[key], ...tempobj }
        } else {
          searchParam[prop] = this.queryForm[prop]
        }
      })
      return this.$download(this.url + '/export', {
        ...this.exportParams,
        ...this.reservedParams,
        ...searchParam
      })
    },
    importData: function() {
      this.importDialogVisible = true
      if (document.getElementById('uploadEventFile')) {
        document.getElementById('uploadEventFile').value = ''
      }
    },
    handleImport: function() {
      let vm = this
      let uploadEventFile = document.getElementById('uploadEventFile').value
      let files = document.getElementById('uploadEventFile').files
      let file = files[0]
      if (uploadEventFile === '') {
        this.$message({ message: '请选择需要上传的数据文件！', type: 'info' })
      } else if (
        uploadEventFile.lastIndexOf('.xls') > 0 ||
        uploadEventFile.lastIndexOf('.XLS') > 0 ||
        uploadEventFile.lastIndexOf('.xlsx') > 0 ||
        uploadEventFile.lastIndexOf('.XLSX') > 0
      ) {
        let formData = new FormData()
        formData.append('file', file)

        if (this.importParams) {
          formData.append('groups', this.importParams)
        }

        vm.$post(vm.url + '/import', formData).then(res => {
          if (res.code === 2000) {
            this.importDialogVisible = false
            this.findPage()
            this.$message({ message: res.msg, type: 'success' })
          } else {
            this.$message({ message: res.msg, type: 'error' })
          }
        })
      } else {
        this.$message({ message: '请选择正确的EXCEL文件！', type: 'error' })
      }
    },
    // 批量删除
    multipleDel(selectColumns) {
      if (!this.selectColumns || !this.selectColumns.length) {
        return this.$message.warning('请选择要删除的数据！')
      }

      this.$confirm('您确定要删除所有选中的数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        // center: true
      }).then(() => {
        this.hanldeMultipleDele(this.url, this.selectColumns)
      })
    },
    hanldeMultipleDele(url, rowArr) {
      this.$post(url + '/asyDeleteList', rowArr)
        .then(res => {
          if (res.state === 0) {
            this.$message.success(res.msg)
            this.findPage()
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(_ => {
          this.$message.error('网络失败')
        })
    },

    // 查询
    handleSearch(queryForm) {
      let formData = this.formedQueryForm(queryForm)
      this.queryForm = formData
      this.findPage(formData)
    },
    // 同步query
    getQueryForm(queryForm) {
      let formData = this.formedQueryForm(queryForm)
      this.queryForm = formData
    },
    formedQueryForm(queryForm) {
      let formData = {}
      Object.keys(queryForm).forEach(o => {
        if (queryForm[o] !== undefined && queryForm[o] !== '') {
          formData[o] = queryForm[o]
        }
      })
      if (this.conditions && this.conditions.length) {
        // 处理时间范围时
        this.conditions.forEach(o => {
          if (
            (o.type === 'daterange' && o.rangeProp) ||
            (o.type === 'datetimerange' && o.rangeProp)
          ) {
            if (formData[o.prop] && o.rangeProp.length === 2) {
              delete formData[o.prop]
            }
          }
        })
      }
      return formData
    },
    // table自适应高度
    setTableHeight() {
      if (this.tableHeightFromFather) return false
      let clientHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight
      let headHeight = document.querySelector('.el-header').offsetHeight || 0
      let searchBarH =
        document.querySelector('.common-table-head').offsetHeight || 0
      this.tableHeight = clientHeight - headHeight - searchBarH - 230 // 180
    }
  },
  computed: {
    reservedParams() {
      let p = _.assign({}, this.parameters)
      return _.merge(
        {
          pageNo: this.page.pageNo,
          pageSize: this.page.pageSize
          // 'orderBy': this.customOrderby
        },
        p
      )
    },
    formImportExportBtnsOption() {
      if (!this.importExportBtnsOption) {
        return this.importExportBtns
      } else {
        let options = []
        this.importExportBtnsOption.forEach(item => {
          let optionItem = _.filter(this.importExportBtns, o => o.prop === item)
          options = [...options, ...optionItem]
        })
        return options
      }
    }
  },
  watch: {
    columns(val) {
      let that = this
      if (val.length > 0) {
        let objs = val.filter(function(item) {
          return item.prop.indexOf('.') >= 0 && item.type === 'select'
        })
        objs.forEach(function(item) {
          let obj = {}
          let key = item.prop
          obj[key.split('.')[1]] = ''
          that.dataForm[key.split('.')[0]] = obj
          that.dataOrigin[key.split('.')[0]] = obj
        })
        this.findPage()
      }
    },
    parameters: {
      deep: true,
      handler(val) {
        if (this.isPageJumpTo1) {
          // 是否从第一页开始查询 （条件筛选的重置）
          this.page.pageNo = 1
          this.toggleIsPageJumpTo1(false)
        }
        this.findPage()
      }
    },
    refreshFindPage(newVal, oldVal) {
      if (newVal) {
        this.findPage()
      }
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.setTableHeight()
      })()
    }

    if (!this.searchBar) this.findPage()
    // 进页面初始化
    if (this.isRenderImmediate) {
      this.findPage(null, () => {
        this.$nextTick(_ => {
          this.setTableHeight()
        })
      })
    }
  }
}
</script>

<style>
.common-table-wrp {
  background: #fff;
  padding: 0 20px 20px;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow: auto;
}
.common-table-title {
  height: 40px;
  font: bold 18px/18px Source Han Sans CN;
  color: rgba(51, 51, 51, 1);
}
.common-table-main {
  /* width: 100%; */
  /* padding-top: 1px; */
  /* border: 1px solid #e5e5e5; */
}
.common-table .btn-bar {
  margin-right: 8px;
}

.common-table-head {
  padding: 10px 0;
  background-color: #fff;
}

.common-table-main {
  padding: 0;
}
.min-height60 {
  min-height: 70px;
}
.min-height32 {
  min-height: 32px;
}
.popover-btn {
  padding: 9px 7px;
}

.common-table .el-dialog__header {
  border-bottom: 1px solid #e5e5e5;
}

.common-table .el-dialog__footer {
  border-top: 1px solid #e5e5e5;
}
/* 修改end */
.common-table >>> .el-dialog .el-dialog__header {
  text-align: left;
  border-bottom: 1px solid #e1c8c8;
}

.common-table .el-table__header th,
.common-table .el-table__header tr {
  padding: 10px 0;
  background-color: #EDF2FC;;
  font-family: Source Han Sans CN;
  font-size: 14px;
}
.data-table >>> .el-table__body-wrapper {
  max-height: 100% !important;
  height: 100%;
}

.linkclass {
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}
</style>
