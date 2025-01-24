import { LoginForm } from "@/components/LoginForm";

export const metadata = {
  title: "Login",
  robots: {
    index: false,
    follow: false,
  }
}

export default function page() {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <LoginForm />
    </div>
  );
}
