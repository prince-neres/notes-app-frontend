import axios from "axios";
import { store } from "../redux/store";

const ax = axios.create({
  baseURL: "https://notes-app-backend-2djt.onrender.com/api/",
  withCredentials: true,
});

export async function GetData(url) {
  const auth = store.getState().auth_reducers;
  const token = auth && auth.accessToken;

  try {
    const response = await ax.get(url, {
      headers: {
        "Content-type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response;
  } catch (error) {
    const { response } = error;
    throw response;
  }
}

export async function PostData(url, body) {
  const auth = store.getState().auth_reducers;
  const token = auth && auth.accessToken;
  try {
    const response = await ax.post(url, body, {
      headers: {
        "Content-type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response;
  } catch (error) {
    const { response } = error;
    throw response;
  }
}
