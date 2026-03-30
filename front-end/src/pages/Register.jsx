import { use, useState } from "react";

function Register() {
  const [state, setState] = useState("Welcome to the registration page! Please fill in your details to create an account.");

  function changeState() {
    setState("Thank you for registering! Your account has been created successfully.");
  }
  return (
    <>
    <p>{state}</p>
    <button onClick={changeState} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Register
    </button>
    </>
  )
}

export default Register