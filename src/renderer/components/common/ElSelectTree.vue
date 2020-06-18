<template>
  <el-select
    v-model="resultData[prop]"
    :clearable="clearable"
    @clear="clearHandle"
    :placeholder="`请选择${selLabel}`"
  >
    <el-option :value="resultData[prop]" :label="resultData.label" style="height: auto">
      <el-tree
        id="tree-option"
        ref="selectTree"
        :accordion="accordion"
        :data="options"
        :props="props"
        :show-checkbox="showCheckbox"
        :node-key="props.value"
        :default-expanded-keys="defaultExpandedKey"
        :defaultCheckedKeys="defaultCheckedKeys"
        @node-click="handleNodeClick"
        @check="checkChange"
      ></el-tree>
    </el-option>
  </el-select>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'ElSelectTree',
  props: {
    /* 配置项 */
    props: {
      type: Object,
      default: () => {
        return {
          value: 'id', // ID字段名
          label: 'title', // 显示名称
          children: 'children' // 子级字段名
        }
      }
    },
    /* 选项列表数据(树形结构的对象数组) */
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    /* 初始值 */
    value: {
      type: String,
      default: () => {
        return ''
      }
    },
    /* 可清空选项 */
    clearable: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    /* 自动收起 */
    accordion: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    selLabel: {
      type: String,
      default: ''
    },
    prop: String,
    showCheckbox: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaultExpandedKey: [],
      defaultCheckedKeys: [],
      resultData: {}
    }
  },
  mounted() {
    this.initHandle()
  },
  created() {
    if (this.prop.indexOf('.') > 0) {
      let obj = {}
      obj[_.split(this.prop, '.')[1]] = this.value ? this.value : ''
      this.resultData[_.split(this.prop, '.')[0]] = obj
    } else {
      this.resultData[this.prop] = this.value ? this.value : ''
    }
    this.resultData['label'] = ''
  },
  methods: {
    // 初始化值
    initHandle() {
      if (this.value && !this.showCheckbox) {
        this.resultData['label'] = this.$refs.selectTree.getNode(
          this.value
        ).data[this.props.label] // 初始化显示
        this.$refs.selectTree.setCurrentKey(this.value) // 设置默认选中
        this.defaultExpandedKey = [this.value] // 设置默认展开
      } else if (this.value && this.showCheckbox) {
        // 多选回显checkbox value 默认逗号分隔
        let checkedIds = this.value.split(',')
        this.$refs.selectTree.setCheckedKeys(checkedIds) // 设置默认选中
        this.defaultExpandedKey = [...checkedIds] // 设置默认展开
        let nodeNames = this.$refs.selectTree.getCheckedNodes() || []
        let labels = nodeNames.map(n => n[this.props.label]).join()
        this.resultData['label'] = labels
      }
      this.$nextTick(() => {
        /* let scrollWrap = document.querySelectorAll('.el-scrollbar .el-select-dropdown__wrap')[0]
        let scrollBar = document.querySelectorAll('.el-scrollbar .el-scrollbar__bar')
        scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;'
        scrollBar.forEach(ele => ele.style.width = 0) */
      })
    },
    // 切换选项
    handleNodeClick(node) {
      if (this.showCheckbox) return false
      this.prop.indexOf('.') > 0
        ? (this.resultData[_.split(this.prop, '.')[0]][_.split(this.prop, '.')[1]] = node.id)
        : (this.resultData[this.prop] = node.id)
      this.resultData['label'] = node[this.props.label]
      let _resultData = _.assign({}, this.resultData)
      delete _resultData.label
      this.$emit('getValue', _resultData)
      this.defaultExpandedKey = []
    },
    // 多选情况
    checkChange(node, dataChecked) {
      if (this.showCheckbox) {
        let checkedKeys = dataChecked.checkedKeys
        let checkedNames = dataChecked.checkedNodes.map(o => o[this.props.label])
        this.prop.indexOf('.') > 0
          ? (this.resultData[_.split(this.prop, '.')[0]][_.split(this.prop, '.')[1]] = checkedKeys.join(','))
          : (this.resultData[this.prop] = checkedKeys.join(','))
        this.resultData['label'] = checkedNames.join(',')
        let _resultData = _.assign({}, this.resultData)
        delete _resultData.label
        this.$emit('getValue', _resultData)
        this.defaultExpandedKey = []
      }
    },
    // 清除选中
    clearHandle() {
      this.prop.indexOf('.') > 0
        ? (this.resultData[_.split(this.prop, '.')[0]][_.split(this.prop, '.')[1]] = '')
        : (this.resultData[this.prop] = '')
      this.resultData['label'] = ''
      this.defaultExpandedKey = []
      // 清空多选checkbox
      this.$refs.selectTree.setCheckedKeys([])

      this.clearSelected()
      let _resultData = _.assign({}, this.resultData)
      delete _resultData.label
      this.$emit('getValue', _resultData)
    },
    /* 清空选中样式 */
    clearSelected() {
      let allNode = document.querySelectorAll('#tree-option .el-tree-node')
      allNode.forEach(element => element.classList.remove('is-current'))
    }
  },
  watch: {
    value() {
      // this.resultData[this.prop] = this.value;
      this.initHandle()
    }
  }
}
</script>

<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
}
.el-select-dropdown__item.selected {
  font-weight: normal;
}
ul li >>> .el-tree .el-tree-node__content {
  height: auto;
  padding: 0 20px;
}
.el-tree-node__label {
  font-weight: normal;
}
.el-tree >>> .is-current .el-tree-node__label {
  color: #409eff;
  font-weight: 700;
}
.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}
</style>
