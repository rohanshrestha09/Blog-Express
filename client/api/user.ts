import { AxiosResponse } from "axios";
import axios from "../axios";

export const auth = async (): Promise<Response> => {
  const res: AxiosResponse = await axios.get("/auth");

  return res.data;
};
