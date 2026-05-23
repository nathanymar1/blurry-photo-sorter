/*
  Results page to preview the sharp and blur images.
*/
import { useLocation } from "react-router-dom";
import { ImagesGrid } from "../components/ImagesGrid";
import { useState } from "react";

import "./Results.css";
import { DownloadIcon } from "../assets/DownloadIcon";
import type { Photo } from "../types/Photo";
import JSZip from "jszip";

const Results = () => {
  const { state } = useLocation();
  const [sharp, setSharp] = useState<Photo[]>(state?.sharp ?? []);
  const [blur, setBlur] = useState<Photo[]>(state?.blur ?? []);

  const switchLabel = (filename: string) => {
    const inSharp = sharp.find((i) => i.filename === filename);
    if (inSharp) {
      setSharp(sharp.filter((i) => i.filename !== filename));
      setBlur([...blur, inSharp]);
      inSharp.confidence = 0;
    } else {
      const inBlur = blur.find((i) => i.filename === filename);
      if (inBlur) {
        setBlur(blur.filter((i) => i.filename !== filename));
        setSharp([...sharp, inBlur]);
        inBlur.confidence = 0;
      }
    }
  };

  const handleDownload = async (images: Photo[]) => {
    if (!images || images.length === 0) return;

    const zip = new JSZip();

    for (const image of images) {
      const response = await fetch(image.url);
      const blob = await response.blob();
      zip.file(image.filename, blob);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(zipBlob);
    a.download = "images.zip";
    a.click();
  };

  if (!state) return <p className="no-results-yet">No results yet.</p>;

  return (
    <div className="results">
      <div className="results-grid-wrapper">
        <div className="results-header">
          <p className="results-label">Clear</p>
          <button
            className="download-btn"
            onClick={() => handleDownload(sharp)}
          >
            <DownloadIcon className="download-icon" />
          </button>
        </div>
        <ImagesGrid
          images={sharp}
          onDelete={(filename) =>
            setSharp(sharp.filter((i) => i.filename !== filename))
          }
          onSwitch={switchLabel}
        />
      </div>

      <div className="results-grid-wrapper">
        <div className="results-header">
          <p className="results-label">Blurry</p>
          <button className="download-btn" onClick={() => handleDownload(blur)}>
            <DownloadIcon className="download-icon" />
          </button>
        </div>
        <ImagesGrid
          images={blur}
          onDelete={(filename) =>
            setBlur(blur.filter((i) => i.filename !== filename))
          }
          onSwitch={switchLabel}
        />
      </div>
    </div>
  );
};

export default Results;
