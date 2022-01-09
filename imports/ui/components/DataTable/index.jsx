// import "./style.scss";
import multipleSelect from "./multipleSelect";
import { Table, Pagination } from "element-ui";
import _ from "lodash";
export default {
  name: "DataTable",
  componentName: "DataTable",
  components: {
    Table,
    Pagination,
  },
  props: {
    isLocalData: Boolean,
    column: Array,
    total: Number || String,
    data: Array,
    page: {
      type: Object,
      default: () => {
        return {
          layout: `total, sizes, prev, pager, next, jumper`,
          total: 100,
          pageSizes: [10, 15, 30, 100],
          pageSize: 10,
          currentPage: 1,
          background: false,
        };
      },
    },
  },
  mixins: [multipleSelect],
  computed: {
    start() {
      return this.page.pageSize * (this.page.currentPage - 1);
    },
    end() {
      return this.page.pageSize * this.page.currentPage;
    },
  },
  render() {
    return (
      <div class="data-table">
        <Table
          ref="table"
          // data={this.data}
          data={
            this.isLocalData
              ? _.slice(this.data, this.start, this.end)
              : _.take(this.data, this.page.pageSize)
          }
          {...{
            props: {
              ...this.$attrs,
            },
            on: {
              ...this.$listeners,
              "select": (val) => {
                this.handleMultipleSelectionChange(val);
                this.$emit("select", val);
              },
              "select-all": (val) => {
                this.handleMultipleSelectionChange(val);
                this.$emit("select-all", val);
              },
            },
          }}
        >
          {this.column.map((item) => {
            if (item.isHide) {
              return (
                !item.isHide() && (
                  <ElTableColumn
                    {...{
                      props: item,
                      scopedSlots: {
                        default: this.$scopedSlots[item.prop],
                      },
                    }}
                  />
                )
              );
            } else {
              return (
                <ElTableColumn
                  {...{
                    props: item,
                    scopedSlots: {
                      default: this.$scopedSlots[item.prop],
                    },
                  }}
                />
              );
            }
          })}
        </Table>
        {!(this.$attrs["no-page"] || this.$attrs.noPage) && (
          <Pagination
            class="pagination"
            ref="pagination"
            {...{
              props: {
                ...this.page,
                total: this.total,
              },
              on: {
                ...this.$listeners,
                "update:currentPage": (val) => {
                  this.page.currentPage = val;
                  this.$emit("update:currentPage", val);
                },
                "update:pageSize": (val) => {
                  this.page.pageSize = val;
                  this.$emit("update:pageSize", val);
                },
              },
            }}
          ></Pagination>
        )}
      </div>
    );
  },
};
