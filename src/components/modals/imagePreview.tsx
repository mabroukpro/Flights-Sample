import { useEffect, useState } from "react";
import { Modal, message } from "antd";
import { useFetch } from "../../hooks/useFetch";
import { getFlightImage } from "../../services/api";

interface ImagePreviewModalProps {
  id: string;
  open: boolean;
  toggle: (open: boolean) => void;
}

function ImagePreviewModal({ id, open, toggle }: ImagePreviewModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { data, isLoading } = useFetch({
    action: getFlightImage,
    body: { id },
    autoFetch: true,
    onError: (error) => {
      message.error(error);
    },
  });

  useEffect(() => {
    if (data) {
      const url = URL.createObjectURL(data);
      setImageUrl(url);

      // Cleanup the Object URL when the component is unmounted or the image data changes
      return () => URL.revokeObjectURL(url);
    }
  }, [data]);

  return (
    <Modal
      open={open}
      onCancel={() => toggle(false)}
      footer={null}
      title="Image Preview"
    >
      <div className="tw-min-h-20 tw-flex tw-justify-center tw-items-center">
        {isLoading
          ? "Loading..."
          : imageUrl && <img src={imageUrl} alt="Flight" />}
      </div>
    </Modal>
  );
}

export default ImagePreviewModal;
