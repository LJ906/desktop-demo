<template>
  <div class="login-container">
    <el-card class="box-card">
      <div slot="header" class="title-container">
        <h3 class="title">欢迎登录</h3>
      </div>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        autocomplete="on"
        label-position="left"
        size="small"
      >
        <el-form-item prop="username">
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="Username"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          >
            <span slot="prepend" class="svg-container">
              <svg-icon icon-class="user" />
            </span>
          </el-input>
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="大写键已打开" placement="right" manual>
          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="Password"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            >
              <span slot="prepend" class="svg-container">
                <svg-icon icon-class="password" />
              </span>
            </el-input>
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>

        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >登 录</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "caini"
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入用户名" }
        ],
        password: [{ required: true, trigger: "blur", message: "请输入密码" }]
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {}
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  created() {},
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && key >= "a" && key <= "z") ||
          (!shiftKey && key >= "A" && key <= "Z")
        ) {
          this.capsTooltip = true;
        } else {
          this.capsTooltip = false;
        }
      }
      if (key === "CapsLock" && this.capsTooltip === true) {
        this.capsTooltip = false;
      }
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      let that = this;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          // this.$store
          //   .dispatch("user/login", this.loginForm)
          //   .then(_ => {
          //     this.$router.push({
          //       path: this.redirect || "/",
          //       query: this.otherQuery
          //     });
          //   })
          //   .catch(e => {
          //     this.loading = false;
          //     that.$message.error("登录失败");
          //   });

          // 模拟登陆
          this.$router.push({
            path: this.redirect || "/",
            query: this.otherQuery
          });
        } else {
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    }
  }
};
</script>

<style lang="scss">
$bg: #fff;
$light_gray: #333;
$cursor: #333;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      caret-color: $cursor;
      color: $light_gray;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
    .el-input-group__prepend {
      border: none;
      border-right: 1px solid #dcdfe6;
    }
  }

  .el-form-item {
    border: 1px solid #dcdfe6;
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #eee;
$dark_gray: #333;
$light_gray: #333;

.login-container {
  position: relative;
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  background: url("../../assets/img/login_bg2.png") no-repeat center;
  background-size: 100% 100%;
  .box-card {
    position: absolute;
    right: 8%;
    top: 34%;
    width: 360px;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    color: $dark_gray;
  }

  .title-container {
    position: relative;
    .title {
      font-size: 16px;
      color: $dark_gray;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 0;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
