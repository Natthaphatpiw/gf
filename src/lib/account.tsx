"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/* ============================================================
 * Account context — auth (register/login), favourites & cart.
 * Client-safe: talks only to /api/*, never imports server code.
 * Adding to cart / favouriting while logged out opens the auth
 * modal and replays the action after a successful sign-in.
 * ============================================================ */

export type ItemType = "program" | "service" | "menu" | "package";

export interface Account {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface FavItem {
  itemType: ItemType;
  itemId: string;
}

export interface CartLine {
  itemType: ItemType;
  itemId: string;
  quantity: number;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}

interface AccountContextValue {
  user: Account | null;
  ready: boolean;
  favorites: FavItem[];
  cart: CartLine[];
  isFavorite: (type: ItemType, id: string) => boolean;
  isInCart: (type: ItemType, id: string) => boolean;
  cartCount: number;
  favCount: number;
  toggleFavorite: (type: ItemType, id: string) => void;
  addToCart: (type: ItemType, id: string) => void;
  removeFromCart: (type: ItemType, id: string) => void;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (input: RegisterInput) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  // modal/drawer plumbing
  authOpen: boolean;
  cartOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Account | null>(null);
  const [ready, setReady] = useState(false);
  const [favorites, setFavorites] = useState<FavItem[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [authOpen, setAuthOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  /** intent to replay after a successful sign-in (run against fresh state) */
  const pending = useRef<{ kind: "fav" | "cart"; type: ItemType; id: string } | null>(null);

  const refreshLists = useCallback(async () => {
    const [favRes, cartRes] = await Promise.all([
      fetch("/api/favorites").then((r) => (r.ok ? r.json() : { items: [] })),
      fetch("/api/cart").then((r) => (r.ok ? r.json() : { items: [] })),
    ]);
    const favs: FavItem[] = favRes.items ?? [];
    const lines: CartLine[] = cartRes.items ?? [];
    setFavorites(favs);
    setCart(lines);
    return { favorites: favs, cart: lines };
  }, []);

  // Bootstrap: who am I + my lists.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const me = await fetch("/api/auth/me").then((r) => r.json());
        if (!alive) return;
        if (me.user) {
          setUser(me.user);
          await refreshLists();
        }
      } catch {
        /* offline / no api — stay logged out */
      } finally {
        if (alive) setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [refreshLists]);

  // Core mutations take the CURRENT list explicitly so the post-sign-in
  // replay can run them against freshly-fetched state (no stale closure).
  const doFav = useCallback((type: ItemType, id: string, current: FavItem[]) => {
    const has = current.some((f) => f.itemType === type && f.itemId === id);
    setFavorites(
      has
        ? current.filter((f) => !(f.itemType === type && f.itemId === id))
        : [{ itemType: type, itemId: id }, ...current],
    );
    fetch("/api/favorites", {
      method: has ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemType: type, itemId: id }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setFavorites(d.items ?? []))
      .catch(() => {});
  }, []);

  const doCart = useCallback((type: ItemType, id: string, current: CartLine[]) => {
    if (current.some((c) => c.itemType === type && c.itemId === id)) {
      setCartOpen(true);
      return;
    }
    setCart([{ itemType: type, itemId: id, quantity: 1 }, ...current]);
    setCartOpen(true);
    fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemType: type, itemId: id }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setCart(d.items ?? []))
      .catch(() => {});
  }, []);

  const isFavorite = useCallback(
    (type: ItemType, id: string) => favorites.some((f) => f.itemType === type && f.itemId === id),
    [favorites],
  );
  const isInCart = useCallback(
    (type: ItemType, id: string) => cart.some((c) => c.itemType === type && c.itemId === id),
    [cart],
  );

  const toggleFavorite = useCallback(
    (type: ItemType, id: string) => {
      if (user) doFav(type, id, favorites);
      else {
        pending.current = { kind: "fav", type, id };
        setAuthOpen(true);
      }
    },
    [user, favorites, doFav],
  );

  const addToCart = useCallback(
    (type: ItemType, id: string) => {
      if (user) doCart(type, id, cart);
      else {
        pending.current = { kind: "cart", type, id };
        setAuthOpen(true);
      }
    },
    [user, cart, doCart],
  );

  const removeFromCart = useCallback((type: ItemType, id: string) => {
    setCart((prev) => prev.filter((c) => !(c.itemType === type && c.itemId === id)));
    fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemType: type, itemId: id }),
    }).catch(() => {});
  }, []);

  const finishAuth = useCallback(
    async (u: Account) => {
      setUser(u);
      setAuthOpen(false);
      const lists = await refreshLists();
      const intent = pending.current;
      pending.current = null;
      if (intent?.kind === "fav") doFav(intent.type, intent.id, lists.favorites);
      else if (intent?.kind === "cart") doCart(intent.type, intent.id, lists.cart);
    },
    [refreshLists, doFav, doCart],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return { ok: false, error: data.error ?? "server_error" };
      }
      await finishAuth((await res.json()).user);
      return { ok: true };
    },
    [finishAuth],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return { ok: false, error: data.error ?? "server_error" };
      }
      await finishAuth((await res.json()).user);
      return { ok: true };
    },
    [finishAuth],
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setUser(null);
    setFavorites([]);
    setCart([]);
    setCartOpen(false);
  }, []);

  const value = useMemo<AccountContextValue>(
    () => ({
      user,
      ready,
      favorites,
      cart,
      isFavorite,
      isInCart,
      cartCount: cart.length,
      favCount: favorites.length,
      toggleFavorite,
      addToCart,
      removeFromCart,
      login,
      register,
      logout,
      authOpen,
      cartOpen,
      openAuth: () => setAuthOpen(true),
      closeAuth: () => {
        pending.current = null;
        setAuthOpen(false);
      },
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
    }),
    [
      user,
      ready,
      favorites,
      cart,
      isFavorite,
      isInCart,
      toggleFavorite,
      addToCart,
      removeFromCart,
      login,
      register,
      logout,
      authOpen,
      cartOpen,
    ],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount(): AccountContextValue {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used within AccountProvider");
  return ctx;
}
