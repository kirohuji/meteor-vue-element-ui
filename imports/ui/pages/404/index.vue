<template>
  <el-empty :image-size="200" description="找不到资源">
    <el-button type="primary" @click="$router.push('auth')"
      >返回首页</el-button
    >
  </el-empty>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.el-empty {
  height: 100%;
}
</style>
