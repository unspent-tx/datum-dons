import { Video } from "../videos";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface VideoPlayerProps {
  video: Video;
  resetToMain?: boolean;
}

export default function VideoPlayer({
  video,
  resetToMain = false,
}: VideoPlayerProps) {
  const [selectedVideoId, setSelectedVideoId] = useState(video.id);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentVideoRef = useRef(video.id);

  // Reset to main video when resetToMain changes
  useEffect(() => {
    if (resetToMain) {
      setSelectedVideoId(video.id);
    }
  }, [resetToMain, video.id]);

  // Define the sequence of videos
  const videoSequence = [video.id, ...video.shorts];

  const getNextVideo = (currentId: string) => {
    const currentIndex = videoSequence.indexOf(currentId);
    if (currentIndex === -1) return video.id; // Fallback to main video if not found
    const nextIndex = (currentIndex + 1) % videoSequence.length;
    return videoSequence[nextIndex];
  };

  // Update current video ref when selectedVideoId changes
  useEffect(() => {
    currentVideoRef.current = selectedVideoId;
  }, [selectedVideoId]);

  // Initialize YouTube Player
  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      if (containerRef.current) {
        playerRef.current = new window.YT.Player(containerRef.current, {
          height: "100%",
          width: "100%",
          videoId: selectedVideoId,
          playerVars: {
            // Core functionality
            autoplay: 1,
            controls: 1,
            mute: 1,
            playsinline: 1,

            // Disable features that might cause issues
            rel: 0, // Disable related videos
            modestbranding: 1, // Minimal YouTube branding
            iv_load_policy: 3, // Hide video annotations
            fs: 1, // Allow fullscreen
            enablejsapi: 1, // Enable JS API

            // Disable tracking and analytics
            cc_load_policy: 0, // Disable closed captions
            disablekb: 0, // Allow keyboard controls
            showinfo: 0, // Hide video info
            logging: 0, // Disable logging
            loglevel: "error", // Only show errors

            // Origin and referrer
            origin: typeof window !== "undefined" ? window.location.origin : "",
            widget_referrer:
              typeof window !== "undefined" ? window.location.href : "",

            // Additional restrictions
            hl: "en", // Force English
            cc_lang_pref: "en", // Force English captions
            host: "https://www.youtube.com", // Force HTTPS
            allow:
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", // Minimal permissions
          },
          events: {
            onReady: (event: any) => {
              try {
                // Set a timeout to ensure the player is fully initialized
                setTimeout(() => {
                  try {
                    event.target.playVideo();
                  } catch (error) {
                    console.warn("Could not autoplay video:", error);
                    // Try to recover by reloading the player
                    if (playerRef.current && playerRef.current.loadVideoById) {
                      playerRef.current.loadVideoById(selectedVideoId);
                    }
                  }
                }, 1000);
              } catch (error) {
                console.error("Error in onReady handler:", error);
              }
            },
            onStateChange: (event: any) => {
              try {
                if (event.data === window.YT.PlayerState.ENDED) {
                  const nextVideo = getNextVideo(currentVideoRef.current);
                  console.log("Video ended, moving to next:", nextVideo);
                  setSelectedVideoId(nextVideo);
                } else if (event.data === window.YT.PlayerState.PLAYING) {
                  console.log("Video started playing");
                } else if (event.data === window.YT.PlayerState.PAUSED) {
                  console.log("Video paused");
                } else if (event.data === window.YT.PlayerState.BUFFERING) {
                  console.log("Video buffering");
                }
              } catch (error) {
                console.warn("Error in state change handler:", error);
              }
            },
            onError: (event: any) => {
              console.warn("YouTube player error:", event.data);
              // Try to recover based on error type
              try {
                switch (event.data) {
                  case 2: // Invalid video ID
                  case 5: // HTML5 player error
                  case 100: // Video not found
                  case 101: // Video not embeddable
                  case 150: // Video not embeddable
                    const nextVideo = getNextVideo(currentVideoRef.current);
                    console.log(
                      "Recovering from error by moving to next video:",
                      nextVideo
                    );
                    setSelectedVideoId(nextVideo);
                    break;
                  default:
                    // For other errors, try reloading the current video
                    if (playerRef.current && playerRef.current.loadVideoById) {
                      console.log("Attempting to reload current video");
                      playerRef.current.loadVideoById(selectedVideoId);
                    }
                }
              } catch (error) {
                console.error("Failed to recover from player error:", error);
              }
            },
          },
        });
      }
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  // Update video when selectedVideoId changes
  useEffect(() => {
    if (playerRef.current && playerRef.current.loadVideoById) {
      playerRef.current.loadVideoById({
        videoId: selectedVideoId,
        startSeconds: 0,
        suggestedQuality: "default",
      });
      setTimeout(() => {
        playerRef.current?.playVideo();
      }, 100);
    }
  }, [selectedVideoId]);

  return (
    <div className="bg-neutral-600 border-8 rounded-xl overflow-hidden border-red-500 flex flex-col items-center justify-center font-sans  h-full overflow-y-auto">
      <div className="w-full">
        <GridItem className="w-full aspect-video">
          <div ref={containerRef} className="w-full h-full" />
        </GridItem>
      </div>
      <div className="flex flex-wrap pt-4 gap-2 justify-center w-full bg-red-500">
        <button
          onClick={() => setSelectedVideoId(video.id)}
          className={`px-4 text-xl font-bold py-2 rounded-lg transition-all ${
            selectedVideoId === video.id
              ? "bg-red-600 text-black"
              : "bg-red-500 text-black hover:bg-red-400"
          }`}
        >
          {video.title}
        </button>
        {video.shorts.map((short, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedVideoId(short)}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedVideoId === short
                ? "bg-red-600 text-black"
                : "bg-red-500 text-black hover:bg-red-400"
            }`}
          >
            Short {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

const GridItem = ({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <div style={style} className={`bg-red-500 ${className}`}>
      {children}
    </div>
  );
};
