import _ from "lodash";
export default {
  props: {
    code: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: "item",
      validator: function (value) {
        return ["page", "item"].indexOf(value) !== -1;
      },
    },
  },
  render() {
    const permission = JSON.parse(localStorage.getItem("permissions"));
    return (this.code.length &&
      _.intersection(permission, this.code).length > 0) ||
      !this.code.length ? (
      this.$scopedSlots.default()
    ) : this.type === "page" ? (
      <NoAppAuthPage />
    ) : (
      ""
    );
  },
};
