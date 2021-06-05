<template>
    <!-- 成绩比例页面 -->
    <div class="v-list" v-loading="loading" element-loading-text="加载中">
        <div class="form-search">
            <el-form :model="search" :inline="true" size="mini">
                <el-form-item label="课程名称">
                    <el-select v-model="search.kechengid" style="width: 100%" clearable>
                        <el-option v-for="m in kechengmingchengList" :key="m.id" :value="m.id"
                            :label="m.kechengmingcheng"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="searchSubmit" icon="el-icon-search">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addSubmit" icon="el-icon-plus">新增课程比例</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-table border :data="list" highlight-current-row stripe>
            <el-table-column type="index" align="center"></el-table-column>
            <!-- 序号 -->
            <el-table-column label="课程名称" align="center" :formatter="kechengFormatter">
            </el-table-column>
            <el-table-column label="成绩比例构成" align="center" style="color: black;font-size: 14px;">
                <el-table-column label="期末成绩" align="center" prop="qimochengji">

                </el-table-column>
                <el-table-column label="学生互评" align="center">
                    <template slot-scope="{ row }"> {{ row.shenghupingchengji }} </template>
                </el-table-column>
                <el-table-column label="教师评价" align="center">
                    <template slot-scope="{ row }"> {{ row.jiaoshipingjiachengji }} </template>
                </el-table-column>
                <el-table-column label="抢答问题" align="center">
                    <template slot-scope="{ row }"> {{ row.qiangdawentichengji }} </template>
                </el-table-column>
                <el-table-column label="随堂测试" align="center">
                    <template slot-scope="{ row }"> {{ row.suitangceshichengji }} </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="{ row }">
                    <!-- <el-button @click="edit(row)" type="text">编辑</el-button> -->
                    <el-button type="text" @click="deleteItem(row)">删除 </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="e-pages" style="margin-top: 10px;text-align: center">
            <el-pagination @current-change="initKecheng" :current-page="page" :page-size="pagesize"
                @size-change="sizeChange" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
            </el-pagination>
        </div>
        <el-dialog :title="headerTitle" :visible.sync="dialogVisible" size="mini">
            <div class="form-database-form">
                <el-form :model="form" ref="formModel" label-width="120px" :rules="rules">
                    <el-form-item label="课程名称" required>
                        <el-select v-model="form.kechengid" style="width: 100%" clearable :disabled="oper=='edit'">
                            <el-option v-for="m in kechengmingchengList" :key="m.id" :value="m.id"
                                :label="m.kechengmingcheng"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="期末成绩比例" prop="qimochengji">
                        <el-input placeholder="请输入成绩比例" v-model="form.qimochengji" />
                    </el-form-item>
                    <el-form-item label="随堂测试成绩" prop="suitangceshichengji">
                        <el-input placeholder="请输入成绩比例" v-model="form.suitangceshichengji" />
                    </el-form-item>
                    <el-form-item label="抢答问题成绩" prop="qiangdawentichengji">
                        <el-input placeholder="请输入成绩比例" v-model="form.qiangdawentichengji" />
                    </el-form-item>
                    <el-form-item label="学生互评成绩" prop="shenghupingchengji">
                        <el-input placeholder="请输入成绩比例" v-model="form.shenghupingchengji" />
                    </el-form-item>
                    <el-form-item label="教师评价成绩" prop="jiaoshipingjiachengji">
                        <el-input placeholder="请输入成绩比例" v-model="form.jiaoshipingjiachengji" />
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit" v-if="oper=='add'">确 定</el-button>
                <el-button type="primary" @click="submit1" v-if="oper=='edit'">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<style type="text/scss" scoped lang="scss"></style>
