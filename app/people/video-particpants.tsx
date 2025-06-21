import { people, Person } from "./people";

type VideoParticpantsProps = {
  participants: {
    don: Person;
    capos: Person[];
  };
};

export default function VideoParticpants({
  participants,
}: VideoParticpantsProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div key={participants.don.name}>
        <img
          className="w-16 h-16 rounded-full"
          src={participants.don.image}
          alt={participants.don.name}
        />
      </div>
      {participants.capos.map((person) => (
        <div key={person.name}>
          <img
            className="w-10 h-10 rounded-full"
            src={person.image}
            alt={person.name}
          />
        </div>
      ))}
    </div>
  );
}
