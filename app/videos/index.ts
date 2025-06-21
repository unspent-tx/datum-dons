export type Video = {
  index: number;
  id: string;
  title: string;
  url: string;
  shorts: string[];
  code: string;
  participants: {
    don: Person;
    capos: Person[];
  };
};

import { Person } from "../people/people";
// import video object
import { helloWorldPt1 } from "./hello-world-pt1";
import { helloWorldPt2 } from "./hello-world-pt2";
import { marketplacePt1 } from "./marketplace-pt1";
//export video objects
export { helloWorldPt1, helloWorldPt2, marketplacePt1 };
// export video array
export const videos: Video[] = [helloWorldPt1, helloWorldPt2, marketplacePt1];
export default videos;
