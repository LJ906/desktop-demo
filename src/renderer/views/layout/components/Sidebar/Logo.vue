<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1 v-else class="sidebar-title">{{ title }}</h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <div class="logo-txt">
          <span>PRMS</span>
          <span style="letter-spacing: 3px">填报工具</span>
        </div>
        <!-- <h1 class="sidebar-title">{{ title }}</h1> -->
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: 'PRMS',
      logo: require('@/assets/img/logo.png')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  // height: 50px;
  // line-height: 50px;
  height: $navHeight;
  line-height: $navHeight;
  background: $logoBg;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    display: flex;
    padding-left: 10px;
    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 4px;
      margin-left: 4 px;
    }

    .logo-txt {
      position: relative;
      margin-right: 10px;
      // display: flex;
      // justify-content: center;
      // align-items: center;
      margin-left: 10px;
      // width: 70px;
      font-size: 26px;
      font-family: 'HYZongYiJ';
      font-weight: 500;
      color: #fff;
      letter-spacing: 2px;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
  .logo-txt {
    span {
      text-align: center;
      line-height: 16px;
    }
  }
}
</style>
<style lang="scss">
#app .sidebar-container .sidebar-logo-link {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
