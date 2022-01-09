import request from "../utils/request";

export function login(data) {
  return request({
    url: "/vue-element-admin/user/login",
    method: "post",
    data,
  });
}

export function getInfo(token) {
  // return request({
  //   url: '/vue-element-admin/user/info',
  //   method: 'get',
  //   params: { token }
  // })
  return Promise.resolve({
    data: {
      roles: ["admin"],
      introduction: "I am a super administrator",
      avatar:
        "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
      name: "Super Admin",
    },
  });
}

export function logout() {
  return request({
    url: "/vue-element-admin/user/logout",
    method: "post",
  });
}
