<template>
  <el-form
    class="common-form addForm"
    :ref="id"
    :inline="inline"
    :label-position="labelPosition"
    :model="innerData"
    :label-width="labelwidth"
    :validate-on-rule-change="validateOnRuleChange"
    size="small"
  >
    <slot name="formTitle">
      <h3 class="form-title" v-if="title">{{ title }}</h3>
    </slot>
    <el-row :gutter="colGutter">
      <!-- <el-col :span="24" v-if="showFormGroup" class="el-form-item__label">
        <slot name="formGroup"></slot>
      </el-col>-->
      <template v-for="item in innerItems">
        <el-col
          :xl="item.xlSpan ? item.xlSpan : xlSpan"
          :lg="item.lgSpan ? item.lgSpan : lgSpan"
          :md="item.mdSpan ? item.mdSpan : mdSpan"
          :sm="item.smSpan ? item.smSpan : smSpan"
          :xs="item.xsSpan ? item.xsSpan : xsSpan"
          :key="item.prop"
        >
          <el-form-item
            v-if="item.type==='tree'"
            :label="item.label"
            :key="item.prop"
            :prop="item.prop"
            :rules="validRules(item)"
          >
            <SelectTree
              :props="item.defaultProps"
              :selLabel="item.label"
              :options="item.treeData"
              :clearable="item.clearable"
              :accordion="item.accordion"
              :value="item.prop.indexOf('.') >= 0?innerData[item.prop.split('.')[0]][item.prop.split('.')[1]]:innerData[item.prop]"
              :prop="item.prop"
              :show-checkbox="item.showCheckbox"
              @getValue="getValue($event)"
            />
          </el-form-item>
          <el-form-item
            v-else
            :key="item.prop"
            :label="item.label"
            :prop="item.prop"
            :hidden="item.hidden || item.hiddenInAddForm"
            :rules="validRules(item)"
            :label-width="item.labelWidth"
          >
            <template v-if="item.type === 'select'">
              <el-select
                v-if="item.prop.indexOf('.') >= 0"
                :disabled="formFlag === 'edit' && item.disabled || item.disabledNow"
                :readonly="item.readonly === true ? true : false"
                :filterable="item.filterable=== false? false: true"
                :multiple="item.multiple && item.multiple"
                v-model="innerData[item.prop.split('.')[0]][item.prop.split('.')[1]]"
                @change="selectChange($event, item)"
              >
                <el-option v-for="(v, k) in item.options" :key="k" :label="v" :value="k"></el-option>
              </el-select>
              <el-select
                v-else
                v-model="innerData[item.prop]"
                :disabled="formFlag === 'edit' && item.disabled || item.disabledNow"
                :readonly="item.readonly === true ? true : false"
                :filterable="item.filterable=== false? false: true"
                :multiple="item.multiple && item.multiple"
                @change="selectChange($event, item)"
              >
                <el-option v-for="(v, k) in item.options" :key="k" :label="v" :value="k"></el-option>
              </el-select>
            </template>
            <el-cascader
              v-else-if="item.type === 'cascader'"
              :disabled="formFlag === 'edit' && item.disabled || item.disabledNow"
              :options="item.options"
              @active-item-change="handleItemChange($event, item)"
              :change-on-select="item.changeOnSelect"
              v-model="innerData[item.prop]"
              :show-all-levels="item.showAllLevels"
              :props="item.cascaderprops"
            ></el-cascader>
            <el-date-picker
              v-else-if="item.type === 'date' || item.type === 'datetime'"
              :type="item.type"
              v-model="innerData[item.prop]"
              placeholder="选择日期"
              :value-format="item.type === 'date'?'yyyy-MM-dd':'yyyy-MM-dd HH:mm:ss'"
              :disabled="formFlag === 'edit' && item.disabled || item.disabledNow"
              :readonly="item.readonly === true ? true : false"
              :picker-options="item.pickerOptions"
              style="width: 100%;"
            ></el-date-picker>
            <el-date-picker
              v-else-if="item.type === 'year'"
              :type="item.type"
              v-model="innerData[item.prop]"
              placeholder="选择年份"
              value-format="yyyy"
              :disabled="formFlag === 'edit' && item.disabled || item.disabledNow"
              :readonly="item.readonly === true ? true : false"
              :picker-options="item.pickerOptions"
              style="width: 100%;"
            ></el-date-picker>
            <template v-else-if="item.type==='button'">
              <el-button
                v-for="b in item.buttons"
                :key="b.title"
                :type="b.type"
                :size="b.size"
                :style="b.style"
                :disabled="b.disabled"
                @click="b.event(innerData)"
              >{{b.title}}</el-button>
            </template>
            <template v-else-if="item.type==='upload'">
              <div style="display: flex; width: 100%">
                <el-input
                  v-if="item.prop.indexOf('.') >= 0"
                  v-model="innerData[item.prop.split('.')[0]][item.prop.split('.')[1]]"
                  style="margin-right: 10px"
                  :disabled="item.disabledNow"
                  readonly
                ></el-input>
                <el-input
                  v-else
                  v-model="innerData[item.prop]"
                  style="margin-right: 10px"
                  :disabled="item.disabledNow"
                  readonly
                ></el-input>
                <el-upload
                  ref="commonUpload"
                  :action="item.action  || ''"
                  :auto-upload="item.autoUpload === true ? true : false"
                  :multiple="item.multiple === true ? true : false"
                  :show-file-list="item.showFileList ? true : false"
                  :accept="item.accept"
                  :limit="item.limit"
                  :on-change="onFileChange(item)"
                  :on-remove="item.handleRemove"
                  :http-request="item.httpRequest"
                >
                  <el-button
                    type="primary"
                    size="mini"
                    slot="trigger"
                    :disabled="item.disabledNow"
                  >浏览</el-button>
                </el-upload>
              </div>
            </template>

            <template v-else-if="item.type==='textarea'">
              <el-input
                v-if="item.prop.indexOf('.') >= 0"
                :type="item.type"
                :rows="item.rows"
                v-model="innerData[item.prop.split('.')[0]][item.prop.split('.')[1]]"
                :disabled="formFlag === 'edit' && item.disabled || item.disabledNow"
                :readonly="item.readonly === true ? true : false"
                @change="handleInpChange(item)"
              ></el-input>
              <el-input
                v-else
                :rows="item.rows"
                :type="item.type"
                v-model="innerData[item.prop]"
                :disabled="formFlag === 'edit' && item.disabled || item.disabledNow"
                :readonly="item.readonly === true ? true : false"
                @change="handleInpChange(item)"
              ></el-input>
            </template>

            <template v-else>
              <el-input
                v-if="item.prop.indexOf('.') >= 0"
                :id="item.cssid"
                :type="item.type"
                v-model.trim="innerData[item.prop.split('.')[0]][item.prop.split('.')[1]]"
                :maxlength="item.maxLength"
                :disabled="formFlag === 'edit' && item.disabled || item.disabledNow"
                autocomplete="off"
                :readonly="item.readonly === true ? true : false"
                :placeholder="item.placeholder"
                @change="handleInpChange(item)"
              >
                <template v-if="item.slot" :slot="item.slot.name">
                  <el-button
                    type="primary"
                    @click="clickInputSlot(item)"
                    :icon="item.slot.icon"
                  >{{item.slot.title}}</el-button>
                </template>
              </el-input>
              <el-input
                v-else
                :id="item.cssid"
                :type="item.type"
                v-model.trim="innerData[item.prop]"
                :maxlength="item.maxLength"
                :disabled="formFlag === 'edit' && item.disabled || item.disabledNow"
                :readonly="item.readonly === true ? true : false"
                autocomplete="off"
                :placeholder="item.placeholder"
                :suffix-icon="item.suffixIcon"
                @change="handleInpChange(item)"
              >
                <template v-if="item.slot" :slot="item.slot.name">
                  <el-button
                    type="primary"
                    @click="clickInputSlot(item)"
                    :icon="item.slot.icon"
                  >{{item.slot.title}}</el-button>
                </template>
                <template v-if="item.svgIcon" slot="suffix">
                  <svg-icon :icon-class="item.svgIcon" @click="clickSuffixIcon(item)" />
                </template>
              </el-input>
            </template>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>

