import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  message,
} from "antd";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { useFetch } from "../../hooks/useFetch";
import {
  createFlight as createFlightAPI,
  createFlightWithPhoto,
  validateCode as validateCodeAPI,
  updateFlight as updateFlightAPI,
  updateFlightWithPhoto as updateFlightWithPhotoAPI,
} from "../../services/api";
import dayjs from "dayjs";
interface FieldType {
  code: string;
  capacity: number;
  departureDate: string;
}

interface FlightModalProps {
  open: boolean;
  toggle: (open: boolean) => void;
  onFinished: () => void;
  flight?: any;
}

function FlightModal({ open, toggle, flight, onFinished }: FlightModalProps) {
  const [form] = Form.useForm<FieldType>();
  const [img, setImg] = useState<File | undefined>();
  const { startFetch: validateCode, isLoading: isCodeValidationLoading } =
    useFetch({
      action: validateCodeAPI,
      onComplete: (res) => {
        if (res?.status === "available") {
          const date = dayjs(form.getFieldValue("departureDate")).format(
            "YYYY-MM-DD"
          );
          flight
            ? updateFlight({
                ...form.getFieldsValue(),
                id: flight.id,
                photo: img,
                departureDate: date,
              })
            : createFlight({
                ...form.getFieldsValue(),
                photo: img,
                departureDate: date,
              });
        } else {
          message.error(
            // todo: use message hook instead
            "Code is already taken!, Please change code and try again."
          );
        }
      },
      onError: (error) => {
        message.error(error);
      },
    });
  const { startFetch: createFlight, isLoading: isFlightCreationLoading } =
    useFetch({
      action: img ? createFlightWithPhoto : createFlightAPI,
      onComplete: () => {
        toggle?.(false);
        form.resetFields();
        onFinished?.();
        message.success("Flight created successfully!");
      },
      onError: (error) => {
        message.error(error); // todo: show error message
      },
    });

  const { startFetch: updateFlight, isLoading: isFlightUpdating } = useFetch({
    action: img ? updateFlightWithPhotoAPI : updateFlightAPI,
    onComplete: () => {
      toggle?.(false);
      form.resetFields();
      onFinished?.();
      message.success("Flight updated successfully!");
    },
    onError: (error) => {
      message.error(error);
    },
  });
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (flight && values.code === flight?.code) {
          updateFlight({
            ...values,
            id: flight.id,
            photo: img,
            departureDate: dayjs(values.departureDate).format("YYYY-MM-DD"),
          });
          return;
        }
        validateCode({ code: values.code });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const isLoading =
    isCodeValidationLoading || isFlightCreationLoading || isFlightUpdating;

  return (
    <Form
      form={form}
      initialValues={{
        code: flight?.code,
        capacity: flight?.capacity,
        departureDate: flight?.departureDate
          ? dayjs(flight?.departureDate, "YYYY-MM-DD")
          : undefined,
      }}
    >
      <Modal
        open={open}
        title="Create a new flight"
        onOk={handleSubmit}
        okButtonProps={{
          loading: isLoading,
          disabled: isLoading,
        }}
        okText={flight ? "Update" : "Create"}
        onCancel={() => toggle?.(false)}
      >
        <Form.Item<FieldType>
          label="Code"
          name="code"
          layout="vertical"
          rules={[
            {
              required: true,
              message: "Please input Flight Code",
              pattern: /^[a-zA-Z]{6}$/,
            },
          ]}
        >
          <Input disabled={isLoading} />
        </Form.Item>
        <Form.Item<FieldType>
          label="Capacity"
          layout="vertical"
          name="capacity"
          rules={[
            {
              required: true,
              message: "Please input Flight Capacity",
              type: "number",
              min: 1,
              max: 200,
            },
          ]}
        >
          <InputNumber disabled={isLoading} className="tw-w-full" />
        </Form.Item>
        <Form.Item<FieldType>
          label="Departure Date"
          name="departureDate"
          layout="vertical"
          rules={[
            {
              required: true,
              message: "Please input Departure Date",
            },
          ]}
        >
          <DatePicker
            disabled={isLoading}
            format="YYYY-MM-DD"
            className="tw-w-full"
          />
        </Form.Item>
        <Dropzone
          accept={{ "image/*": [".png", ".jpeg", ".jpg", ".gif"] }}
          onDropAccepted={(acceptedFiles) => {
            setImg(acceptedFiles[0]);
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <section>
              <div
                {...getRootProps()}
                className="tw-border tw-p-4 tw-mt-4 tw-cursor-pointer"
              >
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
                {img && <img src={URL.createObjectURL(img)} alt="Flight" />}
              </div>
            </section>
          )}
        </Dropzone>
        {img && (
          <Button className="tw-mt-4" onClick={() => setImg(undefined)}>
            Remove Image
          </Button>
        )}
      </Modal>
    </Form>
  );
}

export default FlightModal;
