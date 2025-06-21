import { useState } from "react";
import videos from "../videos";
import VideoSection from "./video-section";

export default function VideoController() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [resetToMain, setResetToMain] = useState(false);
  const currentVideo = videos[currentVideoIndex];

  const handleVideoSelect = (index: number) => {
    setCurrentVideoIndex(index);
    setResetToMain(true);
    // Reset the flag after a short delay to allow the effect to run
    setTimeout(() => setResetToMain(false), 100);
  };

  return (
    <div className="flex flex-col px-4 gap-8">
      <div className="flex justify-start items-center gap-4 mt-4 overflow-x-auto">
        <img
          src="/don.png"
          alt="logo"
          className="w-14 h-14 rounded-full m-1 overflow-hidden ring-2 ring-red-500"
        />
        <VideoButtons
          currentVideoIndex={currentVideoIndex}
          handleVideoSelect={handleVideoSelect}
        />
      </div>

      <VideoSection video={currentVideo} resetToMain={resetToMain} />
      <div className="flex justify-center items-center gap-4">
        <VideoButtons
          currentVideoIndex={currentVideoIndex}
          handleVideoSelect={handleVideoSelect}
        />
      </div>
    </div>
  );
}

const VideoButtons = ({
  currentVideoIndex,
  handleVideoSelect,
}: {
  currentVideoIndex: number;
  handleVideoSelect: (index: number) => void;
}) => {
  return videos.map((video, index) => (
    <button
      key={video.id}
      onClick={() => handleVideoSelect(index)}
      className={`px-3 py-2 rounded-lg transition-all ${
        currentVideoIndex === index
          ? "bg-red-600 text-white"
          : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
      }`}
    >
      {video.title}
    </button>
  ));
};
