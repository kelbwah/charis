import api from "./api";
import { AxiosResponse } from "axios";

export const createInitialLaunchEmailsEntry = (
  email: string
): Promise<AxiosResponse<any>> => {
  return api.post<any>("/launch-emails", { email: email }, {});
};
