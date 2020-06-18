// form表单校验规则

const install = function(Vue, options) {
  /**
   * 验证是否是数字 （正整数）
   * @param rule
   * @param value
   * @param callback
   */
  const ruleNumber = (rule, value, callback) => {
    var reg = /^[1-9][0-9]*$/
    if (value !== '' && value != null) {
      if (!reg.test(value)) {
        callback(new Error('请输入正整数！'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }
  /**
   * 验证是否是正数， 包含小数
   */
  const positiveNum = (rule, value, callback) => {
    var reg = /^\d+(\.\d+)?$/
    if (value !== '' && value != null) {
      if (!reg.test(value)) {
        callback(new Error('请输入正数！'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }

  const idCard = (rule, value, callback) => {
    let reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/
    if (value !== '' && value != null) {
      if (!reg.test(value)) {
        callback(new Error('证件号码格式有误！'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }
  const password = (rule, value, callback) => {
    let reg = /^(?=.*[!,%&@#$^*?_~])(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/g
    if (value !== '' && value != null) {
      if (!reg.test(value)) {
        callback(new Error('强度不够! 密码长度不小于8位,必须包含大写英文字母、小写英文字母、数字和符号'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }

  Vue.prototype.validRules = function(item) {
    const rules = []
    if (item.required) {
      rules.push({ required: true, message: item.label + '不能为空!', trigger: 'blur' })
    }
    if (item.maxLength) {
      rules.push({ min: 1, max: item.maxLength, message: '最多输入' + item.maxLength + '个字符!', trigger: ['blur', 'change'] })
    }
    if (item.min && item.max) {
      rules.push({ min: item.min, max: item.max, message: '字符长度在' + item.min + '至' + item.max + '之间!', trigger: 'blur' })
    }

    if (item.type) {
      const type = item.type
      const validate = item.validate
      switch (type) {
        case 'email':
          rules.push({ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] })
          break
        case 'integer':
          rules.push({ validator: ruleNumber, trigger: ['blur', 'change'] })
          break
        case 'positiveNum':
          rules.push({ validator: positiveNum, trigger: ['blur', 'change'] })
          break

        case 'idcard':
          rules.push({ validator: idCard, trigger: ['blur', 'change'] })
          break
        case 'password':
          rules.push({ validator: password, trigger: ['blur', 'change'] })
          break
        default:
          // rules.push({})
          break
      }

      // 添加validate校验 解决type 需要切换的情况
      switch (validate) {
        case 'email':
          rules.push({ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] })
          break
        case 'integer':
          rules.push({ validator: ruleNumber, trigger: ['blur', 'change'] })
          break
        case 'positiveNum':
          rules.push({ validator: positiveNum, trigger: ['blur', 'change'] })
          break

        case 'idcard':
          rules.push({ validator: idCard, trigger: ['blur', 'change'] })
          break
        case 'password':
          rules.push({ validator: password, trigger: ['blur', 'change'] })
          break
        default:
          // rules.push({})
          break
      }
    }

    if (rules.length === 1 && Object.keys(rules[0]).length === 0) { // 表单提交会提示not a string
      return null
    } else {
      return rules
    }
  }
}

export default install
