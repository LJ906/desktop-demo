<template>
  <el-button
    :plain="plain"
    :round="round"
    :type="type"
    :icon="icon"
    :size="size"
    :loading="loading"
    v-if="hasPerms(perms)"
    @click="handleClick($event)"
  >{{label}}</el-button>
</template>

<script>
import { hasPermission } from '@/permission/index.js'

export default {
  name: 'CnButton',
  props: {
    type: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    hasPer: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: null
    },
    disabled: {
      // 按钮是否禁用
      type: Boolean,
      default: false
    },
    perms: {
      type: String,
      default: null
    },
    circle: {
      type: Boolean,
      default: false
    },
    plain: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {}
  },
  methods: {
    handleClick(event) {
      this.$emit('click', { event })
    },
    hasPerms: function(perms) {
      if (perms) {
        // 根据权限标识和外部指示状态进行权限判断
        return hasPermission(perms) && !this.disabled
      } else {
        return true
      }
    }
  }
}
</script>
