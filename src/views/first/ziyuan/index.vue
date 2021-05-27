<template>
    <div class="app">
        <e-module-widget-title title="课件资源">
            <el-row :gutter="20">
                <!-- 数据分析 -->
                <el-col :span="8">
                    <div id="myChart" style="width: 100%; height: 400px;" ref="myChart"></div>
                </el-col>
                <el-col :span="16">
                    <div class="form-search">
                        <el-form :inline="true" size="mini" :label-suffix="':'">
                            <el-form-item label="课程名称">
                                <el-input v-model="search.kechengmingcheng"></el-input>
                            </el-form-item>
                            <el-form-item label="资源名称">
                                <el-input v-model="search.ziyuanname"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="searchSubmit" icon="el-icon-search">查询</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="addSubmit" icon="el-icon-plus">添加课件资源</el-button>
                            </el-form-item>
                        </el-form>
                    </div>

                    <div class="list-table">
                        <el-table border :data="list" style="width: 100%" highlight-current-row stripe>
                            <el-table-column type="index" align="center"></el-table-column>
                            <el-table-column type="expand">
                                <template slot-scope="props">
                                    <el-form label-position="left" class="demo-table-expand">
                                        <el-form-item label="资源名称">
                                            <span>{{ props.row.ziyuanname }}</span>
                                        </el-form-item>
                                        <el-form-item label="课件">
                                            <span>
                                                <e-file-list v-model="props.row.fujian"></e-file-list>
                                            </span>
                                        </el-form-item>
                                    </el-form>
                                </template>
                            </el-table-column>
                            <el-table-column label="课程名称" align="center" prop="kechengmingcheng">
                            </el-table-column>
                            <el-table-column label="发布人" align="center" prop="faburen">
                            </el-table-column>
                            <el-table-column label="添加时间" align="center" prop="addtime">
                            </el-table-column>
                            <el-table-column label="操作" align="center">
                                <template slot-scope="{ row }">
                                    <el-button @click="edit(row)" type="text" v-if="row.faburen==username">编辑
                                    </el-button>
                                    <el-button type="text" @click="deleteItem(row)" v-if="row.faburen==username">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>

                    <div class="e-pages" style="margin-top: 10px;text-align: center">
                        <el-pagination @current-change="loadList" :current-page="page" :page-size="pagesize"
                            @size-change="sizeChange" layout="total, sizes, prev, pager, next, jumper"
                            :total="totalCount">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </e-module-widget-title>
        <el-dialog title="添加课件资源" :visible.sync="dialogVisible" size="mini">
            <div class="form-database-form">
                <el-form :model="form" ref="formModel" :rules="rules" label-width="100px">
                    <el-form-item label="课程名称" prop="kechengmingcheng">
                        <el-select v-model="form.kechengmingcheng" style="width: 100%" clearable @change="handleChange">
                            <el-option v-for="m in kechenglist" :key="m.id" :value="m.kechengmingcheng"
                                :label="m.kechengmingcheng">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="资源名称" prop="ziyuanname">
                        <el-input placeholder="请输入资源名称" v-model="form.ziyuanname" />
                    </el-form-item>
                    <el-form-item label="发布人" prop="faburen">
                        <el-input v-model="form.faburen" readonly disabled></el-input>
                    </el-form-item>
                    <el-form-item label="课件资源" prop="fujian" required>
                        <e-upload-file v-model="form.fujian"></e-upload-file>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="编辑课件资源" :visible.sync="dialogVisible1" size="mini">
            <div class="form-database-form">
                <el-form :model="form1" ref="formModel" :rules="rules" label-width="100px">
                    <el-form-item label="课程名称" prop="kechengmingcheng">
                        <el-select v-model="form1.kechengmingcheng" style="width: 100%" clearable
                            @change="handleChange">
                            <el-option v-for="m in kechenglist" :key="m.id" :value="m.kechengmingcheng"
                                :label="m.kechengmingcheng">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="资源名称" prop="ziyuanname">
                        <el-input placeholder="请输入资源名称" v-model="form1.ziyuanname" />
                    </el-form-item>
                    <el-form-item label="发布人" prop="faburen">
                        <el-input v-model="form1.faburen" readonly disabled></el-input>
                    </el-form-item>
                    <el-form-item label="课件资源" prop="fujian" required>
                        <e-upload-file v-model="form1.fujian"></e-upload-file>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="submit1">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    let echarts = require('echarts');
    import api from "@/api";
    import {
        remove,
        checkIssh
    } from "@/utils/utils";
    import {
        extend
    } from "@/utils/extend";
    import objectDiff from "objectdiff";

    export default {
        data() {
            return {
                echartList: [],
                dialogVisible1: false,
                dialogVisible: false,
                loading: false,
                list: [],
                kechenglist: [],
                search: {
                    kechengmingcheng: "",
                    ziyuanname: ""
                },
                total: {},
                page: 1, // 当前页
                pagesize: 10, // 页大小
                totalCount: 0, // 总行数
                form: {
                    kechengid: "",
                    kechengmingcheng: "",
                    ziyuanname: "",
                    fujian: "",
                    faburen: this.$store.state.user.session.username
                },
                form1: {
                    kechengid: "",
                    kechengmingcheng: "",
                    ziyuanname: "",
                    fujian: [],
                    faburen: this.$store.state.user.session.username
                },
                rules: {
                    ziyuanname: [{
                        required: true,
                        message: "请输入资源名称",
                        trigger: "blur"
                    }, ],
                },
                role: "",
                username: this.$store.state.user.session.username,
                array1: [],
                array: []
            };
        },
        methods: {
            getchart(id) {
                const params = {}
                params.kechengid = id

                this.$post("kechengziyuan_echart.do", params).then(result => {
                    // this.echartList = result.data.echartList
                    var array2 = result.data.echartList
                    array2.forEach((item) => {
                        this.array1.push(item);
                    })
                    this.echartList = this.array1
                    this.$nextTick(function () {
                        //方法里面第一步// 基于准备好的dom，初始化echarts实例
                        let myChart = echarts.init(document.getElementById("myChart"));
                        // 使用刚指定的配置项和数据显示图表。
                        myChart.setOption({
                            title: {
                                text: '课件数据资源统计',
                                left: 'right'
                            },
                            tooltip: {
                                trigger: 'item'
                            },
                            legend: {
                                orient: 'vertical',
                                left: 'left',
                            },
                            series: [{
                                type: 'pie',
                                radius: '50%',
                                data: this.echartList,
                                emphasis: {
                                    itemStyle: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }]
                        })
                    })
                }).catch(result => {

                })
            },
            handleChange(val) {
                var a = ""
                this.kechenglist.map(function (item) {
                    if (item.kechengmingcheng == val) {
                        a = item.id
                    }
                })
                this.form.kechengid = a
                this.form1.kechengid = a
            },
            initKengcheng() {
                const params = {}
                params.page = 1
                params.pagesize = 12
                if (localStorage.getItem("role") == "教师") {
                    params.jiaoshiid = localStorage.getItem("jiaoshiid");
                } else if (localStorage.getItem("role") == "学生") {
                    params.banjiid = localStorage.getItem("banjiId");
                }

                this.$post(api.kecheng.weblist, params)
                    .then((res) => {
                        this.loading = false;
                        if (res.code == api.code.OK) {
                            this.mapkechengleixing2 = res.data.mapkechengleixing2;
                            this.kechenglist = res.data.list;
                            var list = res.data.list;
                            this.array1 = []
                            this.array = []
                            this.list = []
                            this.echartList = []
                            for (var i in list) {
                                this.getchart(list[i].id);
                                this.loadList(1, list[i].id)
                            }
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        this.loading = false;
                        this.$message.error(err.message);
                    });
            },
            loadInfo() {
                // 获取模块得数据
                this.loading = true;
                this.$post(api.kechengziyuan.create, {
                        id: this.form.id,
                    })
                    .then((res) => {
                        this.loading = false;
                        if (res.code == api.code.OK) {
                            extend(this, res.data);
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        this.$message.error(err.message);
                    });
            },
            addSubmit() {
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.$refs.formModel.resetFields();
                });
            },
            edit(row) {
                this.form1 = row;
                this.dialogVisible1 = true;
            },
            searchSubmit() {
                this.initKengcheng();
                // this.loadList(1);
            },
            sizeChange(e) {
                this.pagesize = e;
                // this.loadList(1);
                this.initKengcheng();
            },
            checkIssh,
            loadList(page, id) {
                // 防止重新点加载列表
                this.page = page;
                // 筛选条件
                var filter = extend(true, {}, this.search, {
                    kechengid: id,
                    page: page + "",
                    pagesize: this.pagesize + "",
                });
                this.$post(api.kechengziyuan.list, filter)
                    .then((res) => {
                        this.loading = false;
                        if (res.code == api.code.OK) {
                            // extend(this, res.data);
                            this.totalCount = res.data.totalCount
                            var array1 = res.data.list;
                            if (this.totalCount != 0) {
                                array1.forEach((item) => {
                                    this.array.push(item);
                                })
                            }
                            this.list = this.array;
                            this.totalCount = this.list.length
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
                        this.$post(api.kechengziyuan.delete, {
                                // 提交后台
                                id: row.id,
                            })
                            .then((res) => {
                                this.loading = false;
                                if (res.code != api.code.OK) {
                                    this.$message.error(res.msg);
                                } else {
                                    remove(this.list, row);
                                    // this.loadList(1);
                                    this.initKengcheng();
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
            submit() {
                this.$refs.formModel
                    .validate()
                    .then((res) => {
                        if (this.loading) return;
                        this.loading = true;
                        var form = this.form;
                        this.$post(api.kechengziyuan.insert, form)
                            .then((res) => {
                                this.loading = false;
                                if (res.code == api.code.OK) {
                                    this.$message.success("添加课件资源成功");
                                    this.initKengcheng();
                                    // this.loadList(1);
                                    // this.getchart()
                                    this.dialogVisible = false;
                                    this.$refs.formModel.resetFields();
                                    this.loadInfo();
                                } else {
                                    this.$message.error(res.msg);
                                }
                            })
                            .catch(e => {
                                this.loading = false;
                                this.$message.error(e.message);
                            });
                    })
                    .catch((err) => {
                        console.log(err.message);
                    });
            },
            submit1() {
                this.$refs.formModel1
                    .validate()
                    .then((res) => {
                        if (this.loading) return;
                        this.loading = true;
                        var form = this.form1;
                        this.$post(api.kechengziyuan.update, form)
                            .then((res) => {
                                this.loading = false;
                                if (res.code == api.code.OK) {
                                    this.$message.success("修改课件资源成功");
                                    this.$refs.formModel1.resetFields();
                                    this.dialogVisible1 = false;
                                    this.initKengcheng();
                                    // this.loadList(1);
                                    this.loadInfo();
                                } else {
                                    this.$message.error(res.msg);
                                }
                            })
                            .catch((err) => {
                                this.loading = false;
                                this.$message.error(err.message);
                            });
                    })
                    .catch((err) => {
                        console.log(err.message);
                    });
            },
        },
        beforeRouteUpdate(to, form, next) {
            extend(this.search, to.query);
            // this.loadList(1);
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
            this.role = localStorage.getItem('role')
            // this.initKengcheng();
            // this.loadList(1);
        },
        mounted() {
            this.initKengcheng();
            // this.getchart()
        }
    };
</script>

<style type="text/scss" scoped lang="scss"></style>