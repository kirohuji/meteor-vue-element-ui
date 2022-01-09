import { Option } from "element-ui";

// export default {
//   props: ["label", "value"],
//   name: "base-option",
//   componentName: "base-option",
//     inheritAttrs: false,
//   render() {
//     return (
//       <Option
//         {...{
//           props: {
//             label: this.label,
//             value: {
//               label: this.label,
//               value: this.value,
//             },
//           },
//         }}
//       >
//         <span style="float: left">{this.label}</span>
//         <span style="float: right; color: #8492a6; font-size: 13px">
//           {this.value}
//         </span>
//       </Option>
//     );
//   },
// };

export default ({ props: { label,value } }) => (
    <Option
    {...{
      props: {
        label: label,
        value: value,
      },
    }}
  >
    <span style="float: left">{label}</span>
    <span style="float: right; color: #8492a6; font-size: 13px">
      {value}
    </span>
  </Option>
);
