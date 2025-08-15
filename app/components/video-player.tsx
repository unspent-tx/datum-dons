import VideoParticpants from "../people/video-particpants";
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
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const [selectedVideoId, setSelectedVideoId] = useState(video.id);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentVideoRef = useRef(video.id);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Reset to main video when video prop changes (handles section switching)
  useEffect(() => {
    setSelectedVideoId(video.id);
    setIsPlayerReady(false);
    setIsLoading(true);
  }, [video.id]);

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
    let isMounted = true;
    let loadingTimeout: NodeJS.Timeout;

    const createPlayer = () => {
      if (!containerRef.current || !isMounted) return;

      clearTimeout(loadingTimeout);

      playerRef.current = new window.YT.Player(containerRef.current, {
        height: "100%",
        width: "100%",
        videoId: selectedVideoId,
        playerVars: {
          // Core functionality
          autoplay: 0, // Disable autoplay in playerVars to control it manually
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
              console.log("YouTube player ready for video:", selectedVideoId);
              setIsPlayerReady(true);
              setIsLoading(false);
              // Start playing the initial video
              event.target.playVideo();

              // Unmute after 3 seconds
              setTimeout(() => {
                try {
                  if (event.target && event.target.unMute) {
                    console.log("Unmuting video after delay");
                    event.target.unMute();
                  }
                } catch (error) {
                  console.warn("Failed to unmute video:", error);
                }
              }, 1500);
            } catch (error) {
              console.error("Error in onReady handler:", error);
              setIsLoading(false);
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
            setIsLoading(false);
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
    };

    const initializePlayer = () => {
      if (!containerRef.current || !isMounted) return;

      // Only create a new player if one doesn't exist
      if (!playerRef.current) {
        // Set a timeout to prevent infinite loading
        loadingTimeout = setTimeout(() => {
          if (isMounted && isLoading) {
            console.warn("Player loading timeout, forcing ready state");
            setIsLoading(false);
          }
        }, 10000); // 10 second timeout

        // Check if YouTube API is already loaded
        if (window.YT && window.YT.Player) {
          createPlayer();
        } else {
          // Load YouTube API if not already loaded
          const tag = document.createElement("script");
          tag.src = "https://www.youtube.com/iframe_api";
          const firstScriptTag = document.getElementsByTagName("script")[0];
          firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

          window.onYouTubeIframeAPIReady = () => {
            if (isMounted && containerRef.current) {
              createPlayer();
            }
          };
        }
      }
    };

    initializePlayer();

    return () => {
      isMounted = false;
      clearTimeout(loadingTimeout);
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.warn("Error destroying player on cleanup:", error);
        }
        playerRef.current = null;
      }
    };
  }, [video.id]);

  // Update video when selectedVideoId changes (only if player is ready)
  useEffect(() => {
    if (playerRef.current && playerRef.current.loadVideoById && isPlayerReady) {
      console.log("Loading new video:", selectedVideoId);
      playerRef.current.loadVideoById({
        videoId: selectedVideoId,
        startSeconds: 0,
        suggestedQuality: "default",
      });
      // Start playing the new video
      playerRef.current.playVideo();
    }
  }, [selectedVideoId, isPlayerReady]);

  return (
    <>
      <div
        ref={videoContainerRef}
        className="bg-neutral-600 border-8 rounded-xl overflow-hidden border-red-500 flex flex-col items-center justify-center font-sans  h-full overflow-y-auto"
      >
        {" "}
        <div className="pointer-events-none hidden sm:flex absolute z-50 p-5 px-6 gap-2 justify-end w-full ">
          {/* Video participants */}
          <VideoParticpants participants={video.participants} />
        </div>
        <div className="w-full relative">
          <GridItem className="w-full aspect-video relative z-10">
            <div
              ref={containerRef}
              style={{
                position: "relative",
                height: "100%",
                width: "100%",
                zIndex: 10,
              }}
            />
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
    </>
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