<script>
    import api from "@/api";
    import {
        remove,
        checkIssh
    } from "@/utils/utils";
    import {
        extend
    } from "@/utils/extend";
    import objectDiff from "objectdiff";

    // 验证是否是[0-1]的小数
    export function isDecimal(rule, value, callback) {
        if (!value) {
            return callback(new Error('输入不可以为空'));
        }
        setTimeout(() => {
            // if (!Number(value)) {
            //     callback(new Error('请输入[0,1]之间的数字'));
            // } else {
            if (this.oper == "add") {
                if (value < 1 || value > 100) {
                    callback(new Error('请输入[1,100]之间的数字'));
                } else {
                    callback();
                }
            }


            // }
        }, 100);
    }
    export default {
        data() {
            return {
                kechengmingchengList: [],
                oper: "",
                headerTitle: "",
                dialogVisible: false,
                form: {
                    kechengid: '',
                    shenghupingchengji: 0,
                    qimochengji: 0,
                    suitangceshichengji: 0,
                    qiangdawentichengji: 0,
                    jiaoshipingjiachengji: 0
                },
                loading: false,
                list: [],
                search: {
                    kechengid: ''
                },
                total: {},
                page: 1, // 当前页
                pagesize: 10, // 页大小
                totalCount: 0, // 总行数
                zhuanyeList: [],
                rules: {
                    qimochengji: [{
                        required: true,
                        message: "请输入成绩比例",
                        trigger: "blur"
                    }, {
                        validator: isDecimal,
                        trigger: 'blur'
                    }],
                    suitangceshichengji: [{
                        required: true,
                        message: "请输入成绩比例",
                        trigger: "blur"
                    }, {
                        validator: isDecimal,
                        trigger: 'blur'
                    }],
                    qiangdawentichengji: [{
                        required: true,
                        message: "请输入成绩比例",
                        trigger: "blur"
                    }, {
                        validator: isDecimal,
                        trigger: 'blur'
                    }],
                    shenghupingchengji: [{
                        required: true,
                        message: "请输入成绩比例",
                        trigger: "blur"
                    }, {
                        validator: isDecimal,
                        trigger: 'blur'
                    }],
                    jiaoshipingjiachengji: [{
                        required: true,
                        message: "请输入成绩比例",
                        trigger: "blur"
                    }, {
                        validator: isDecimal,
                        trigger: 'blur'
                    }],
                },
            };
        },
        methods: {
            kechengFormatter(row) {
                var name = "";
                this.kechengmingchengList.forEach(function (item) {
                    if (row.kechengid == item.id) {
                        name = item.kechengmingcheng;
                    }
                });
                return name;
            },
            initKecheng() {
                // 防止重新点加载列表
                // 筛选条件
                var filter = extend(true, {}, {
                    jiaoshiid: localStorage.getItem("jiaoshiid"),
                    page: 1,
                    pagesize: 10,
                });
                this.$post(api.kecheng.list, filter)
                    .then((res) => {
                        if (res.code == api.code.OK) {
                            this.kechengmingchengList = res.data.list;
                            var id = ""
                            this.kechengmingchengList.map(function (item) {
                                id = item.id
                            })
                            this.loadList3(id)
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        this.loading = false;
                        this.$message.error(err.message);
                    });
            },
            operChange() {
                if (this.oper == "add") {
                    this.headerTitle = "设置成绩比例构成";
                } else {
                    this.headerTitle = "编辑成绩比例构成";
                }
            },
            edit(row) {
                this.form = row
                // this.form.qiangdawentichengji = row.qiangdawentichengji * 100;
                // this.form.shenghupingchengji = row.shenghupingchengji * 100;
                // this.form.qimochengji = row.qimochengji * 100;
                // this.form.jiaoshipingjiachengji = row.jiaoshipingjiachengji * 100;
                // this.form.suitangceshichengji = row.suitangceshichengji * 100;
                this.oper = "edit";
                this.dialogVisible = true;
                this.operChange();
            },
            addSubmit() {
                this.oper = "add";
                this.dialogVisible = true;
                this.operChange();
            },
            submit() {
                var a = Number(this.form.qimochengji)
                var b = Number(this.form.suitangceshichengji)
                var c = Number(this.form.qiangdawentichengji)
                var d = Number(this.form.shenghupingchengji)
                var e = Number(this.form.jiaoshipingjiachengji)
                var obj = {}
                obj.kechengid = this.form.kechengid
                obj.qimochengji = a / (a + b + c + d + e)
                obj.suitangceshichengji = b / (a + b + c + d + e)
                obj.qiangdawentichengji = c / (a + b + c + d + e)
                obj.shenghupingchengji = d / (a + b + c + d + e)
                obj.jiaoshipingjiachengji = e / (a + b + c + d + e)
                var zong = a + b + c + d + e
                // this.$refs.formModel.validate()
                //     .then((res) => {
                if (zong != 100) {
                    this.$message.error('请检查各成绩比例相加是否等于100');
                    return
                }
                debugger
                var form = obj;
                this.$post("/chengjibiliinsert", form)
                    .then((res) => {
                        this.loading = false;
                        if (res.code == api.code.OK) {
                            this.$message.success("设置成绩比例成功");
                            // this.loadList(1);
                            this.initKecheng()
                            this.dialogVisible = false;
                            this.$refs.formModel.resetFields();
                            this.loadInfo();
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        this.loading = false;
                        this.$message.error(err.message);
                    });
                // })
                // .catch((err) => {
                //     console.log(err.message);
                // });
            },
            submit1() {
                var a = Number(this.form.qimochengji * 100)
                var b = Number(this.form.suitangceshichengji * 100)
                var c = Number(this.form.qiangdawentichengji * 100)
                var d = Number(this.form.shenghupingchengji * 100)
                var e = Number(this.form.jiaoshipingjiachengji * 100)
                var obj = {}
                obj.kechengid = this.form.kechengid
                obj.id = this.form.id
                // obj.qimochengji = a
                // obj.suitangceshichengji = b
                // obj.qiangdawentichengji = c
                // obj.shenghupingchengji = d
                // obj.jiaoshipingjiachengji = e
                obj.qimochengji = a / (a + b + c + d + e)
                obj.suitangceshichengji = b / (a + b + c + d + e)
                obj.qiangdawentichengji = c / (a + b + c + d + e)
                obj.shenghupingchengji = d / (a + b + c + d + e)
                obj.jiaoshipingjiachengji = e / (a + b + c + d + e)
                var zong = a + b + c + d + e


                if (zong != 100) {
                    this.$message.error('请检查各成绩比例相加是否等于100');
                    return
                }

                var form = obj;
                console.log(form)
                this.$post("/chengjibiliupdate", form)
                    .then((res) => {
                        this.loading = false;
                        if (res.code == api.code.OK) {
                            this.$message.success("修改成绩比例成功");
                            // this.loadList(1);
                            this.initKecheng()
                            this.dialogVisible = false;
                            this.$refs.formModel.resetFields();
                            this.loadInfo();
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
                var form = this.form;
                // 获取模块得数据
                this.loading = true;
                this.$post('/chengjibili_add', {
                        id: this.$route.query.id,
                    })
                    .then((res) => {
                        this.loading = false;
                        if (res.code == api.code.OK) {
                            extend(this, res.data);
                        } else {
                            this.$message.error(res.msg);
                            this.$router.go(-1);
                        }
                    })
                    .catch((err) => {
                        this.$message.error(err.message);
                        this.$router.go(-1);
                    });
            },
            searchSubmit() {
                this.initKecheng()
                // this.loadList(1);
            },
            sizeChange(e) {
                this.pagesize = e;
                this.initKecheng()
                // this.loadList(1);
            },
            checkIssh,
            loadList3(id) {
                // 筛选条件
                var filter = extend(true, {}, this.search, {
                    kechengid: id,
                    page: 1,
                    pagesize: 10,
                });
                this.list = []
                this.$post("/chengjibili_list", filter)
                    .then((res) => {
                        this.totalCount = this.list.length
                        this.loading = false;
                        if (res.code == api.code.OK) {
                            this.totalCount = res.data.totalCount;
                            var array1 = res.data.list;
                            var array = [];
                            if (this.totalCount != 0) {
                                array1.forEach((item) => {
                                    array.push(item);
                                });
                                for (var i in array) {
                                    this.list.push(array[i]);
                                }
                                // console.log(this.list)
                            }
                            this.totalCount = this.list.length
                            // extend(this, res.data);
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        this.loading = false;
                        this.$message.error(err.message);
                    });
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
                this.$post("/chengjibili_list", filter)
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
                        this.$post('/chengjibili_delete', {
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
            this.initKecheng()
            // this.loadList(1);
        },
        mounted() {},
        destroyed() {},
    };
</script>