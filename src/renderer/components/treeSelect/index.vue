
<template>
  <div class="treeSelect">
    <div class="treeList">
      <div class="title">{{treeDataOptions.titleNames[0]}}</div>
      <div class="content">
        <el-tree
          :data="listData"
          :render-content="renderContent"
          :empty-text="noMessage"
          :default-expand-all="true"
          ref="tree"
        ></el-tree>
      </div>
    </div>
    <div class="undetermined">
      <div class="title">{{treeDataOptions.titleNames[1]}}</div>
      <div class="Selcontent">
        <div v-if="!waitingData.length" class="no-data">暂无数据</div>
        <ul v-else class="selectContent">
          <li v-for="(item,indexs) in waitingData" :key="indexs" @click="migrantData(item)">
            <img :src="imgUrl" class="userImg" />
            <span>{{item.name}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="selected">
      <div class="title">{{treeDataOptions.titleNames[2]}}</div>
      <div class="Selcontent">
        <ul class="selectContent">
          <li v-for="(item,indexs) in datas" :key="indexs" @click="cancelChoose(item)">
            <img :src="imgUrl" class="userImg" />
            <span>{{item.name}}</span>
            <img :src="iconUrl" class="iconImg" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'treeSelect',
  props: {
    treeDataOptions: {
      //   required: true,
      default: () => {
        return {
          // maxSelected: 1, // 最大已选数  type: Number  required: false
          fobiddenSelect: [], // ['u_2'], // 禁止选中元素的id  type: String || Array  required: false
          titleNames: ['所属机构', '待选用户', '已选用户'], // 三个标题依次填写  type: Array  required: true
          treeOptions: {
            // 树状元素配置 通过request请求获取树状元素内容   type: Object required: true
            url: '/a/sys/office/officeTreeData',
            method: 'post',
            params: {
              expand: true
            }
          },
          selectDataOptions: {
            // 首次加载获取已选择元素  type: Array || object   required: false
            url: '/a/sys/role/checkedUserList', // 路径
            method: 'post',
            params: {}
          },
          userTreeOptions: {
            url: '/a/sys/role/initialUserRole',
            method: 'post',
            params: {}
          }
        }
      }
    },
    signal: {
      default: false
    },
    identifier: String,
    parentId: {
      // pid 字段
      type: String,
      default: 'parentId'
    },
    userListParam: {
      type: Object,
      default: () => {}
    },
    selectedListParam: {
      type: Object,
      default: () => {}
    },
    maxSelected: {
      type: Number
    }
  },
  data() {
    return {
      noMessage: '暂无数据',
      imgUrl: require('@/assets/img/users.png'),
      iconUrl: require('@/assets/img/checkedIcon.png'),
      datas: [],
      waitingData: [],
      // maxSelected: this.treeDataOptions.maxSelected,
      listData: []
    }
  },

  mounted() {
    this.getListData()
    this.getSelectData()
  },

  methods: {
    renderContent(h, { root, node, data }) {
      return h(
        'span',
        {
          style: (() => {
            // 当元素被禁用时给样式
            let options = this.treeDataOptions.fobiddenSelect
            let booleans = null
            if (typeof options === 'object') {
              // 判断当前点击元素的id是否在被禁止元素中
              booleans = options.indexOf(data.id) > -1
            } else {
              booleans = options === data.id
            }
            if (booleans) {
              return {
                display: 'inline-block',
                cursor: 'not-allowed'
              }
            } else {
              return {
                display: 'inline-block',
                cursor: 'pointer'
              }
            }
          })()
        },
        [
          h(
            'span',
            {
              style: {
                paddingLeft: '8px'
              },
              on: {
                click: () => {
                  let options = this.treeDataOptions.fobiddenSelect
                  let booleans = null
                  if (options) {
                    if (typeof options === 'object') {
                      // 判断当前点击元素的id是否在被禁止元素中
                      booleans = options.indexOf(data.id) > -1
                    } else {
                      booleans = options === data.id
                    }
                    if (booleans) {
                      this.$message.info('该选项已被禁止选择')
                      return
                    }
                  }
                  // if(!data.children || !data.children.length){
                  if (
                    JSON.stringify(this.waitingData).indexOf(
                      JSON.stringify(data)
                    ) === -1
                  ) {
                    // 将当前选中的元素添加到数据中
                    // this.waitingData.push(data);
                    this.getUserData(data.id)
                  } else {
                    this.$message.info('该选项已被选择')
                  }
                  // }
                }
              }
            },
            data.name
          )
        ]
      )
    },

    async getListData() {
      // 获取树状内容
      let options = this.treeDataOptions
      let data = null
      if (options.treeOptions) {
        if (
          !options.treeOptions.method ||
          options.treeOptions.method.toLowerCase() === 'get'
        ) {
          data = await this.$get(
            options.treeOptions.url,
            options.treeOptions.params
          )
        } else {
          data = await this.$post(
            options.treeOptions.url,
            options.treeOptions.params
          )
        }
        // 需要格式成树结构
        if (data.length) {
          // let result = data.filter(o => o[this.parentId] === 0) // 一级
          // this.listData = this.formTreeData(data, result, this.parentId)
          this.listData = data
        }
      }
    },

    async getSelectData() {
      // 通过接口获取已选择的数据
      let options = this.treeDataOptions
      if (options.selectDataOptions) {
        let data = null
        if (!Array.isArray(options.selectDataOptions)) {
          if (
            !options.selectDataOptions.method ||
            options.selectDataOptions.method.toLowerCase() === 'get'
          ) {
            data = await this.$get(options.selectDataOptions.url, {
              ...options.selectDataOptions.params,
              ...this.selectedListParam
            })
          } else {
            data = await this.$post(options.selectDataOptions.url, {
              ...options.selectDataOptions.params,
              ...this.selectedListParam
            })
          }
          this.datas = data
        } else {
          if (options.selectDataOptions.length !== 0) {
            this.datas = options.selectDataOptions
          }
        }
      }
    },

    removeData(data, removeDatas) {
      // 移除当前元素
      if (data) {
        data.forEach((items, index) => {
          if (JSON.stringify(items) === JSON.stringify(removeDatas)) {
            data.splice(index, 1)
          }
        })
      }
    },

    migrantData(data) {
      // 将待选转移到已选状态
      if (data) {
        if (this.maxSelected) {
          if (this.datas.length >= this.maxSelected) {
            this.$message.info(`最多只能选择${this.maxSelected}个`)
            return
          }
        }
        if (JSON.stringify(this.datas).indexOf(JSON.stringify(data)) === -1) {
          // 将当前选中的元素添加到数据中
          this.datas.push(data)
          this.removeData(this.waitingData, data)
        } else {
          this.$message.info('该选项已被选择')
        }
      }
    },
    // 取消选中人员
    cancelChoose(removeDatas) {
      this.removeData(this.datas, removeDatas)
      this.waitingData.push(removeDatas)
    },
    // 根据机构获取相关人员
    async getUserData(officeId) {
      let options = this.treeDataOptions
      let data = null
      if (options.userTreeOptions) {
        if (
          !options.userTreeOptions.method ||
          options.userTreeOptions.method.toLowerCase() === 'get'
        ) {
          data = await this.$post(options.userTreeOptions.url, {
            ...options.userTreeOptions.params,
            office: officeId,
            ...this.userListParam
          })
        } else {
          data = await this.$post(options.userTreeOptions.url, {
            ...options.userTreeOptions.params,
            office: officeId,
            ...this.userListParam
          })
        }

        // this.waitingData = data
        this.waitingData = data.userList || []
      }
    },
    /**
     * 格式化数据得到树结构
     * @param {Array} data 格式化前的数据
     * @param {Array} result 格式后的数据 格式成 [ children: []]
     * @param {Array} pId  对应pId 的字段， pId 或者 parentId
     */
    formTreeData(data, result, pId) {
      result.forEach(item => {
        item.children = []
        item.expand = true // 默认展开
        data.forEach(ele => {
          if (item.id === ele[pId]) {
            item.children.push(ele)
          }
        })
        item.children.length && this.formTreeData(data, item.children, pId)
      })
      return result
    }
  },

  watch: {
    signal(a, b) {
      this.$emit('getResult', this.datas, this.identifier)
    }
  }
}
</script>
<style scoped lang="scss">
@import url('./css/index.scss');
</style>
