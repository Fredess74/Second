const MemberList = ({ members }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-700 rounded-3xl p-6">
      <h3 className="text-xl font-semibold mb-4">Участники отряда</h3>
      {members.length === 0 ? (
        <p className="text-sm text-slate-400 bg-slate-950/60 border border-dashed border-slate-800 rounded-2xl px-4 py-6 text-center">
          Пока только вы в отряде — пригласите друзей по ссылке!
        </p>
      ) : (
        <ul className="space-y-3">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex items-center justify-between bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3"
            >
              <div>
                <p className="font-medium">{member.displayName || member.email}</p>
                <p className="text-xs text-slate-400">{member.email}</p>
              </div>
              <span className="text-xs uppercase tracking-wider text-slate-500">
                участник
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MemberList;
