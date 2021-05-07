<template>
    <div>
        <div class="section_title">
            <h2>
                <span>{{title}}</span>
            </h2>
        </div>
        <div>
            <slot></slot>
        </div>
    </div>
</template>
<style type="text/scss" scoped lang="scss">
    .section_title {
        text-align: center;  
        position: relative;
        h2{
            font-size: 36px;
            line-height: 36px;
            font-weight: 400;
            display: inline-block;
            margin-top: 18px;
           span {
                font-weight: 600;
            }
        }
    }
    .section_title::before {
        position: absolute;
        content: "";
        width: 40px;
        height: 1px;
        background: #f53737;
        bottom: 0;
        left: 50%;
        transform: translatex(-50%);
        margin-left: -10px;
    }
    .section_title::after {
        position: absolute;
        content: "";
        width: 40px;
        height: 1px;
        background: #F53737;
        bottom: -6px;
        left: 50%;
        transform: translatex(-50%);
    }

</style>
<script>
    export default {
        name: "e-module-widget-title",
        data() {
            return {

            }
        },
        props: {
            title: String
        },
        watch: {},
        methods: {},
        created() {},
        mounted() {},
        destroyed() {}
    }
</script>