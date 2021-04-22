<template>
  <div class="footer mt10">
    <div class="copyrightnr link">
      友情链接：&nbsp;
      <a v-for="v in likeList" :href="v.wangzhi" :key="v.id" target="_blank">{{
        v.wangzhanmingcheng
      }}</a>
      &nbsp;
    </div>

    <div class="copyrightnr">
      <div style="margin: 10px 0;">
        地址：辽宁省大连市旅顺口区兴发路　　电话：0410-8888888
      </div>
      <div style="margin: 10px 0;">
        版权所有：大连交通大学——智慧课堂教学系统 　　ICP备********号
      </div>
    </div>
  </div>
</template>

<style type="text/scss" scoped lang="scss">
.footer {
  background-color: #24211a;
  padding: 15px;
  margin: 10px 0;
  color: #767676;
  text-align: center;

  .link {
    color: #767676;
    a {
      color: #767676;
    }
    a:after {
      content: " | ";
    }
    a:last-child:after {
      content: "";
    }
  }
}
</style>
<script>
import api from "@/api";
import { extend } from "@/utils/extend";
const setting = require("@/setting");

export default {
  data() {
    return {
      likeList: [],
    };
  },
  methods: {
    loadListMenu(module, target) {
      this.$post(api.search.all, { table: module, order: "id desc" }).then(
        (res) => {
          this[target] = res.data;
        }
      );
    },
  },
  created() {
    this.loadListMenu("youqinglianjie", "likeList");
  },
};
</script>
