<template>
  <div class="Home">
    <el-container>
      <el-header> <v-header></v-header></el-header>
      <el-main> <router-view /></el-main>
      <el-footer> <v-footer></v-footer></el-footer>
    </el-container>
  </div>
</template>
<style lang="scss"></style>
<script>
import VHeader from "@/layout/first/header";
import VFooter from "@/layout/first/footer";

export default {
  name: "home",
  components: { VFooter, VHeader },
};
</script>
