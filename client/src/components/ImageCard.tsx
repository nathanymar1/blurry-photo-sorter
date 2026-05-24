/*
  An individual image component.
*/

import { useState } from "react";
import { XIcon } from "../assets/XIcon";
import "./ImageCard.css";
import { SwitchIcon } from "../assets/SwitchIcon";

interface ImageCardProps {
  url: string;
  filename: string;
  confidence?: number;
  onDelete: (filename: string) => void;
  onSwitch?: (filename: string) => void;
}

export const ImageCard = ({
  url,
  filename,
  confidence,
  onDelete,
  onSwitch
}: ImageCardProps) => {
  const [hover, setHover] = useState(false);

  const handleDelete = async () => {
    onDelete(filename);
    try {
      await fetch(`http://34.228.188.242:3000/images/${filename}`, {
        method: "DELETE"
      });
    } catch (err) {
      console.error("Delete fetch failed:", err);
    }
  };

  const handleSwitch = () => {
    if (onSwitch) onSwitch(filename);
  };

  return (
    <div
      className="img-card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="img-wrapper">
        <img className="img" src={url} />
        {hover && (
          <div className="img-overlay">
            <button className="switch-btn" onClick={handleSwitch}>
              <SwitchIcon className="switch-icon" />
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              <XIcon className="x-icon" />
            </button>
            {confidence !== 0 && <p>{confidence}</p>}
          </div>
        )}
      </div>
      <p>{filename}</p>
    </div>
  );
};
