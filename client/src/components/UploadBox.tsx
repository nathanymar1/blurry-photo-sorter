/*
  The drop box to upload images to be classified.
*/

import "./UploadBox.css";
import { ImageIcon } from "../assets/ImageIcon";

interface UploadBoxProps {
  setImages: (images: File[]) => void;
  setUploaded: (uploaded: boolean) => void;
}

export const UploadBox = ({ setImages, setUploaded }: UploadBoxProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("drag-over");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    setImages(files);
    setUploaded(true);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    setUploaded(true);
  };

  return (
    <>
      <div
        className="dropzone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <ImageIcon className="drop-icon" />
        <p className="drop-title">Drop photos here</p>
        <p className="drop-sub">
          or <span className="drop-link">Select photos</span>
        </p>
        <input
          type="file"
          id="file-input"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleSelect}
        />
      </div>
    </>
  );
};
