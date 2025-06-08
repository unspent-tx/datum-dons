import { Video } from "../videos";
import VideoPlayer from "./video-player";
import CodeBlock from "./code-block";

interface VideoSectionProps {
  video: Video;
  language?: string;
  resetToMain?: boolean;
}

export default function VideoSection({
  video,
  language = "aiken",
  resetToMain = false,
}: VideoSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <VideoPlayer video={video} resetToMain={resetToMain} />
      <CodeBlock code={video.code} language={language} />
    </div>
  );
}
