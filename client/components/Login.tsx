import Link from "next/link";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Input, Checkbox, Button } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import {
  UserOutlined,
  LockOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { login } from "../api/user";
import { Login } from "../interface/user";
import {
  openSuccessNotification,
  openErrorNotification,
} from "../utils/openNotification";
import { AUTH } from "../constants/queryKeys";

const Login: React.FC = () => {
  const queryClient = useQueryClient();

  const loginModalRef = useRef<HTMLLabelElement>(null);

  const [form] = Form.useForm();

  const [rememberME, setRememberMe] = useState<boolean>(true);

  const handleLogin = useMutation((data: Login) => login(data), {
    onSuccess: (res: any) => {
      openSuccessNotification(res.message);
      rememberME && localStorage.setItem("token", res.token);
      form.resetFields();
      loginModalRef.current?.click();
      queryClient.refetchQueries([AUTH]);
    },
    onError: (err: any) => openErrorNotification(err.response.data.message),
  });

  return (
    <>
      <input type="checkbox" id="loginModal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative scrollbar">
          <label
            ref={loginModalRef}
            htmlFor="loginModal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>

          <Form
            className="pt-3"
            name="normal_login"
            initialValues={{ remember: true }}
            layout="vertical"
            form={form}
            requiredMark={false}
            onFinish={() =>
              form.validateFields().then((values) => handleLogin.mutate(values))
            }
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please input your Email!" }]}
            >
              <Input
                className="rounded-lg p-2"
                prefix={<UserOutlined className="text-gray-600 text-lg mr-2" />}
                placeholder="Email"
                type="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input.Password
                className="rounded-lg p-2"
                prefix={<LockOutlined className="text-gray-600 text-lg mr-2" />}
                type="password"
                placeholder="Password"
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone className="text-gray-600 text-lg" />
                  ) : (
                    <EyeInvisibleOutlined className="text-gray-600 text-lg" />
                  )
                }
              />
            </Form.Item>

            <Form.Item>
              <Form.Item name="remember" noStyle>
                <Checkbox
                  checked={rememberME}
                  onChange={(e: CheckboxChangeEvent) =>
                    setRememberMe(e.target.checked)
                  }
                >
                  Remember me
                </Checkbox>
              </Form.Item>

              <Link href="/" passHref={true}>
                <a className="text-[#0579FD] absolute right-0">
                  Forgot password
                </a>
              </Link>
            </Form.Item>

            <Form.Item>
              <Button
                className="w-full h-[3.2rem] rounded-lg text-base btn-primary text-white hover:text-white"
                htmlType="submit"
                loading={handleLogin.isLoading}
              >
                Login
              </Button>
            </Form.Item>

            <Form.Item className="flex justify-center mb-0">
              <span>
                Don&apos;t have an account?{" "}
                <label
                  htmlFor="registerModal"
                  className="modal-button text-[#0579FD] cursor-pointer"
                  onClick={() => loginModalRef.current?.click()}
                >
                  Create One
                </label>
              </span>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
