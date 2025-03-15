import React from "react";

function AuthLayout({ title, children }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/background.webp')" }}
    >
      <div className="bg-white bg-opacity-90 p-10 shadow-2xl rounded-lg w-96 backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;