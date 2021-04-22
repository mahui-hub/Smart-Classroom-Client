<template>
  <div class="e-forum-page">
    <template v-for="(row, index) in forumList">
      <slot name="default" :row="row" :index="index" :floor="getFloor(index)">
        <el-button>1212</el-button>
      </slot>
    </template>

    <div class="page" style="margin-top: 20px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-size="pagesize"
        layout="prev, pager, next, jumper"
        :total="lists.length"
      >
      </el-pagination>
    </div>
  </div>
</template>
<style type="text/scss" lang="scss">
.e-forum-page {
  .page {
    text-align: center;
  }
}
</style>
<script>
// 分页组件
export default {
  name: "e-forum-page",
  data() {
    return {
      pagesize: 10,
      page: 1,
    };
  },
  props: {
    lists: Array,
  },
  watch: {},
  computed: {
    forumList() {
      var count = this.lists.length;
      var pageCount = Math.ceil(count / this.pagesize);
      var start = (this.page - 1) * this.pagesize; // 当前读取位置
      var result = [];
      for (var i = start; i < count && i < start + this.pagesize; i++) {
        var ci = this.lists[i];
        result.push(ci);
      }
      return result;
    },
  },
  methods: {
    getFloor(index) {
      var start = (this.page - 1) * this.pagesize + index + 1;
      return start + "楼";
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
  },
  created() {},
  mounted() {},
  destroyed() {},
};
</script>
