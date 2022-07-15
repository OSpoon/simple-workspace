import service from "./axios";

export const UserApi = {
  getUsers: () => service.get<any>("/users"),
};
