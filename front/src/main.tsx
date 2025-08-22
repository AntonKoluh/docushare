import "./index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Toaster } from "./components/ui/sonner.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.tsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <GoogleOAuthProvider clientId="41461536841-9gb417n1meov5fvcih5hqiq0qeqjuatk.apps.googleusercontent.com">
    <BrowserRouter>
      <Toaster
        position="top-center"
        duration={3000}
        toastOptions={{
          unstyled: true,
          classNames: {
            toast:
              "bg-gray-400 text-black text-xl px-4 py-3 rounded-md shadow-lg",
            description: "text-gray-300 text-xs",
            actionButton: "bg-white text-black",
          },
        }}
      />
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
);
