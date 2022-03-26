import axios from "axios";
import { useAppDispatch } from "../store/hooks";
import { setMessage } from "../store/slices/messageSlice";
import { store } from "../store/store";

const apiClient = axios.create();
apiClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    console.log(error.response.data);
    store.dispatch(setMessage(error.response.data.message));

    return Promise.reject(error);
  }
);

export default apiClient;
