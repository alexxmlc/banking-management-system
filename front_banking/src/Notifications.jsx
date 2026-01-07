import {useState} from 'react';
import {useEffect} from 'react';
import { getMyNotifications, getUnreadCount,markNotificationAsRead ,markAllNotificationsAsRead } from './services/authService';

function Notifications() {
    //STATE-URI
    const [items, setItems] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    //pentru mark read
    const[actionLoading, setActionLoading] = useState(false);


    //FUNCTII

    //FUNCTIE PENTRU LOAD
    //face fetch list si unread count in paralel
    async function loadNotifications(){
        setLoading(true);
        setError("");

        try{
            const [list, unread] = await Promise.all([
                //functii din authService.js unde se face fetch la backend
                getMyNotifications(),
                getUnreadCount(),
            ]);

            //sortez notificarile dupa data aparitiei (latest first)
            const safeList = Array.isArray(list) ? list : [];
            const sorted = [...safeList].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setItems(sorted);

            setUnreadCount(unread?.count ?? 0);

        }catch(e){
            setError(e?.message || "Failed to load notifications.");
        }finally{
            setLoading(false);
        }
    }

    //FUNCTIE PENTRU MARCARE READ PE O NOTIFICARE
    async function handleMarkRead(id){
        setActionLoading(true);
        setError("");

        try{
            const res = await markNotificationAsRead(id); //asta scoate ceva gen {count : number}
            setUnreadCount(res?.count ?? 0);

            //actualizez lista de notificari
            setItems((prevItems) => 
            prevItems.map((n) => (n.id === id ? { ...n, read: true} : n))
            );
        
        }catch(e){
            setError(e?.message || "Failed to mark notification as read.");
        }finally{
            setActionLoading(false);
        }
    }

    //FUNCTIE DE MARK ALL AS READ PE NOTIFICARI
    async function handleMarkAllRead(){
        setActionLoading(true);
        setError("");

        try{
            const res = await markAllNotificationsAsRead(); // trebuie sa scoata ceva de genu {count : 0}
            setUnreadCount(res?.count ?? 0);
        
            //fac update la notificari (le pun toate sa fie pe read)
            setItems((prevItems) => 
            prevItems.map((n) => ({...n, read: true}))
            );
        }catch(e){
            setError(e?.message || "Failed to mark all notifications as read.");
        }finally{
            setActionLoading(false);
        }
    }

    //USE EFFECT

    //folosesc functia de load la notificari
    useEffect(() => {
        loadNotifications();
    }, []);


    //RETURN
return(
    <div className="p-6 rounded-3xl border border-indigo-400/30 bg-slate-900/60 shadow-xl">
    {/* HEADER */}
    <div className="flex items-center justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-indigo-200">Notifications</h2>
        <p className="text-sm text-slate-300">
          Unread: <span className="font-semibold">{unreadCount}</span>
        </p>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={loadNotifications}
          disabled={loading || actionLoading}
          className="shrink-0 px-3 py-2 rounded-full text-sm border border-indigo-300 text-indigo-200
                     hover:bg-indigo-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Refresh
        </button>

        <button
          onClick={handleMarkAllRead}
          disabled={loading || actionLoading || unreadCount === 0}
          className="shrink-0 px-3 py-2 rounded-full text-sm bg-indigo-400 text-slate-950 font-semibold
                     hover:bg-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Mark all read
        </button>
      </div>
    </div>

    {/* BODY */}
    <div className="mt-4">
      {loading ? (
        <p className="text-slate-300 text-sm">Loading notifications...</p>
      ) : error ? (
        <div className="rounded-xl bg-red-500/10 border border-red-500/60 px-4 py-2 text-sm text-red-200">
          Error: {error}
        </div>
      ) : items.length === 0 ? (
        <p className="text-slate-300 text-sm">No notifications yet</p>
      ) : (
        <ul className="space-y-3">
          {items.map((n) => (
            <li
              key={n.id}
              className={`p-4 rounded-2xl border ${
                n.read
                  ? "border-slate-700 bg-slate-950/30"
                  : "border-indigo-400/40 bg-indigo-500/10"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-400">{n.type}</p>
                  <p className="text-base font-semibold text-slate-100">{n.title}</p>
                  <p className="text-sm text-slate-200 mt-1">{n.message}</p>
                  {n.createdAt && (
                    <p className="text-xs text-slate-400 mt-2">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  )}
                </div>

                {!n.read && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    disabled={actionLoading}
                    className="shrink-0 px-3 py-2 rounded-full text-sm border border-indigo-300 text-indigo-200
                               hover:bg-indigo-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);



}



export default Notifications;