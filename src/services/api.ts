import axios from "axios";
import { searchParamsFromObject } from "../utils/searchParamsFromObject";
import isNill from "../utils/isNill";

const host = process.env.REACT_APP_API_HOST || "http://localhost:3000"; // should be in .env file

export const api = axios.create({
  baseURL: host,
  headers: { "Content-Type": "application/json" },
});

export function getFormData(data: Record<string, any> = {}) {
  const formData = new FormData();
  Object.keys(data).forEach((k) => {
    if (!isNill(data[k])) {
      if (Array.isArray(data[k])) {
        for (let i = 0; i < data[k].length; i++) {
          formData.append(`${k}[]`, data[k][i]);
        }
      } else {
        formData.append(k, data[k]);
      }
    }
  });
  return formData;
}

export function getConfig(
  token: string | null,
  extra: object = {},
  extraHeader: object = {}
) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      ...extraHeader,
    },
    ...extra,
  };
}
// API Calls
export const login = (token: string | null, body?: any, config?: any) => {
  // we can create interfaces for the body later for each API call
  return api.post("/auth/login", body);
};

export const register = (token: string | null, body?: any, config?: any) => {
  return api.post("/auth/register", body);
};

export const refresh = (token: string | null, body?: any, config?: any) => {
  return api.post("/auth/refresh", body, getConfig(token));
};

export const getFlights = (token: string | null, body?: any, config?: any) => {
  const sp = searchParamsFromObject(body);
  return api.get("/flights" + sp, getConfig(token));
};

export const createFlight = (
  token: string | null,
  body?: any,
  config?: any
) => {
  return api.post("/flights", body, getConfig(token));
};

export const createFlightWithPhoto = (
  token: string | null,
  body?: any,
  config?: any
) => {
  const data = getFormData(body);
  console.log(data);

  return api.post(
    "/flights/withPhoto",
    data,
    getConfig(token, {}, { "Content-Type": "multipart/form-data" })
  );
};

export const updateFlight = (
  token: string | null,
  body?: any,
  config?: any
) => {
  return api.put(
    "/flights/" + body?.id,
    { ...body, id: undefined },
    getConfig(token)
  );
};
export const updateFlightWithPhoto = (
  token: string | null,
  body?: any,
  config?: any
) => {
  const data = getFormData({ ...body, id: undefined });

  return api.put(
    `/flights/${body?.id}/withPhoto`,
    data,
    getConfig(token, {}, { "Content-Type": "multipart/form-data" })
  );
};

export const validateCode = (
  token: string | null,
  body?: any,
  config?: any
) => {
  const sp = searchParamsFromObject(body);
  return api.get("/flights/available" + sp, getConfig(token));
};

export const deleteFlight = (
  token: string | null,
  body?: any,
  config?: any
) => {
  return api.delete("/flights/" + body?.id, getConfig(token));
};

export const getFlightImage = (
  token: string | null,
  body?: any,
  config?: any
) => {
  return api.get(
    `/flights/${body?.id}/photo`,
    getConfig(token, { responseType: "blob" })
  );
};
