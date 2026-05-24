import "./Header.css";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface HeaderProps {
  images: File[];
  clearImages: () => void;
}

export const Header = ({ images, clearImages }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    try {
      const form = new FormData();
      images.forEach((file) => form.append("images", file));
      await fetch("http://34.228.188.242:3000/images/upload", {
        method: "POST",
        body: form
      });

      const response = await fetch(
        "http://34.228.188.242:3000/images/classify",
        {
          method: "POST"
        }
      );
      const data = await response.json();
      console.log("data:", data);
      console.log("data.body:", data.body);
      navigate("/results", { state: data.body });
    } catch (err) {
      console.error("Classification failed.", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="header">
      <h1
        className="header-title"
        onClick={async () => {
          try {
            await fetch("http://34.228.188.242:3000/images/", {
              method: "DELETE"
            });
            clearImages();
            navigate("/");
          } catch (err) {
            console.error("Delete images failed.", err);
          }
        }}
      >
        Blurry Photo Sorter
      </h1>
      {location.pathname === "/" && (
        <button
          className="run-btn"
          onClick={handleRun}
          disabled={images.length === 0 || loading}
        >
          {loading ? "Running..." : "Run"}
        </button>
      )}
    </header>
  );
};
