### treeSelect组件使用说明

###### 动态入参为：treeDataOptions、signal

* signal是用于触发子组件emit方法，向父组件传值
   > type: Boolean 输入内容类型
   > default: false 默认值(值发生变化即可触发)
   >required: true 必填
   >> demo: this.singal = !this.singal 
   
* treeDataOptions 是整个treeSlect配置项
   > type: Object
   >required: true
   >>demo:
   >>treeDataOptions:{ // 配置参数
        maxSelected:2, //最大已选数  type: Number  required: false
        fobiddenSelect: ['u_2'], // 禁止选中元素的id  type: String || Array  required: false
        titleNames:['所属机构','待选用户','已选用户'],  //三个标题依次填写  type: Array  required: true
        treeOptions:{ //树状元素配置 通过request请求获取树状元素内容   type: Object required: true
            url:'/a/sys/user/treeData', //路径
            method:'get', //请求方式
            params:{ //入参
                officeId:2
            }
        },
        selectDataOptions:{  //首次加载获取已选择元素  type: Array || object   required: false
               url:'/a/sys/user/treeData', //路径
                method:'get', //请求方式
                params:{ //入参
                    officeId:2
                } 
        } or
        selectDataOptions: [{name:'test',id:test}]
    }


###### 回调方法监听事件为 getResult 

*父组件通过改变singal值来触发子组件emit方法，返回所需结果值，父组件利用getResult方法来监听返回的内容
> demo:
<TreeSelect :treeDataOptions='treeDataOptions' :signal='signal' @getResult='result'></TreeSelect>
methods:{
    result(data){
        console.log('result',data);
    }
}
