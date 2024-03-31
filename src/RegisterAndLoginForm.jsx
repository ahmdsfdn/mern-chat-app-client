import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

export default function RegisterAndLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("register");
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

  async function handleSubmit(e) {
    e.preventDefault();
    const url = isLoginOrRegister === 'register' ? 'register' : 'login';

    const { data } = await axios.post(url, { username, password });
    setLoggedInUsername(username);
    setId(data.id);
  }

  return (
    <>
      <div className="bg-blue-50 h-screen flex items-center">
        <form className="w-64 mx-auto" onSubmit={handleSubmit}>
          <input
            value={username}
            onChange={(ev) => setUsername(ev.target.value)}
            type="text"
            placeholder="username"
            className="block rounded-sm p-2 mb-2 w-full"
          ></input>
          <input
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            type="password"
            className="block rounded-sm p-2 mb-2 w-full"
            placeholder="password "
          ></input>
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white block w-full rounded-sm"
          >
            {isLoginOrRegister === "register" ? "Register" : "Login"}
          </button>
          <div className="text-center mt-2">
            {isLoginOrRegister === "register" && (
              <div>
                Already a member?{" "}
                <button onClick={() => setIsLoginOrRegister("login")}>
                  Login here
                </button>
              </div>
            )}
            {isLoginOrRegister === "login" && (
              <div>
                Dont have an account?{" "}
                <button onClick={() => setIsLoginOrRegister("register")}>
                  Register
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
