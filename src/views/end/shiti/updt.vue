<template>
    <div class="shiti-add" v-loading="loading">
        <el-card class="box-card">
            <div slot="header" class="clearfix updt">
                <el-page-header @back="$router.go(-1)" content="编辑试题">
                </el-page-header>
            </div>
            <div class="form-database-form">


                <el-form :model="form" ref="formModel" label-width="130px" status-icon validate-on-rule-change>
                    <el-form-item v-if="isRead" label="题库编号" prop="tikubianhao">
                        {{  form.tikubianhao  }} </el-form-item>

                    <el-form-item v-if="isRead" label="题库名称" prop="tikumingcheng">
                        {{  form.tikumingcheng  }} </el-form-item>

                    <el-form-item label="试题题目" prop="shititimu" required :rules="[{required:true, message:'请填写试题题目'}]">
                        <el-input type="textarea" v-model="form.shititimu"></el-input>
                    </el-form-item>

                    <el-form-item label="类型" prop="leixing">
                        <el-select v-model="form.leixing">
                            <el-option label="单选题" value="单选题"></el-option>
                            <el-option label="多选题" value="多选题"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="答案" prop="daan">
                        <e-paper v-model="form.daan" :type="form.daan" danxuanti="" duoxuanti="" panduanti=""></e-paper>
                    </el-form-item>

                    <el-form-item label="发布人" prop="faburen">
                        <el-input v-model="form.faburen" readonly style="width: 250px;"></el-input>
                    </el-form-item>

                    <el-form-item v-if="btnText">
                        <el-button type="primary" @click="submit">{{ btnText }}</el-button>
                    </el-form-item>
                </el-form>

            </div>
        </el-card>
    </div>
</template>
<style type="text/scss" scoped lang="scss">
    .shiti-add{

}
</style>
<script>
    import api from '@/api'
    import rule from '@/utils/rule'
    import {
        extend
    } from '@/utils/extend'


    export default {
        name: 'shiti-add',
        data() {
            return {
                rule,
                loading: false,
                form: {
                    tikubianhao: '',
                    tikumingcheng: '',
                    shititimu: '',
                    leixing: '',
                    daan: '',
                    faburen: this.$store.state.user.session.username,
                    tikuid: 0,

                },


            }
        },
        watch: {
            id: {
                handler() {
                    this.loadInfo();
                }
            }
        },
        props: {
            isRead: {
                type: Boolean,
                default: true
            },
            btnText: {
                type: String,
                default: '提交'
            },
            id: {
                type: [String, Number],
                required: true
            },
        },

        computed: {},
        methods: {
            submit() {
                this.$refs.formModel.validate().then(res => {
                    if (this.loading) return;
                    this.loading = true;
                    var form = this.form;

                    this.$post(api.shiti.update, form).then(res => {
                        this.loading = false;
                        if (res.code == api.code.OK) {
                            this.$message.success('添加成功');
                            this.$emit('success', res.data);
                            this.$refs.formModel.resetFields();
                            this.$router.go(-1);
                        } else {
                            this.$message.error(res.msg);
                        }
                    }).catch(err => {
                        this.loading = false;
                        this.$message.error(err.message);
                    })

                }).catch(err => {
                    console.log(err.message);
                })

            },
            loadInfo() {

                // 更新数据,获取数据
                this.loading = true;
                var form = this.form;
                this.$post(api.shiti.edit, {
                    id: this.id
                }).then(res => {
                    this.loading = false;
                    if (res.code == api.code.OK) {
                        extend(this, res.data);
                        this.form = res.data.mmm;

                    } else {
                        this.$message.error(res.msg);
                        this.$router.go(-1);
                    }
                }).catch(err => {
                    this.$message.error(err.message);
                    this.$router.go(-1);
                });
            },
        },
        created() {
            this.loadInfo();
        },
        mounted() {},
        destroyed() {}
    }
</script>