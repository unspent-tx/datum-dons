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
import { marketplacePt2 } from "./marketplace-pt2";
import { time } from "./time";
import { vesting } from "./vesting";
import { ds_nft } from "./ds_nft";
import { withdraw_zero_trick } from "./withdraw-zero-trick";

import { crowd_funding } from "./crowd-funding";
//export video objects
export {
  helloWorldPt1,
  helloWorldPt2,
  marketplacePt1,
  marketplacePt2,
  vesting,
  ds_nft,
  withdraw_zero_trick,
  time,
  crowd_funding,
};
// export video array
export const videos: Video[] = [
  helloWorldPt1,
  helloWorldPt2,
  marketplacePt1,
  marketplacePt2,
  vesting,
  ds_nft,
  withdraw_zero_trick,
  time,
  crowd_funding,
];
export default videos;
