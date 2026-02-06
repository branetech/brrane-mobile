import axios from "axios";

export const getNewAccessToken = async ({ url, refreshToken }: { refreshToken: any, url: string }): Promise<string | null> => {
  try {
    const response = await axios.post(url, { refreshToken });
    const accessToken = response?.data;
    return accessToken || null;
  } catch (error) {
    // eslint-disable-next-line no-console
    // console.error("Error fetching access token:", error);
    return null;
  }
};
