<template>
  <el-row class="page-title-wrp" type="flex" :class="{'showborder': showBorder}">
    <el-col :span="titleSpan">
      <span class="page-title" :style="{'font-size': fontSize}">{{title}}</span>
    </el-col>
    <slot>
      <el-col :span="btnSpan" align="right" v-if="hasRight">
        <el-button size="small" type="primary" @click="$emit('saveAll')" v-show="hasSaveBtn">保存</el-button>
        <el-button size="small" type="info" plain @click="$emit('goBack')">返回</el-button>
      </el-col>
    </slot>
  </el-row>
</template>

<script>
export default {
  name: 'PageTitle',
  props: {
    title: String,
    btnSpan: {
      type: Number,
      default: 12
    },
    titleSpan: {
      type: Number,
      default: 12
    },
    showBorder: {
      type: Boolean,
      default: true
    },
    hasRight: {
      type: Boolean,
      default: false
    },
    fontSize: {
      type: String,
      default: '18px'
    },
    hasSaveBtn: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style>
.page-title-wrp {
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.page-title-wrp.showborder {
  border-bottom: 1px solid #c3c3c3;
}

.page-title {
  position: relative;
  height: 34px;
  padding-left: 14px;
  line-height: 34px;
  font-size: 22px;
  /* font-family: Microsoft YaHei; */
  font-weight: bold;
  color: #46484b;
}

.page-title::after {
  position: absolute;
  left: 0;
  top: 50%;
  content: '';
  transform: translateY(-50%);
  width: 3px;
  height: 21px;
  background: rgba(33, 138, 255, 1);
}
</style>
