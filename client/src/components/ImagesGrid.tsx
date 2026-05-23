/*
  A component organizing image cards into a grid.
*/
import { ImageCard } from "./ImageCard";
import type { Photo } from "../types/Photo";

import "./ImagesGrid.css";

interface ImagesGridProps {
  images: Photo[];
  onDelete: (filename: string) => void;
  onSwitch?: (filename: string) => void;
}

export const ImagesGrid = ({ images, onDelete, onSwitch }: ImagesGridProps) => {
  return (
    <div className="images-grid">
      {images.map((image) => (
        <ImageCard
          url={image.url}
          key={image.filename}
          filename={image.filename}
          confidence={image.confidence}
          onDelete={() => onDelete(image.filename)}
          onSwitch={onSwitch ? () => onSwitch(image.filename) : undefined}
        />
      ))}
    </div>
  );
};
