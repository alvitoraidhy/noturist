import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import axios from "axios";

import type { Dispatch, SetStateAction } from "react";
import type { AxiosError } from "axios";
import type { NextPage } from "next";

type Props = {
  setToken: Dispatch<SetStateAction<string>>;
};

const HomeForm: NextPage<Props> = ({ setToken }) => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setLoadingStatus] = useState(false);

  const loginCallback = useCallback(async () => {
    setLoadingStatus(true);
    toast.loading("Logging in...", { id: "login" });

    try {
      type Response = { token: string };

      const resp = await axios.post<Response>(
        `${process.env.API_URL}/auth/login`,
        { username, password }
      );

      setToken(resp.data.token);
      toast.success("Successfully logged in. Welcome back!", { id: "login" });
      router.push("/dashboard");
    } catch (err: unknown | AxiosError) {
      let message = "";

      if (axios.isAxiosError(err) && err.response) {
        switch (err.response.status) {
          case 422:
            message = err.response.data.validation.body.message;
            break;

          case 400:
            message = "wrong username or password";
            break;

          default:
            message = "unknown error";
        }
      } else {
        message = "unknown error";
      }

      toast.error(`Login failed: ${message}`, { id: "login" });
    } finally {
      setLoadingStatus(false);
    }
  }, [username, password]);

  const registerCallback = useCallback(async () => {
    setLoadingStatus(true);
    toast.loading("Registering...", { id: "register" });

    try {
      type Response = { token: string };

      const resp = await axios.post<Response>(
        `${process.env.API_URL}/auth/register`,
        {
          username,
          password,
        }
      );

      setToken(resp.data.token);
      toast.success("Successfully registered!", { id: "register" });
      router.push("/dashboard");
    } catch (err: unknown | AxiosError) {
      let message = "";

      if (axios.isAxiosError(err) && err.response) {
        switch (err.response.status) {
          case 422:
            message = err.response.data.validation.body.message;
            break;

          case 409:
            message = "a user with the same username already exists";
            break;

          default:
            message = "unknown error";
        }
      } else {
        message = "unknown error";
      }

      toast.error(`Register failed: ${message}`, { id: "register" });
    } finally {
      setLoadingStatus(false);
    }
  }, [username, password]);

  return (
    <form action="">
      <div className="mb-3">
        <label htmlFor="username" className="form-label fw-bold">
          Username
        </label>
        <input
          type="text"
          className="form-control"
          id="username"
          placeholder="johndoe"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          disabled={isLoading}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label fw-bold">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="********"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          disabled={isLoading}
        />
      </div>
      <div className="mt-4">
        <button
          type="button"
          className="btn btn-primary me-3"
          onClick={loginCallback}
          disabled={isLoading}
        >
          Login
        </button>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={registerCallback}
          disabled={isLoading}
        >
          Register
        </button>
      </div>
    </form>
  );
};

export default HomeForm;
