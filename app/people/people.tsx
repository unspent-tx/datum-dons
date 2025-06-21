export type Person = {
  name: string;
  image: string;
};
export const unspentTx: Person = {
  name: "unspentTx",
  image: "/unspent.png",
};

export const gZero: Person = {
  name: "gZero",
  image: "/gzero.png",
};

export const newman: Person = {
  name: "Newman",
  image: "/newman.png",
};

export const lewis: Person = {
  name: "Lewis",
  image: "/lewis.png",
};

export const peopleArray: Person[] = [unspentTx, gZero, newman, lewis];

export const people: Record<string, Person> = {
  unspentTx,
  gZero,
  newman,
  lewis,
};
