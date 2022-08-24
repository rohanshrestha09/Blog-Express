import { useState } from "react";
import { Form, Input, Button, Checkbox, DatePicker, Upload } from "antd";
import type { DatePickerProps } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";

const Signup: React.FC = () => {
  const [form] = Form.useForm();

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

  return (
    <>
      <input type="checkbox" id="registerModal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative bg-white min-h-[98%]">
          <label
            htmlFor="registerModal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <Form
            className="!pt-2"
            name="normal_login"
            initialValues={{ remember: true }}
            layout="vertical"
            form={form}
            requiredMark={false}
            // onFinish={onFinish}
          >
            <Form.Item
              name="fullname"
              label="Full Name"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                className="!rounded-lg !p-3"
                prefix={
                  <UserOutlined className="!text-gray-600 text-lg mr-2" />
                }
                placeholder="Full Name"
              />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                className="!rounded-lg !p-3"
                prefix={
                  <UserOutlined className="!text-gray-600 text-lg mr-2" />
                }
                placeholder="Email"
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
                className="!rounded-lg !p-3"
                prefix={
                  <LockOutlined className="!text-gray-600 text-lg mr-2" />
                }
                type="password"
                placeholder="Password"
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone className="!text-gray-600 text-lg" />
                  ) : (
                    <EyeInvisibleOutlined className="!text-gray-600 text-lg" />
                  )
                }
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input.Password
                className="!rounded-lg !p-3"
                prefix={
                  <LockOutlined className="!text-gray-600 text-lg mr-2" />
                }
                type="password"
                placeholder="Confirm Password"
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone className="!text-gray-600 text-lg" />
                  ) : (
                    <EyeInvisibleOutlined className="!text-gray-600 text-lg" />
                  )
                }
              />
            </Form.Item>

            <div className="w-full flex items-center justify-between">
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
                <DatePicker className="!rounded-lg !p-3 w-full" />
              </Form.Item>

              <Form.Item label="Display Picture">
                <Upload {...fileUploadOptions}>
                  <Button
                    className="!rounded-lg !flex !items-center !h-12"
                    icon={<UploadOutlined className="text-lg" />}
                  >
                    Click to Upload
                  </Button>
                </Upload>
              </Form.Item>
            </div>

            <Form.Item>
              <Form.Item name="remember" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <a className="absolute right-0" href="">
                Forgot password
              </a>
            </Form.Item>
          </Form>

          <Form.Item>
            <Button
              className="w-full !h-[3.2rem] !rounded-lg !text-base !btn-primary"
              htmlType="submit"
            >
              Signup Now
            </Button>
          </Form.Item>

          <Form.Item className="flex justify-center !mb-0">
            <span>
              Already have an account?{" "}
              <span className="text-[#0579FD] cursor-pointer">Login</span>
            </span>
          </Form.Item>
        </div>
      </div>
    </>
  );
};

export default Signup;
