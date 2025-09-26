const Mascot = ({ mascotUrl, squadName }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-700 rounded-3xl p-6 flex flex-col items-center text-center">
      <div className="w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden mb-4">
        <img
          src={mascotUrl}
          alt="Squad mascot"
          className="w-24 h-24 object-contain drop-shadow-lg"
        />
      </div>
      <h3 className="text-xl font-semibold">Талисман отряда</h3>
      <p className="text-sm text-slate-300 mt-2">
        {squadName || "Ваша команда"}
      </p>
    </div>
  );
};

export default Mascot;
