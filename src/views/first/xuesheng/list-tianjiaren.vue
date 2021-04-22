<template>
  <div class="v-list" v-loading="loading" element-loading-text="加载中">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        学生列表
      </div>
      <!-- 搜索 -->
      <div class="form-search">
        <el-form @submit.prevent.stop :inline="true" size="mini">
          <el-form-item label="学号">
            <el-input v-model="search.xuehao"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="search.xingming"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="search.xingbie"
              ><el-option label="请选择" value=""></el-option
              ><el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="searchSubmit"
              icon="el-icon-search"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </div>

      <el-table border :data="list" style="width: 100%" highlight-current-row>
        <el-table-column type="index" label="#"></el-table-column>
        <!-- 序号 -->

        <el-table-column label="学号" width="130">
          <template slot-scope="{ row }"> {{ row.xuehao }} </template>
        </el-table-column>
        <el-table-column label="姓名" width="130">
          <template slot-scope="{ row }"> {{ row.xingming }} </template>
        </el-table-column>
        <el-table-column label="性别" width="80">
          <template slot-scope="{ row }"> {{ row.xingbie }} </template>
        </el-table-column>
        <el-table-column label="班级" width="80">
          <template slot-scope="{ row }">
            <e-select-view
              module="banji"
              :value="row.banji"
              select="id"
              show="banjimingcheng"
            ></e-select-view>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" width="130">
          <template slot-scope="{ row }"> {{ row.lianxidianhua }} </template>
        </el-table-column>
        <el-table-column label="头像" width="100">
          <template slot-scope="{ row }">
            <e-img :src="row.touxiang" style="max-width:120px" />
          </template>
        </el-table-column>
        <el-table-column label="籍贯" width="130">
          <template slot-scope="{ row }"> {{ row.jiguan }} </template>
        </el-table-column>
        <el-table-column label="添加人" width="80">
          <template slot-scope="{ row }"> {{ row.tianjiaren }} </template>
        </el-table-column>

        <!--<el-table-column label="添加时间">
                <template slot-scope="{row}">
                    {{ row.addtime.substr(0,16) }}
                </template>
            </el-table-column>-->
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button-group>
              <el-tooltip content="详情" placement="top">
                <el-button
                  @click="
                    $goto({
                      path: '/admin/xueshengdetail',
                      query: { id: row.id },
                    })
                  "
                  icon="el-icon-info"
                  type="info"
                  size="mini"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="编辑" placement="top">
                <el-button
                  icon="el-icon-edit"
                  @click="
                    $goto({
                      path: '/admin/xueshengupdt',
                      query: { id: row.id },
                    })
                  "
                  type="warning"
                  size="mini"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  size="mini"
                  @click="deleteItem(row)"
                >
                </el-button>
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 10px;text-align: center">
        <el-pagination
          @current-change="loadList"
          :current-page="page"
          :page-size="15"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<style type="text/scss" scoped lang="scss"></style>
<script>
import api from "@/api";
import { remove } from "@/utils/utils";
import { extend } from "@/utils/extend";
import objectDiff from "objectdiff";

/**
 * 后台列表页面
 */
export default {
  data() {
    return {
      loading: false,
      list: [],
      search: {
        xuehao: "",

        xingming: "",

        xingbie: "",
      },
      total: {},
      page: 1, // 当前页
      pagesize: 12, // 页大小
      totalCount: 0, // 总行数
    };
  },
  watch: {},
  computed: {},
  methods: {
    searchSubmit() {
      this.loadList(1);
    },

    loadList(page) {
      // 防止重新点加载列表
      if (this.loading) return;
      this.loading = true;
      this.page = page;
      // 筛选条件
      var filter = extend(true, {}, this.search, {
        page: page + "",
        pagesize: this.pagesize + "",
      });
      var diff = objectDiff.diff(filter, this.$route.query);
      if (diff.changed != "equal") {
        // 筛选的条件不一致则更新链接
        this.$router.push({
          // 更新query
          path: this.$route.path,
          query: filter,
        });
      }
      this.$post(api.xuesheng.listtianjiaren, filter)
        .then((res) => {
          this.loading = false;
          if (res.code == api.code.OK) {
            extend(this, res.data);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err.message);
        });
    },
    // 删除某行方法
    deleteItem(row) {
      this.$confirm("确定删除数据？", "提示", {
        // 弹出 确认框提示是否要删除
        type: "warning",
      })
        .then(() => {
          // 确定操作

          this.loading = true; // 滚动条
          this.$post(api.xuesheng.delete, {
            // 提交后台
            id: row.id,
          })
            .then((res) => {
              this.loading = false;
              if (res.code != api.code.OK) {
                this.$message.error(res.msg);
              } else {
                remove(this.list, row);
              }
            })
            .catch((err) => {
              // 访问网络错误
              this.loading = false;
              this.$message.error(err.message);
            });
        })
        .catch(() => {
          // 取消操作
        });
    },
  },
  beforeRouteUpdate(to, form, next) {
    extend(this.search, to.query);
    this.loadList(1);
    next();
  },
  created() {
    var search = extend(this.search, this.$route.query);
    if (search.page) {
      this.page = Math.floor(this.$route.query.page);
      delete search.page;
    }
    if (search.pagesize) {
      this.pagesize = Math.floor(this.$route.query.pagesize);
      delete search.pagesize;
    }

    this.loadList(1);
  },
  mounted() {},
  destroyed() {},
};
</script>
