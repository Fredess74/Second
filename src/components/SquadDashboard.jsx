import InviteButton from "./InviteButton";
import Mascot from "./Mascot";
import MemberList from "./MemberList";
import SharedGoal from "./SharedGoal";
import ShoppingList from "./ShoppingList";

const SquadDashboard = ({
  squad,
  members,
  shareLink,
  onLogout,
  onOpenReceiptModal,
  onAddShoppingItem,
  onToggleShoppingItem,
}) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{squad.squadName}</h1>
            <p className="text-slate-300">Командный центр Fetch Squads</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onOpenReceiptModal}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-semibold"
            >
              Отсканировать общий чек
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
            >
              Выйти
            </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SharedGoal totalPoints={squad.totalPoints} goal={squad.goal} />
            <ShoppingList
              items={squad.shoppingList || []}
              onAddItem={onAddShoppingItem}
              onToggleItem={onToggleShoppingItem}
            />
          </div>
          <div className="space-y-6">
            <Mascot mascotUrl={squad.mascotUrl} squadName={squad.squadName} />
            <InviteButton link={shareLink} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <MemberList members={members} />
          <div className="bg-slate-900/60 border border-slate-700 rounded-3xl p-6">
            <h3 className="text-xl font-semibold mb-2">Командный квест</h3>
            <p className="text-sm text-slate-300">
              За выходные отсканируйте 3 чека из разных ресторанов. Каждая команда,
              выполнившая задание, получает бонусные 1000 очков!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SquadDashboard;
