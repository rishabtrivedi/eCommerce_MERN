import { useCookies } from "react-cookie";

export const useGetToken = () => {
  const [cookies, _] = useCookies(["access_token"]); // Get the access_token from the cookies

  return {
    headers: { authorization: cookies.access_token }, // Return the token in the headers object
  };

};