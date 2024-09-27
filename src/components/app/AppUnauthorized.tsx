import { JSX } from "react";

/**
 * @function AppUnauthorized
 * @description The unauthorized app component
 * @returns {JSX.Element} JSX.Element
 */
function AppUnauthorized(): JSX.Element {
  return (
    <div className="App w-full h-screen bg-black text-white">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome to Chat App</h1>
            <p className="text-sm mb-4">Please login to continue</p>
            <a href="/login" className="bg-blue-500 text-white px-4 py-2 rounded">Login</a>
          </div>
        </div>
      </div>
  );
}

export default AppUnauthorized;