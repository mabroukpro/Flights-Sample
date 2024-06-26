import React from "react";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import PageContainer from "../../components/pageContainer";
import { useFetch } from "../../hooks/useFetch";
import { register } from "../../services/api";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";

type FieldType = {
  email?: string;
  password?: string;
  name?: string;
};

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { startFetch, isLoading } = useFetch({
    action: register,
    onComplete: (result) => {
      dispatch(setUser(result));
      navigate("/");
    },
  });
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
    startFetch(values);
  };
  return (
    <PageContainer
      title="Register"
      centeredTitle
      className="tw-flex tw-justify-center tw-items-center"
    >
      <div className="tw-max-w-96 tw-p-6 tw-mt-10 tw-border-gray-300 tw-rounded tw-border">
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item<FieldType>
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              disabled={isLoading}
              loading={isLoading}
              type="primary"
              htmlType="submit"
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </PageContainer>
  );
};

export default RegisterPage;
