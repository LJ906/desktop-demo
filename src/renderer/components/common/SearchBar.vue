<template>
  <div class="con-search-bar">
    <el-form
      inline
      class="searchBarForm"
      ref="searchBarForm"
      :model="value"
      :size="size"
      :label-width="labelWidth"
    >
      <el-row>
        <el-col
          :xl="{span:condition.xlSpan ? condition.xlSpan : xlSpan}"
          :lg="{span:condition.lgSpan ? condition.lgSpan : lgSpan}"
          :md="{span:condition.mdSpan ? condition.mdSpan : mdSpan}"
          :sm="{span:condition.smSpan ? condition.smSpan : smSpan}"
          v-for="(condition, i) in conditions"
          :hidden="condition.hidden"
          :key="condition.prop + i"
        >
          <template v-if="!condition.hidden">
            <el-form-item
              :label="condition.label"
              class="search-bar-item"
              :labelWidth="condition.labelWidth"
            >
              <SelectTree
                ref="selectTreeRef"
                v-if="condition.type==='tree'"
                :props="condition.defaultProps"
                :selLabel="condition.label"
                :options="condition.treeData"
                :clearable="condition.clearable"
                :accordion="condition.accordion"
                :value="condition.value"
                :prop="condition.prop"
                @getValue="getValue($event)"
              />

              <el-select
                v-else-if="condition.type==='select' || condition.option"
                v-model="condition.value"
                :multiple="condition.multiple"
                collapse-tags
                :multiple-limit="condition.multipleLimit || 3"
                @change="eventHandler(condition, condition.value)"
                clearable
              >
                <el-option v-if="allValue" label="全部" key value></el-option>
                <el-option v-for="(v, k) in condition.option" :key="k + v" :label="v" :value="k"></el-option>
              </el-select>

              <el-date-picker
                v-else-if="condition.type == 'date' || condition.type == 'datetime'"
                :type="condition.type"
                v-model="condition.value"
                placeholder="选择日期"
                clearable
                :value-format="condition.type == 'date'?'yyyy-MM-dd':'yyyy-MM-dd HH:mm:ss'"
              ></el-date-picker>
              <el-date-picker
                v-else-if="condition.type == 'daterange' || condition.type == 'datetimerange'"
                v-model="condition.value"
                :type="condition.type"
                range-separator="至"
                :value-format="condition.type == 'daterange'?'yyyy-MM-dd':'yyyy-MM-dd HH:mm:ss'"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="handleDateRangeChange(condition, condition.value)"
              ></el-date-picker>
              <el-date-picker
                v-else-if="condition.type === 'year'"
                :type="condition.type"
                v-model="condition.value"
                placeholder="选择年份"
                value-format="yyyy"
                style="width: 100%;"
              ></el-date-picker>
              <el-checkbox v-else-if="condition.type == 'checkbox' " v-model.trim="condition.value"></el-checkbox>
              <el-input
                v-else
                clearable
                :type="condition.type"
                v-model.trim="condition.value"
                autocomplete="off"
                @change="handleInpChange(condition, condition.value)"
                :placeholder="condition.placeholder? condition.placeholder : '请输入'"
              >
                <template v-if="condition.slot" :slot="condition.slot.name">
                  <el-button
                    @click="clickInputSlot(condition)"
                    :icon="condition.slot.icon"
                  >{{condition.slot.title}}</el-button>
                </template>
              </el-input>
            </el-form-item>
          </template>
        </el-col>
        <!-- 操作项 -->
        <el-col
          class="operations-btn-wrp"
          :xl="{span: operationsBtnXlSpan}"
          :lg="{span: operationsBtnLgSpan}"
          :md="{span: operationsBtnMdSpan}"
          :sm="{span: operationsBtnSmSpan}"
          v-if="operationsBtn && operationsBtn.length && !btnInNewLine"
        >
          <template v-for="(operation, i) in operationsBtn">
            <el-button
              v-if="!operation.hidden"
              class="operationsBtn"
              :key="i"
              :type="operation.type"
              :icon="operation.icon"
              :size="operation.size || 'small'"
              @click="operationsBtnClick(operation, reservedParams)"
            >{{operation.label}}</el-button>
          </template>
          <slot :queryForm="reservedParams"></slot>
        </el-col>
      </el-row>
      <el-row v-if="operationsBtn && operationsBtn.length && btnInNewLine">
        <el-col :span="24" align="right" style="display: flex; justify-content: flex-end">
          <template v-for="(operation, i) in operationsBtn">
            <el-button
              v-if="!operation.hidden"
              class="operationsBtn"
              :key="i"
              :type="operation.type"
              :icon="operation.icon"
              :size="operation.size || 'small'"
              @click="operationsBtnClick(operation, reservedParams)"
            >{{operation.label}}</el-button>
          </template>
          <slot :queryForm="reservedParams"></slot>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import _ from 'lodash'