<script>
import SelectTree from '@/components/common/ElSelectTree'
import _ from 'lodash'

export default {
  name: 'BaseForm',
  components: {
    SelectTree
  },
  props: {
    items: Array,
    labelwidth: {
      type: String,
      default: '100px'
    },
    inline: {
      type: Boolean,
      default: false
    },
    formFlag: {
      type: String,
      default: 'add'
    },

    changeData: Array, // 下拉框改变时可以从此处读取数据
    labelPosition: {
      type: String,
      default: 'right'
    },
    xlSpan: {
      type: Number,
      default: 12
    },
    lgSpan: {
      type: Number,
      default: 12
    },
    mdSpan: {
      type: Number,
      default: 12
    },
    smSpan: {
      type: Number,
      default: 12
    },
    xsSpan: {
      type: Number,
      default: 24
    },
    title: {
      type: String,
      default: ''
    },
    showFormGroup: {
      type: Boolean,
      default: false
    },
    colGutter: {
      type: Number,
      default: 50
    },
    id: {
      type: String,
      default: 'addForm'
    }
  },
  data() {
    return {
      // id: 'test',
      innerData: {},
      validateOnRuleChange: false,
      treeValue: '',
      editCheckId: '',
      treeLabel: ''
    }
  },
  methods: {
    handleItemChange(val, item) {
      if (item.activeItemChange) {
        item.activeItemChange(val)
      }
    },
    getValue(args) {
      _.merge(this.innerData, args)
    },
    selectChange(val, item) {
      if (item.change) {
        let prop = item.prop
        let value = ''
        if (prop.indexOf('.') >= 0) {
          value = this.innerData[_.split(prop, '.')[0]][_.split(prop, '.')[1]]
        } else {
          value = this.innerData[prop]
        }
        this.$emit(item.change, value, prop, this.innerData)
      }
    },
    yearChange: function(prop, val) {},
    handleInpChange(item) {
      let prop = item.prop

      if (item.change) {
        let value = this.innerData[prop]
        if (_.isFunction(item.change)) {
          item.change(value, prop, this.innerData)
        } else {
          this.$emit(item.change, value, prop, this.innerData)
        }
      }
    },
    clickInputSlot(item) {
      let value = this.innerData[item.prop]
      if (item.slot.onClick && _.isFunction(item.slot.onClick)) {
        item.slot.onClick(value, this.innerData)
      } else {
        this.$emit(item.slot.onClick, value, this.innerData)
      }
    },
    clickSuffixIcon(item) {
      let value = this.innerData[item.prop]
      if (item.iconClick && _.isFunction(item.iconClick)) {
        item.iconClick(value, this.innerData)
      } else {
        this.$emit(item.iconClick, value, this.innerData)
      }
    },
    onFileSuccess(item) {
      return (res, file, fileList) => {}
    },
    onFileChange(item) {
      let that = this
      let prop = item.prop || 'file'
      return (file, fileList) => {
        let fileName = file.name
        if (prop.includes('.')) {
          that.innerData[prop.split('.')[0]][prop.split('.')[1]] = fileName
        } else {
          that.innerData[prop] = fileName
        }
        this.$emit(item.change, file, fileList, that.innerData)
      }
    },
    clearFiles() {
      if (_.isArray(this.$refs.commonUpload)) {
        this.$refs.commonUpload[0] && this.$refs.commonUpload[0].clearFiles()
      } else {
        this.$refs.commonUpload && this.$refs.commonUpload.clearFiles()
      }
    },
    onFileError(item) {
      return (res, file, fileList) => {}
    },
    // 暴露参数
    showParams() {
      return {
        ...this.innerData
      }
    },
    // 重置单个字段
    resetParams(prop, val) {
      this.innerData[prop] = val
    },
    // 重新替换 用于回显数据
    resendBind(newInnerData) {
      this.innerData = _.reduce(
        _.reject(this.items, { type: 'edithidden' }),
        (r, o) => _.set(r, o.prop, o.value ? o.value : ''),
        {}
      )
      this.$emit('bind', this.innerData)
    }
  },

  computed: {
    innerItems() {
      return _.reject(this.items, { type: 'edithidden' })
    }
  },
  created() {
    this.innerData = _.reduce(
      _.reject(this.items, { type: 'edithidden' }),
      (r, o) => _.set(r, o.prop, o.value ? o.value : ''),
      {}
    )
    this.$emit('bind', this.innerData)
  },
  mounted() {
    this.$emit('send', this.$refs[this.id])
    let _this = this
    this.$nextTick(function() {
      if (_this.formFlag === 'edit') {
        let changeItems = _.filter(this.innerItems, o => o.change)
        _.forEach(changeItems, function(o) {
          _this.selectChange(null, o)
        })
      }
    })
  }
}
</script>

<style scoped>
.addForm {
  padding-top: 10px;
  text-align: left;
}
.addForm >>> .el-select,
.addForm >>> .el-cascader {
  width: 100%;
}

.addForm .form-title {
  position: relative;
  height: 30px;
  margin-bottom: 30px;
  font: bold 20px/30px Source Han Sans CN;
  color: #fff;
  text-align: left;
}

.addForm .form-title-icon .form-title {
  padding-left: 20px;
}

.addForm .form-title-icon .form-title::after {
  display: block;
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 10px;
  height: 10px;
  background: linear-gradient(
    -45deg,
    rgba(60, 133, 215, 1),
    rgba(92, 109, 195, 1)
  );
  -webkit-transform: rotate(-45deg);
  transform: translateY(-50%) rotate(-45deg);
}

.addForm >>> .el-input-group__append,
.addForm >>> .el-input-group__prepend {
  line-height: 30px;
}

.addForm >>> .el-range-editor--small.el-input__inner {
  height: 33px;
}
</style>
<style>
.addForm.el-form--label-top .el-form-item__label {
  padding: 0;
}
</style>
