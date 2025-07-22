import { Route, Routes } from "react-router";
import Home from "./routes/home";
import AuthCallback from "./auth/callback/AuthCallback";
import FileListRoute from "./routes/editDoc";
import Settings from "./routes/settings";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="auth/callback" element={<AuthCallback />} />
        <Route path="edit/:id?" element={<FileListRoute />} />
        <Route path="profile/" element={<Settings />} />
      </Routes>
    </>
  );
}
