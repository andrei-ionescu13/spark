import { isServer } from "@tanstack/react-query";
import { ApiError } from "./api-error";
import { setCookie } from "cookies-next";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const hasClient = typeof window !== "undefined";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

const apiUrl = hasClient ? `/api` : process.env.NEXT_PUBLIC_API_PATH;

const buildQueryString = (query: Record<string, any>): string => {
  const finalQuery: URLSearchParams = new URLSearchParams();

  Object.keys(query).forEach((key) => {
    finalQuery.append(key, query[key]);
  });

  return finalQuery.toString();
};

export const getNewAccesToken = async (
  cookies?: any,
  res?: any
): Promise<string> => {
  const respose = await fetch(`${apiUrl}/access-token`, {
    credentials: "include",
    headers: {
      ...(!!cookies && { Cookie: cookies }),
    },
  });
  const data = await respose.json();

  if (respose.ok) {
    return data;
  }

  if (res) {
    res.redirect(307, "login");
  } else {
    // Router.push("/login");
  }

  throw new ApiError(respose.status, data.message);
};

type ReturnType<T> = T extends Blob ? Blob : T;

export const appFetch = async <T>({
  req,
  res,
  url,
  config = {},
  noContentType = false,
  query = undefined,
  withAuth = false,
  responseType = "json",
}: {
  req?: any;
  res?: any;
  url: string;
  config?: RequestInit;
  noContentType?: boolean;
  query?: Record<string, any>;
  withAuth?: boolean;
  responseType?: string;

}): Promise<ReturnType<T>> => {
  const { headers = {}, ...restConfig } = config;
  // ...(isServer && { Cookie: cookieStore.toString() }),
  let cookieStore: ReadonlyRequestCookies | undefined;

  if (isServer) {
    const { cookies } = await import("next/headers");
    cookieStore = cookies();
  }

  const request = () =>
    fetch(`${apiUrl}${url}${query ? `?${buildQueryString(query)}` : ""}`, {
      ...(!noContentType && {
        headers: {
          ...DEFAULT_HEADERS,
          ...headers,
          ...((isServer && cookieStore) && { Cookie: cookieStore.toString() }),
        },
      }),
      ...restConfig,
      credentials: "include",
    });

  const handleSuccessResponse = async (response: any) => {
    if (responseType === "json") {
      let data: any = await response.text();
      data = data ? JSON.parse(data) : {};

      return data;
    }

    if (responseType === "blob") {
      const data = await response.blob();
      return data as ReturnType<T>;
    }
  };

  const appFetch = async () => {
    const response = await request();

    if (response.ok) {
      return await handleSuccessResponse(response);
    }

    const data = await response.json();
    throw new ApiError(response.status, data.message);
  };

  const appAuthFetch = async () => {
    let response = await request();
    if (response.ok) {
      return await handleSuccessResponse(response);
    }

    let data = await response.json();
    if (response.status !== 401) {
      throw new ApiError(response.status, data.message);
    }

    const newAccesToken = await getNewAccesToken(req?.headers.cookie, res);

    if (req && res) {
      setCookie("accessToken", newAccesToken, {
        req,
        res,
        maxAge: 60 * 6 * 24,
        httpOnly: true,
      });
    }

    response = await request();

    if (response.ok) {
      return await handleSuccessResponse(response);
    }

    data = await response.json();

    if (response.status === 401) {
      // hasClient ? Router.push("/login") : res.push(307, "login");
    }

    throw new ApiError(response.status, data.message);
  };

  return withAuth ? appAuthFetch() : appFetch();
};