import { SignIn } from "@clerk/clerk-react"

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center h-150 sm:h-[calc(100vh-80px)]"><SignIn signUpUrl="/register" /></div>
  )
}

export default LoginPage