import Cookies from "js-cookie";

const ACCESS_TOKEN = "access_token";

export const postRequest = async (url: string, body: any) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
    credentials: "include",
    body,
  });

  const data = await response.json();

  if (!response.ok) {
    let msg: string;

    if (data?.msg) {
      msg = data.msg;
    } else {
      msg = data;
    }

    return { err: true, msg };
  }

  return data;
};

export const getRequest = async (url: string) => {
  const cookie = Cookies.get(ACCESS_TOKEN);

  if (!cookie) return { err: true, msg: "No cookie found" };

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      Cookie: cookie,
    },
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    let msg: string;

    if (data?.msg) {
      msg = data.msg;
    } else {
      msg = data;
    }

    return { err: true, msg };
  }

  return data;
};
