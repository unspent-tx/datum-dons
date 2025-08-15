export type Person = {
  name: string;
  image: string;
  github: string;
};
export const unspentTx: Person = {
  name: "unspentTx",
  image: "/unspent.png",
  github: "https://github.com/unspent-tx",
};

export const gZero: Person = {
  name: "gZero",
  image: "/gzero.png",
  github: "https://github.com/gulla0",
};

export const newman: Person = {
  name: "Newman",
  image: "/newman.png",
  github: "https://github.com/Newman5",
};

export const lewis: Person = {
  name: "Lewis",
  image: "/lewis.png",
  github: "https://github.com/lewis-nduati",
};

export const cyclonator: Person = {
  name: "Cyclonator",
  image: "/don.png",
  github: "https://github.com/Cyclonator",
};

export const peopleArray: Person[] = [
  unspentTx,
  gZero,
  newman,
  lewis,
  cyclonator,
];

export const people: Record<string, Person> = {
  unspentTx,
  gZero,
  newman,
  lewis,
  cyclonator,
};
