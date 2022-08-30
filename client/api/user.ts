import { AxiosResponse } from "axios";
import axios from "../axios";
import { Login } from "../interface/user";

export const auth = async (): Promise<Response> => {
  const res: AxiosResponse = await axios.get("http://localhost:5000/api/auth");

  return res.data;
};

export const register = async (data: FormData): Promise<Response> => {
  const res: AxiosResponse = await axios.post(
    "http://localhost:5000/api/register",
    data
  );

  return res.data;
};

export const login = async (data: Login): Promise<Response> => {
  const res: AxiosResponse = await axios.post(
    "http://localhost:5000/api/login",
    data
  );

  return res.data;
};
