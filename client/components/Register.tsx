import Link from "next/link";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Input, Button, Checkbox, DatePicker, Upload } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Register } from "../interface/user";
import { register } from "../api/user";
import {
  openSuccessNotification,
  openErrorNotification,
} from "../utils/openNotification";
import { AUTH } from "../constants/queryKeys";

const Register: React.FC = () => {
  const queryClient = useQueryClient();

  const registerModalRef = useRef<HTMLLabelElement>(null);

  const [form] = Form.useForm();

  const [rememberMe, setRememberMe] = useState<boolean>(true);

  const [selectedImage, setSelectedImage] = useState<File | null>();

  const fileUploadOptions = {
    maxCount: 1,
    multiple: false,
    showUploadList: true,
    beforeUpload: (file: File) => {
      if (file) setSelectedImage(file);
      return false;
    },
    onRemove: () => setSelectedImage(null),
  };

  const handleRegister = useMutation(
    (formValues: Register) => {
      // * avoid append if formvalue is empty
      const formData = new FormData();

      Object.keys(formValues).forEach((key) => {
        if (formValues[key]) formData.append(key, formValues[key]);
      });
      if (selectedImage) formData.append("image", selectedImage);

      return register(formData);
    },
    {
      onSuccess: (res: any) => {
        openSuccessNotification(res.message);
        rememberMe && localStorage.setItem("token", res.token);
        form.resetFields();
        registerModalRef.current?.click();
        queryClient.refetchQueries([AUTH]);
      },
      onError: (err: any) => openErrorNotification(err.response.data.message),
    }
  );

  return (
    <>
      <input type="checkbox" id="registerModal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative min-h-[98%] scrollbar">
          <label
            ref={registerModalRef}
            htmlFor="registerModal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <Form
            className="pt-3"
            name="normal_register"
            initialValues={{ remember: true }}
            layout="vertical"
            form={form}
            requiredMark={false}
            onFinish={() =>
              form.validateFields().then((values) =>
                handleRegister.mutate({
                  ...values,
                  dateOfBirth: values.dateOfBirth._d.toString(),
                })
              )
            }
          >
            <Form.Item
              name="fullname"
              label="Full Name"
              rules={[
                { required: true, message: "Please input your Fullname!" },
              ]}
            >
              <Input
                className="rounded-lg p-2"
                prefix={<UserOutlined className="text-gray-600 text-lg mr-2" />}
                placeholder="Full Name"
              />
            </Form.Item>

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
                {
                  validator: (_, value) => {
                    if (value.length < 8) {
                      return Promise.reject(
                        "Password must contain atleast 8 characters."
                      );
                    } else {
                      return Promise.resolve();
                    }
                  },
                },
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

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              rules={[
                { required: true, message: "Please input your Password!" },
                {
                  validator: (_, value) => {
                    if (value === form.getFieldValue("password")) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject("Password does not match.");
                    }
                  },
                },
              ]}
            >
              <Input.Password
                className="rounded-lg p-2"
                prefix={<LockOutlined className="text-gray-600 text-lg mr-2" />}
                type="password"
                placeholder="Confirm Password"
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone className="text-gray-600 text-lg" />
                  ) : (
                    <EyeInvisibleOutlined className="text-gray-600 text-lg" />
                  )
                }
              />
            </Form.Item>

            <div className="w-full flex justify-between">
              <Form.Item
                className="w-[60%]"
                name="dateOfBirth"
                label="Date of Birth"
                rules={[
                  {
                    required: true,
                    message: "Please input your Date of birth!",
                  },
                ]}
              >
                <DatePicker className="rounded-lg p-3 w-full" />
              </Form.Item>

              <Form.Item label="Display Picture">
                <Upload {...fileUploadOptions}>
                  <Button
                    className="rounded-lg flex items-center h-12"
                    icon={<UploadOutlined className="text-lg" />}
                  >
                    Click to Upload
                  </Button>
                </Upload>
              </Form.Item>
            </div>

            <Form.Item>
              <Form.Item name="remember" noStyle>
                <Checkbox
                  checked={rememberMe}
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
                loading={handleRegister.isLoading}
              >
                Signup Now
              </Button>
            </Form.Item>

            <Form.Item className="flex justify-center mb-0">
              <span>
                Already have an account?{" "}
                <label
                  htmlFor="loginModal"
                  className="modal-button text-[#0579FD] cursor-pointer"
                  onClick={() => registerModalRef.current?.click()}
                >
                  Login
                </label>
              </span>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Register;
