import { useNavigate, useRouteError } from "react-router-dom";
import PageContainer from "./components/pageContainer";
import { Button } from "antd";

interface RouteError {
  statusText?: string;
  message?: string;
}

export default function ErrorPage() {
  const error = useRouteError() as RouteError;
  const navigate = useNavigate();

  console.error(error);
  const handleClick = () => {
    navigate("/");
  };

  return (
    <PageContainer
      id="error-page"
      className="tw-h-svh tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-2"
    >
      <h1 className="tw-text-8xl">Oops!</h1>
      <p className="tw-text-2xl">Sorry, an unexpected error has occurred.</p>
      <p className="tw-text-xl tw-font-extralight">
        <i>{error?.statusText || error?.message}</i>
      </p>
      <Button onClick={handleClick}>Go back to Home</Button>
    </PageContainer>
  );
}
