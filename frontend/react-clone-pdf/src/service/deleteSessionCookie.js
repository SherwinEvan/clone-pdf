import axios from "axios";
import { deleteRememberMePreference } from "./rememberMe";

export default function DeleteSessionCookie() {
     deleteRememberMePreference();
    
    axios.get("/logout/").then(res => {
        console.log(res.data)
    })
}