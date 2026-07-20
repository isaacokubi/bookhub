import RegisterForm from "../components/auth/RegisterForm";

export default function Register() {
  return (
    <div
      className="
container
mx-auto
max-w-md
py-10
"
    >
      <h1
        className="
text-3xl
font-bold
mb-6
"
      >
        Create Account
      </h1>

      <RegisterForm />
    </div>
  );
}
