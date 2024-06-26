import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse, AxiosError } from "axios";
import { setUser } from "../store/userSlice";
import { refresh } from "../services/api";

interface FetchProps<T> {
  autoFetch?: boolean;
  initResult?: any;
  action: (
    token: string | null,
    body?: T,
    config?: any
  ) => Promise<AxiosResponse>;
  body?: T;
  onComplete?: (result: any, body?: T) => void;
  onError?: (errorMessage: string, data: any, body?: T) => void;
  checkSuccess?: boolean;
  successAction?: Function;
}

function getErrorMessage(error: any): string {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  return error.message || "Unknown error";
}

export const useFetch = <T,>(
  {
    autoFetch = false,
    initResult,
    action,
    body,
    onComplete = () => {},
    onError = () => {},
    successAction,
  }: FetchProps<T>,
  deps: any[] = []
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(initResult);
  const [completed, setCompleted] = useState(false);

  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.clear();
    navigate("/login");
  }, [navigate]);

  const refreshAuthToken = useCallback(async () => {
    try {
      const response = await refresh(user.token, {
        refreshToken: user.refreshToken,
      });
      const { token, refreshToken } = response.data;
      dispatch(setUser({ ...user, token, refreshToken }));
      return token;
    } catch (error) {
      logout();
      throw error;
    }
  }, [dispatch, user, logout]);

  const startFetch = useCallback(
    async (
      b: T | undefined = body,
      loading: boolean = true,
      retry: boolean = false
    ) => {
      try {
        setIsLoading(loading);
        setError(null);

        const cancelTokenSource = axios.CancelToken.source();

        const tokenToUse = retry ? await refreshAuthToken() : user.token;

        const response = await action(tokenToUse || null, b, {
          cancelToken: cancelTokenSource.token,
        });
        await new Promise((resolve) => setTimeout(resolve, 1000)); // to simulate loading
        setData(response.data);
        setCompleted(true);
        onComplete(response.data, b);
        if (successAction) {
          dispatch(successAction(response.data));
        }
        setIsLoading(false);
      } catch (e: unknown) {
        console.error(e);

        if (axios.isCancel(e)) {
          return;
        }

        let errorMessage = "Unknown error";

        if (e instanceof AxiosError) {
          errorMessage = getErrorMessage(e);
          if (e.response?.status === 401 && !retry) {
            try {
              startFetch(b, loading, true); // Retry after refreshing token
              return;
            } catch (refreshError) {
              errorMessage = getErrorMessage(refreshError);
            }
          } else {
            errorMessage = getErrorMessage(e);
          }
        } else if (e instanceof Error) {
          errorMessage = e.message;
        }

        setError(errorMessage);
        onError(errorMessage, (e as AxiosError)?.response?.data, b);
        setIsLoading(false);
      }
    },
    [
      action,
      body,
      dispatch,
      onComplete,
      onError,
      successAction,
      user,
      refreshAuthToken,
    ]
  );

  useEffect(() => {
    if (autoFetch) {
      startFetch();
    }
  }, deps); // Only run the effect if dependencies change

  return { isLoading, error, data, completed, startFetch };
};
