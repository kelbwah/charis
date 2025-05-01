import api from "./api";
import { User } from "./types";
import { AxiosResponse } from "axios";

export const getUserSelf = (): Promise<AxiosResponse<User>> => {
  return api.get<User>("/users/me");
};