import SelectTree from '@/components/common/ElSelectTree'

export default {
  components: {
    SelectTree
  },
  props: {
    value: {
      type: Object
    },
    conditions: Array, // 查询项组成的数组
    labelWidth: {
      type: String,
      default: '100px'
    },
    immediate: {
      type: Boolean,
      default: true
    },
    allValue: {
      type: Boolean,
      default: true
    },
    operationsBtn: Array,

    isChangeEvent: {
      // 切换下拉框是否进行查询
      type: Boolean,
      default: false
    },
    gutter: Number,
    xlSpan: {
      type: Number,
      default: 6
    },
    lgSpan: {
      type: Number,
      default: 6
    },
    mdSpan: {
      type: Number,
      default: 8
    },
    smSpan: {
      type: Number,
      default: 12
    },
    operationsBtnXlSpan: {
      type: Number,
      default: 6
    },
    operationsBtnLgSpan: {
      type: Number,
      default: 6
    },
    operationsBtnMdSpan: {
      type: Number,
      default: 8
    },
    operationsBtnSmSpan: {
      type: Number,
      default: 12
    },
    btnInNewLine: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      queryForm: {}
    }
  },
  mounted() {
    if (this.immediate) {
      this.event()
    }
  },
  methods: {
    event() {
      this.$emit('event', this.reservedParams)
    },
    /**
     * 下拉框切换事件，
     */
    eventHandler(condition, currentVal) {
      if (condition.event) {
        condition.event(currentVal, this.reservedParams)
      }
    },
    // 输入框输入事件condition.event 需是方法 非字符串
    handleInpChange(condition) {
      if (condition.event) {
        let currentVal = condition.value
        condition.event(currentVal, this.reservedParams) // 直接调用condition中的方法 ，无需监听
      }
    },
    // 时间范围切换事件 拆分成两个字段
    handleDateRangeChange(condition, val) {
      if (condition.rangeProp && condition.rangeProp.length === 2) {
        let startProp = condition.rangeProp[0]
        let endProp = condition.rangeProp[1]
        if (val) {
          this.queryForm[startProp] = val[0]
          this.queryForm[endProp] = val[1]
        } else {
          this.queryForm[startProp] = ''
          this.queryForm[endProp] = ''
        }
      }
    },
    clickInputSlot(item) {
      let value = item.value
      item.slot.event(value, this.reservedParams)
    },
    // 操作项点击事件
    operationsBtnClick(operation, reservedParams) {
      if (operation.event) {
        return operation.event({ ...this.reservedParams, ...this.queryForm })
      }
    },
    getValue(args) {
      _.merge(this.reservedParams, args)
    }
  },
  computed: {
    reservedParams() {
      let params = _.reduce(
        this.conditions,
        (result, n) => {
          // 处理多选 转成 ';' 连接的字符串
          if (n.multiple && n.type === 'select') {
            result[n.prop] = n.value && n.value.length ? n.value.join(',') : ''
          } else if (n.type === 'daterange' || n.type === 'datetimerange') {
            let startProp = n.rangeProp[0]
            let endProp = n.rangeProp[1]
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.queryForm[startProp] = n.value[0]
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.queryForm[endProp] = n.value[1]
          } else {
            result[n.prop] = n.value
          }
          return result
        },
        {}
      )
      return {
        ...params,
        ...this.queryForm
      }
    }
  }
}
</script>

<style scoped>
.con-search-bar {
  padding-top: 10px;
  background: #fff;
  border-radius: 5px;
}
.con-search-bar .search-bar-item {
  width: 100%;
  display: flex;
}
.con-search-bar .searchBarForm >>> .el-form-item {
  margin-bottom: 10px;
  margin-top: 0;
}
.con-search-bar .searchBarForm >>> .el-form-item .el-form-item__content {
  flex: 1;
  padding-right: 10px;
}

.con-search-bar >>> .el-select {
  width: 100%;
}

.con-search-bar >>> .el-date-editor {
  width: 100%;
}
.con-search-bar >>> .el-range-editor--small.el-input__inner {
  height: 33px;
}

/* .con-search-bar .operationsBtn {
  margin-left: 8px;
  margin-right: 8px;
} */
.con-search-bar .margin-b10 {
  margin-bottom: 10px;
}
.con-search-bar .operations-btn-wrp {
  /* min-width: 300px; */
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.btn2-width .con-search-bar .operations-btn-wrp {
  min-width: 150px;
  max-width: 190px;
}

.btn3-width.con-search-bar .operations-btn-wrp {
  min-width: 220px;
}
</style>
