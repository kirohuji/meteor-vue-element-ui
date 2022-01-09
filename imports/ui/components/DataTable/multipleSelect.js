import _ from "lodash";
export default {
  props: {
    idKey: String,
    selectData: Array,
    isKey: Boolean,
  },
  watch: {
    data:{
      handler(){
        this.initialSelection()
      },
      deep: true,
    },
    /** 初始化 */
    selectData: {
      handler(val) {
        if (val && val.length) {
          if (this.isKey) {
            this.multipleInitialSelection = val;
          } else {
            this.multipleInitialSelection = val.map((item) => item[this.idKey]);
          }
        }
        // console.log('初始化')
        // this.initialSelection();
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      isChange: true,
      multipleInitialSelection: [],
      multipleSelectionAll: [],
    };
  },
  methods: {
    handleSelectionChange() {
      console.log("handleSelectionChange", this.page.currentPage);
      this.handleMultipleToggleSelection(this.page.currentPage);
    },
    /** 初始化 */
    initialSelection() {
      if (this.multipleInitialSelection.length) {
        // debugger
        const atta = [];
        /** 过滤多选 */
        const data = this.data.filter((item) => {
          const isAtta =
            this.multipleInitialSelection.indexOf(item[this.idKey]) !== -1;
          atta.push(item[this.idKey]);
          return isAtta;
        });
        /** 更新多选 */
        this.multipleSelectionAll[this.page.currentPage - 1] = _.unionBy(
          this.multipleSelectionAll[this.page.currentPage - 1],
          data,
          this.idKey
        );
        /** 过滤初始化数据 */
        this.multipleInitialSelection = _.difference(
          this.multipleInitialSelection,
          atta
        );
        this.$emit("multipleSelection", this.multipleSelectionAll);
      }
    },
    getSelection() {
      return _.flatten(this.multipleSelectionAll);
    },
    /** 切换页数时 */
    handleMultipleToggleSelection(val) {
      this.toggleSelection(this.multipleSelectionAll[val - 1]);
    },
    /** 切换 */
    toggleSelection(rows) {
      rows = _.intersectionBy(this.data, rows, this.idKey);
      if (rows && rows.length) {
        rows.forEach((row) => {
          this.$refs.table && this.$refs.table.toggleRowSelection(row, true);
        });
      } else {
        this.$refs.table && this.$refs.table.clearSelection();
      }
    },
    /** 将选中的数据放到multipleSelection */
    handleMultipleSelectionChange(val) {
      this.multipleSelectionAll[this.page.currentPage - 1] = val;
      this.$emit("multipleSelection", this.multipleSelectionAll);
    },
  },
};
