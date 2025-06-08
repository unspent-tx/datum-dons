import Client from "./client";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900 ">
      <Client />
      <div className="p-20 gap-4 flex flex-wrap items-baseline space-y-4">
        <img
          src="/don.png"
          alt="logo"
          className="w-40 ring-4 !mb-10 ring-red-500 h-40 rounded-full"
        />
        <div>
          <h1 className="text-7xl  uppercase font-bold text-red-500">
            Datum Dons
          </h1>
          <h2 className="text-3xl font-slab uppercase font-bold text-lime-300">
            A Gimbalabs project
          </h2>
        </div>
        <div className="text-red-300 space-y-4 max-w-lg">
          {/* TODO change to real description */}
          <p>
            We started bootlegging Aiken Validators during the prohibition...
            Back when the Cardano streets were mean and the validators were
            scarce. Gimbalabs incubated us.
          </p>
          <p>
            The Dons ran the underground validator circuit, smuggling code
            through the back channels of the blockchain. "The Capo" - that's
            what they called us. We were the ones who could read you a hot
            validator when nobody else could.
          </p>
        </div>
      </div>
    </main>
  );
}
