import jwtDecode from "jwt-decode";
import { getCookies, setCookie } from "cookies-next";
import type { IncomingMessage, ServerResponse } from "http";

export const getNewAccesToken = async (
  req: IncomingMessage,
  res?: any
): Promise<any> => {
  const headers = {
    ...(!!req.headers.cookie && { Cookie: req.headers.cookie }),
  };

  const respose = await fetch(
    `${process.env.NEXT_PUBLIC_API_PATH}/access-token`,
    {
      headers,
    }
  );

  if (respose.ok) {
    const data = await respose.json();
    return data;
  }

  return null;
};

interface Decoded {
  adminId: string;
  iat: number;
  exp: number;
}

export const getSession = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<Decoded | null> => {
  const { accessToken, refreshToken } = getCookies({ req, res });

  if (!accessToken && !refreshToken) {
    return null;
  }

  if (!!accessToken) {
    const decoded: Decoded = jwtDecode(accessToken);

    if (decoded.exp > Date.now() / 1000) {
      return jwtDecode(accessToken);
    }
  }
  if (
    !!refreshToken &&
    (jwtDecode(refreshToken) as Decoded).exp > Date.now() / 1000
  ) {
    const newAccesToken = await getNewAccesToken(req, res);

    if (!newAccesToken) {
      return null;
    }

    setCookie("accessToken", newAccesToken, {
      req,
      res,
      maxAge: 60 * 6 * 24,
      httpOnly: true,
    });

    return jwtDecode(newAccesToken);
  }

  return null;
};
