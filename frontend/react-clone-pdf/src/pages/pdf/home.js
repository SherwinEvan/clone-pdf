import axios from "axios";
import { useState } from "react";
import NavBar from "../../components/navbar";
import Footer from "../../components/footer";
import useRememberMe from "../../service/rememberMe";

export default function HomePage() {
  useRememberMe();

  const [currUser, setCurrUser] = useState("Guest");

  axios
    .get("login/")
    .then((res) => {
      console.log(res.data);
      setCurrUser(res.data);
    })
    .catch((error) => {
      console.log(error.data);
    });

  return (
    <div class="flex flex-col h-screen justify-between">
      <NavBar />
      <div className="mb-auto">{currUser}</div>
      <Footer />
    </div>
  );
}
