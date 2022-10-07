<!-- 登陆 / 注册 / 个人主页... -->
<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>
