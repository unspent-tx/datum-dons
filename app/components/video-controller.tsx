import { useState, useCallback } from "react";
import videos from "../videos";
import VideoSection from "./video-section";
import { backgroundVisibleAtom } from "../store/atoms";
import { useSetAtom } from "jotai";

export default function VideoController() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const currentVideo = videos[currentVideoIndex];
  const setShowBackground = useSetAtom(backgroundVisibleAtom);

  const handleVideoSelect = useCallback((index: number) => {
    setShowBackground(true);
    setTimeout(() => {
      setCurrentVideoIndex(index);
    }, 600);
  }, []);

  return (
    <>
      <div className="flex justify-start items-center gap-4  py-2 px-2 z-[60]  shadow-lg shadow-red-500/50  overflow-x-auto sticky top-0 bg-neutral-900 ">
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
      <div className="px-1">
        <VideoSection video={currentVideo} />
      </div>
    </>
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
      {video.index}:
      <span
        className={`text-xs ml-2 ${
          currentVideoIndex === index ? " text-white" : " text-neutral-300"
        }`}
      >
        {video.title}
      </span>
    </button>
  ));
};
