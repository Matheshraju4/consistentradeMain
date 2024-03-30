import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";

import { AutoCompoundingCal } from "./routes/AutocompundingCal";
import { Dashboard } from "./routes/Dashboard";

import { CardWithForm } from "./components/ui/Maincard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Signin } from "./routes/Signin";
import { Signup } from "./routes/Signup";

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          {/* <CardWithForm />
          <InputDemo />; */}
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/createtrade" element={<CardWithForm />} />
            <Route path="/autocompundingcal" element={<AutoCompoundingCal />} />
            <Route
              path="/signin"
              element={
                localStorage.getItem("token") ? <Dashboard /> : <Signin />
              }
            />
            <Route
              path="/signup"
              element={
                localStorage.getItem("token") ? <Dashboard /> : <Signup />
              }
            />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
