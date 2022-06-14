export default {
    created() {
        if (!this.$options.name) { // 这里的name是页面/组件对象中的name，不是路由的
            console.warn("缓存页面失败！没有设置组件名！");
        }
        this.$store.commit("keepThisPage", this.$options.name);
    },
    beforeDestroy() {
        // console.log("触发组件销毁")
    }
};