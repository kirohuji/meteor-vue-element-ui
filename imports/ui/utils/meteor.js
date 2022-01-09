import { Message } from "element-ui";
export function insert(collection, data, cb) {
  Meteor.call(
    `${collection}.insert`,
    {
      ...data,
      createdBy: Meteor.user().name,
    },
    (err) => {
      if (err) {
        return Message({
          message: err || "Error",
          type: "error",
          duration: 5 * 1000,
        });
      }

      Message({
        message: "操作成功",
        type: "success",
        duration: 5 * 1000,
      });
      cb();
    }
  );
}

export function save(collection, data, options, cb) {
  Meteor.call(`${collection}.save`, data, options, (err) => {
    if (err) {
      return Message({
        message: err || "Error",
        type: "error",
        duration: 5 * 1000,
      });
    }
    Message({
      message: "操作成功",
      type: "success",
      duration: 5 * 1000,
    });
    cb();
  });
}
export function remove(collection, data, cb) {
  Meteor.call(`${collection}.remove`, data, (err) => {
    if (err) {
      return Message({
        message: err || "Error",
        type: "error",
        duration: 5 * 1000,
      });
    }
    Message({
      message: "删除",
      type: "success",
      duration: 5 * 1000,
    });
  });
}

export function findOne(collection, data, cb) {
  Meteor.call(`${collection}.findOne`, data, (err, data) => {
    if (err) {
      return Message({
        message: err || "Error",
        type: "error",
        duration: 5 * 1000,
      });
    }
    cb(data);
  });
}

export function find(collection, data, cb) {
  Meteor.call(`${collection}.find`, data, (err, data) => {
    if (err) {
      return Message({
        message: err || "Error",
        type: "error",
        duration: 5 * 1000,
      });
    }
    cb(data);
  });
}
export function getDic({ name, method = "find", option = {}, cb }) {
  return {
    runner: [
      async () => {
        const data = await new Promise((resolve, reject) => {
          Meteor.call(`${name}.${method}`, option, async (err, result) => {
            if (err) {
              // return Message({
              //   message: error || "Error",
              //   type: "error",
              //   duration: 5 * 1000,
              // });e
              reject(new Error(e));
            }
            resolve(result);
          });
        });
        return {
          data,
        };
      },
      "",
      (data) => {
        // debugger
        return cb ? cb(data) : data;
      },
    ],
    immediate: true,
    default: [],
  };
}
