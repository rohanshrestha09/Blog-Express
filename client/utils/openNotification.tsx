import { notification, Space } from "antd";
import { BiErrorCircle } from "react-icons/bi";
import { MdOutlineTaskAlt } from "react-icons/md";

export const openSuccessNotification = (message: string): void => {
  notification.open({
    className: "rounded-lg",
    message: (
      <Space>
        <MdOutlineTaskAlt size={19} />

        <span className="text-[#003320]">{message}</span>
      </Space>
    ),
    style: {
      backgroundColor: "#36D399",
    },
  });
};

export const openErrorNotification = (message: string): void => {
  notification.open({
    className: "rounded-lg",
    message: (
      <Space>
        <BiErrorCircle size={19} />

        <span className="text-[#470000]">{message}</span>
      </Space>
    ),
    style: {
      backgroundColor: "#F87272",
    },
  });
};
