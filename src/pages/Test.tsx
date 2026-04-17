import { useLogin } from "../hooks/Auth";
import type { AuthResponse } from "../models/Auth";
import type { ErrorModel } from "../models/Error";
import { useAppStore } from "../store/useAppStore";

const Test = () => {
  const setAuth = useAppStore((state) => state.setAuth);
  const onSuccess = ({ data }: AuthResponse) => {
    setAuth(data.user, {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
  };

  const onError = (error: ErrorModel) => {
    console.log("====================================");
    console.log("error", error);
    console.log("====================================");
  };
  const { mutate } = useLogin(onSuccess, onError);

  const handleClick = () => {
    const payload = {
      email: "ayush@Test.com",
      password: "password123",
    };
    mutate(payload);
  };
  return (
    <div>
      <div>Home</div>
      <button onClick={handleClick}>test</button>
    </div>
  );
};

export default Test;
