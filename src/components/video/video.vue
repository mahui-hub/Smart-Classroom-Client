<template>
  <div class="e-video" style="width: 100%;height: 100%">
    <video-player :playsinline="true" style="width: 100%;height: 100%" :options="playerOption"></video-player>
  </div>
</template>
<style type="text/scss" lang="scss"></style>
<script>
  import {
    formatImageSrc
  } from "@/utils/utils";

  export default {
    name: "e-video",
    data() {
      return {
        playerOption: {
          muted: false,
          autoplay: false,
          controls: true, //控制条
          preload: "auto", //视频预加载
          muted: false, //默认情况下将会消除任何音频。
          loop: false, //导致视频一结束就重新开始。
          language: "zh-CN",
          aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          width: document.documentElement.clientWidth,
          height: "100%",
          playbackRate: 1.0,
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [{
            type: "video/mp4",
            src: "",
          }, ],
          poster: require("./poster.jpg"),
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true, //全屏按钮
          },
          notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        },
      };
    },
    props: {
      src: String,
      poster: String,
      autoplay: {
        type: Boolean,
        default: true,
      },
    },
    watch: {
      autoplay: {
        handler(val) {
          this.playerOption.autoplay = val;
        },
        immediate: true,
      },
      src: {
        handler(val) {
          this.playerOption.sources = formatImageSrc(val);
        },
        immediate: true,
      },
      poster: {
        handler(val) {
          this.playerOption.poster = val;
        },
        immediate: true,
      },
    },
    computed: {},
    methods: {},
    created() {},
    mounted() {},
    destroyed() {},
  };
</script>