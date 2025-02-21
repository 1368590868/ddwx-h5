import { getListByParentId } from "@/api/dict";
export default {
  data() {
    return {};
  },
  filters: {},
  computed: {},
  methods: {
    // 获取字典
    async getCommonDictList(parentId = "") {
      if (!parentId) {
        return;
      }
      let dictArray = [];
      // const loading = this.$loading({
      //   lock: false,
      //   text: "加载中...",
      // });
      try {
        const { data = [] } = await getListByParentId(parentId);
        dictArray = data;
      } catch (e) {
        throw new Error(e.message || "获取字典失败");
      } finally {
        // loading.close();
        // eslint-disable-next-line no-unsafe-finally
        return dictArray;
      }
    },
  },
};
