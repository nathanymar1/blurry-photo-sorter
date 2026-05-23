import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import Home from "./pages/Home";
import Results from "./pages/Results";
import "./App.css";

const App = () => {
  const [images, setImages] = useState<File[]>([]);

  return (
    <BrowserRouter>
      <Header images={images} clearImages={() => setImages([])} />
      <Routes>
        <Route
          path="/"
          element={<Home images={images} setImages={setImages} />}
        />
        <Route path="/results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
