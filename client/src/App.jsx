import SublyLogo from "./assets/logo.png";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <>
      <div>
        <p>welcome to subly</p>
        <Link to={"/auth/login"}>Login</Link>
        <Link to={"/auth/register"}>Register</Link>
        <Button className={"bg-blue-500 text-white"}>Click here</Button>
      </div>
    </>
  );
}

export default App;
