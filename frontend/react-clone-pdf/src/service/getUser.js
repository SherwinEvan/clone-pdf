import axios from "axios";

export default async function GetUser() {
  try {
    const response = await axios.get("login/");
    console.log(response.data);
    if (response.data === "anonymousUser") {
      return "Guest";
    } else {
      return response.data;
    }
  } catch (error) {
    console.log(error);
    return "Error";
  }
}
