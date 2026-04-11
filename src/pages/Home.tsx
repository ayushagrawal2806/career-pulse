import { useLogin } from "../hooks/Auth";
import type { AuthResponse } from "../models/Auth";
import type { ErrorModel } from "../models/Error";

const Home = () => {
  const onSuccess = (data: AuthResponse) => {
    console.log("====================================");
    console.log("data", data);
    console.log("====================================");
  };

  const onError = (error: ErrorModel) => {
    console.log("====================================");
    console.log("error", error);
    console.log("====================================");
  };
  const { mutate } = useLogin(onSuccess, onError);

  const handleClick = () => {
    const obj = {
      email: "ayush@Test.com",
      password: "password123",
    };
    mutate(obj);
  };
  return (
    <div>
      <div>Home</div>
      <button onClick={handleClick}>test</button>
    </div>
  );
};

export default Home;
