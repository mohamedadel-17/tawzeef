import Link from "next/link";

export default async function Page() {

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Hello In Landing Page</h1>
      <Link href={"/login"}>
        <button className="bg-blue-500 text-white py-2 px-4 rounded">
          Go to Login
        </button>
      </Link>
      <Link href={"/signup"}>
        <button className="bg-green-500 text-white py-2 px-4 rounded ml-4">
          Go to Signup
        </button>
      </Link>
    </div>
  );
}