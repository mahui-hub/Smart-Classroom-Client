<template>
    <div class="xuesheng-add">
        <div slot="header" class="clearfix updt">
            <el-page-header @back="$router.go(-1)" content="修改资料">
            </el-page-header>
        </div>
        <div class="form-database-form">
            <el-form :model="form1" ref="formModel1" label-width="100px" :rules="rules1">
                <el-form-item label="学号" prop="xuehao">
                    <el-input placeholder="输入学号" v-model="form1.xuehao" disabled />
                </el-form-item>

                <el-form-item label="姓名" prop="xingming">
                    <el-input placeholder="输入姓名" v-model="form1.xingming" />
                </el-form-item>

                <el-form-item label="性别" prop="xingbie">
                    <el-select v-model="form1.xingbie" style="width: 100%">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="专业名称" prop="zhuanye">
                    <el-select v-model="form1.zhuanye" style="width: 100%" @change="handleChange1">
                        <el-option :key="m.zhuanye" v-for="m in zhuanyeList" :value="m.zhuanye" :label="m.zhuanye">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="班级名称" prop="banji">
                    <el-select v-model="form1.banji" style="width: 100%" @change="handleChange">
                        <el-option :key="m.banjimingcheng" v-for="m in banjiList1" :value="m.banjimingcheng"
                            :label="m.banjimingcheng"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="联系方式" prop="lianxidianhua">
                    <el-input placeholder="请输入联系方式" v-model="form1.lianxidianhua" />
                </el-form-item>

                <el-form-item label="QQ号" prop="qqhao">
                    <el-input placeholder="输入QQ号" v-model="form1.qqhao" />
                </el-form-item>

                <el-form-item label="头像" prop="touxiang" required>
                    <e-upload-image v-model="form1.touxiang"></e-upload-image>
                </el-form-item>

                <el-form-item label="详情" prop="xiangqing">
                    <e-editor v-model="form1.xiangqing"></e-editor>
                </el-form-item>
                <el-form-item v-if="btnText">
                    <el-button type="primary" @click="submit">{{ btnText }}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<style scoped lang="scss">
    .form-database-form {
        padding: 20px 60px;
    }
</style>
<script>
    import api from "@/api";
    import rule from "@/utils/rule";
    import {
        extend
    } from "@/utils/extend";

    export default {
        name: "xuesheng-add",
        data() {
            return {
                rule,
                rules1: {
                    xuehao: [{
                        required: true,
                        message: "请填写学号",
                    }, ],
                    xingming: [{
                        required: true,
                        message: "请填写姓名",
                        trigger: "blur",
                    }, ],
                    xingbie: [{
                        required: true,
                        message: "请选择性别",
                        trigger: "change",
                    }, ],
                    lianxidianhua: [{
                            required: true,
                            message: "请填写联系电话",
                            trigger: "blur",
                        },
                        {
                            validator: rule.checkPhone,
                            message: "请输入正确手机号码",
                        },
                    ],
                    qqhao: [{
                            required: true,
                            message: "请填写QQ号，用于在线交流",
                            trigger: "blur",
                        },
                        {
                            min: 6,
                            max: 10,
                            message: "QQ号长度在6-10字符",
                        },
                    ],
                },
                loading: false,
                form1: {
                    xuehao: "",
                    xingming: "",
                    xingbie: "",
                    banji: "",
                    banjiid: "",
                    zhuanye: "",
                    lianxidianhua: "",
                    qqhao: "",
                    touxiang: "",
                    xiangqing: "",
                },
                banjiList: [],
                zhuanyeList: [],
                banjiList1: []
            };
        },
        watch: {
            id: {
                handler() {
                    this.loadInfo();
                },
            },
        },
        props: {
            isRead: {
                type: Boolean,
                default: true,
            },
            btnText: {
                type: String,
                default: "提交",
            },
            id: {
                type: [String, Number],
                required: true,
            },
        },

        computed: {},
        methods: {
            handleChange1(data) {
                const params = {};
                params.xueyuan = "";
                params.zhuanye = data;
                params.banjimingcheng = "";
                params.page = 1;
                params.pagesize = 10;
                this.$post(api.banji.list, params)
                    .then((res) => {
                        if (res.code == api.code.OK) {
                            this.banjiList1 = res.data.list;
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        this.$message.error(err.message);
                    });
            },
            submit() {
                this.$refs.formModel1
                    .validate()
                    .then((res) => {
                        if (this.loading) return;
                        this.loading = true;
                        var form = this.form1;
                        this.$post(api.xuesheng.update, form)
                            .then((res) => {
                                this.loading = false;
                                if (res.code == api.code.OK) {
                                    this.$message.success("修改学生信息成功");
                                    this.$refs.formModel1.resetFields();
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
            handleChange(data) {
                console.log(this.banjiList);
                var id = "";
                this.banjiList.map(function (item) {
                    console.log(item);
                    if (item.banjimingcheng == data) {
                        id = item.id;
                    }
                });
                this.form.banjiid = id;
                this.form1.banjiid = id;
            },
            loadInfo() {
                // 更新数据,获取数据
                this.loading = true;
                var form = this.form;
                this.$post(api.xuesheng.edit, {
                        id: this.id,
                    })
                    .then((res) => {
                        this.loading = false;
                        if (res.code == api.code.OK) {
                            extend(this, res.data);
                            this.form1 = res.data.mmm;
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
        },
        created() {
            this.loadInfo();
        },
        mounted() {},
        destroyed() {},
    };
</script>