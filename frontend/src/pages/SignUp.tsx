import Form from "../components/ui/signup-form";

export default function SignUp() {
  return (
    <div className="md:grid md:grid-cols-[60%_40%]  items-center">
      <div>
        <Form />
      </div>

      <div className="hidden md:block">
        <img src="img2.jpg" className="max-h-screen w-full"></img>
      </div>
    </div>
  );
}
