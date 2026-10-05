export const normalizeLoginResponse = (response) => {
  const data = response?.data || response;

  return {
    token:
      data?.token ||
      data?.access_token ||
      data?.accessToken ||
      null,

    user:
      data?.user ||
      data?.employee ||
      null,

    raw: response,
  };
};