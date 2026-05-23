/*
  Home Page to drag and drop OR click upload photos to be classified.
*/
import { useState } from "react";
import { ImagesGrid } from "../components/ImagesGrid";
import { UploadBox } from "../components/UploadBox";

import "./Home.css";

interface HomeProps {
  images: File[];
  setImages: (images: File[]) => void;
}

const Home = ({ images, setImages }: HomeProps) => {
  console.log(images);
  const [uploaded, setUploaded] = useState(false);

  const previewImages = images.map((file) => ({
    url: URL.createObjectURL(file),
    filename: file.name,
    label: -1,
    confidence: 0
  }));

  if (uploaded && images.length === 0) setUploaded(false);

  return (
    <div className="home">
      {uploaded ? (
        <ImagesGrid
          images={previewImages}
          onDelete={(filename) =>
            setImages(images.filter((f) => f.name !== filename))
          }
        />
      ) : (
        <UploadBox setImages={setImages} setUploaded={setUploaded} />
      )}
    </div>
  );
};

export default Home;
