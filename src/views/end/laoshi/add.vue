<template>
    <div class="laoshi-add" v-loading="loading">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                                <span> 添加老师</span>
                            </div>
            

            <el-form :model="form" ref="formModel" label-width="130px" status-icon validate-on-rule-change>
                                <el-form-item label="工号" prop="gonghao" required :rules="[{required:true, message:'请填写工号'}, {validator:rule.checkRemote, message:'内容重复了', checktype:'insert', module:'laoshi', col:'gonghao', trigger:'blur'}]">
                                            <el-input placeholder="输入工号" style="width:250px;" v-model="form.gonghao" />                                    </el-form-item>

                                <el-form-item label="密码" prop="mima" required :rules="[{required:true, message:'请填写密码'}]">
                                            <el-input placeholder="输入密码" style="width:250px;" v-model="form.mima" />                                    </el-form-item>

                                <el-form-item label="姓名" prop="xingming">
                                            <el-input placeholder="输入姓名" style="width:250px;" v-model="form.xingming" />                                    </el-form-item>

                                <el-form-item label="性别" prop="xingbie">
                                            <el-select v-model="form.xingbie" ><el-option label="男" value="男"></el-option>
<el-option label="女" value="女"></el-option>
</el-select>                                    </el-form-item>

                                <el-form-item label="手机号码" prop="shoujihaoma" :rules="[{validator:rule.checkPhone, message:'请输入正确手机号码'}]">
                                            <el-input placeholder="输入手机号码" style="width:250px;" v-model="form.shoujihaoma" />                                    </el-form-item>

                                <el-form-item label="邮箱" prop="youxiang" :rules="[{type:'email', message:'请输入正确固定号码'}]">
                                            <el-input placeholder="输入邮箱" style="width:250px;" v-model="form.youxiang" />                                    </el-form-item>

                                <el-form-item label="身份证" prop="shenfenzheng" :rules="[{validator:rule.checkCard, message:'请输入有效身份证号码'}]">
                                            <el-input placeholder="输入身份证" style="width:250px;" v-model="form.shenfenzheng" />                                    </el-form-item>

                                <el-form-item label="班级" prop="banji">
                                            <el-select v-model="form.banji" >
<el-option v-for="m in banjiList" :value="m.id" :label="m.banjimingcheng"></el-option>
</el-select>                                    </el-form-item>

                                <el-form-item label="头像" prop="touxiang">
                                            <e-upload-image v-model="form.touxiang"></e-upload-image>                                    </el-form-item>

                                <el-form-item v-if="btnText">
                    <el-button type="primary" @click="submit">{{ btnText }}</el-button>
                </el-form-item>
            </el-form>

        </el-card>
    </div>
</template>
<style type="text/scss" scoped lang="scss">
.laoshi-add{

}
</style>
<script>
    import api from '@/api'
    import rule from '@/utils/rule'
    import { extend } from '@/utils/extend'

    
    export default {
        name:'laoshi-add',
        data() {
            return {
                                rule,
                loading:false,
                form:{
                    gonghao:'',
                    mima:'',
                    xingming:'',
                    xingbie:'',
                    shoujihaoma:'',
                    youxiang:'',
                    shenfenzheng:'',
                    banji:'',
                    touxiang:'',

                                    
                },

                        banjiList:[],
            
            }
        },
                watch: {
                    },
        props: {
            isRead:{
                type:Boolean,
                default:true
            },
            btnText:{
                type:String,
                default:'提交'
            },
                    },

        computed: {},
        methods: {
            submit(){
                this.$refs.formModel.validate().then(res=>{
                    if(this.loading)return;
                    this.loading = true;
                    var form = this.form;

                    this.$post(api.laoshi.insert , form).then(res=>{
                        this.loading = false;
                        if(res.code == api.code.OK){
                            this.$message.success('添加成功');
                            this.$emit('success' , res.data);
                            this.$refs.formModel.resetFields();
                                                        this.loadInfo();
                                                    }else{
                            this.$message.error(res.msg);
                        }
                    }).catch(err=>{
                        this.loading = false;
                        this.$message.error(err.message);
                    })

                }).catch(err=>{
                    console.log(err.message);
                })

            },
            loadInfo(){

                                var form = this.form;
                // 获取模块得数据
                this.loading = true;
                this.$post(api.laoshi.create , {
                    id:this.$route.query.id
                }).then(res=>{
                    this.loading = false;
                    if(res.code == api.code.OK){
                        extend(this , res.data);
                                            }else{
                        this.$message.error(res.msg);
                        this.$router.go(-1);
                    }
                }).catch(err=>{
                    this.$message.error(err.message);
                    this.$router.go(-1);
                });
                            },
                    },
        created() {
            this.loadInfo();
                    },
        mounted() {
                    },
        destroyed() {
                    }
    }
</script>
