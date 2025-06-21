import { Video } from "../videos";
import VideoPlayer from "./video-player";
import CodeBlock from "./code-block";

interface VideoSectionProps {
  video: Video;
  language?: string;
}

export default function VideoSection({
  video,
  language = "aiken",
}: VideoSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <VideoPlayer video={video} />
      <CodeBlock code={video.code} language={language} />
    </div>
  );
}
