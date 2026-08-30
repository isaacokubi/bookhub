import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { getBook } from "../api/bookApi";
import { getCart, addToCart as addToCartApi, removeFromCart as removeFromCartApi, clearCart as clearCartApi } from "../api/cartApi";

const CartContext = createContext();
const STORAGE_KEY = "bookhub_guest_cart";
const emptyCart = { books: [], total: 0 };

const getId = (item) => item?._id || item?.id || item?.bookId || item?.book?._id || item?.book?.id;
const getPrice = (item) => Number(item?.price ?? item?.book?.price ?? 0);

function normalize(data) {
  const books = Array.isArray(data) ? data : data?.books || data?.items || [];
  return { books, total: Number(data?.total) || books.reduce((sum, item) => sum + getPrice(item) * Number(item?.quantity || 1), 0) };
}

function readGuestCart() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return normalize(value || emptyCart);
  } catch {
    return emptyCart;
  }
}

function writeGuestCart(cart) {
  const normalized = normalize(cart);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(emptyCart);
  const [loading, setLoading] = useState(false);

  const save = (data, persistGuest = !user) => {
    const normalized = normalize(data);
    setCart(normalized);
    if (persistGuest) writeGuestCart(normalized);
    return normalized;
  };

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const guest = readGuestCart();
      try {
        if (!user) {
          if (active) save(guest, true);
          return;
        }

        const response = await getCart();
        let serverCart = normalize(response);

        // Preserve items added before login. Add them to the authenticated cart once.
        if (guest.books.length) {
          for (const item of guest.books) {
            const id = getId(item);
            if (!id) continue;
            try {
              const result = await addToCartApi(id);
              serverCart = normalize(result);
            } catch (mergeError) {
              console.warn("Could not merge guest cart item:", id, mergeError);
            }
          }
          localStorage.removeItem(STORAGE_KEY);
        }

        if (active) save(serverCart, false);
      } catch (error) {
        console.error("Failed to load cart:", error);
        if (active) save(guest, true);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [user]);

  const addBookToCart = async (bookOrId) => {
    const id = getId(bookOrId) || bookOrId;
    if (!id) throw new Error("Invalid book");

    if (user) {
      const response = await addToCartApi(id);
      save(response, false);
      return response;
    }

    let book = typeof bookOrId === "object" ? bookOrId : null;
    if (!book) {
      const response = await getBook(id);
      book = response?.data?.book || response?.data?.data?.book || response?.data?.data || response?.data;
    }

    const current = readGuestCart();
    const index = current.books.findIndex((item) => getId(item) === id);
    const books = [...current.books];
    if (index >= 0) {
      books[index] = { ...books[index], quantity: Number(books[index].quantity || 1) + 1 };
    } else {
      books.push({ ...book, bookId: id, quantity: 1 });
    }
    return save(writeGuestCart({ books }));
  };

  const removeBookFromCart = async (bookId) => {
    if (user) {
      const response = await removeFromCartApi(bookId);
      save(response, false);
      return response;
    }
    const books = readGuestCart().books.filter((item) => getId(item) !== bookId);
    return save(writeGuestCart({ books }));
  };

  const clearCart = async () => {
    if (user) await clearCartApi();
    localStorage.removeItem(STORAGE_KEY);
    setCart(emptyCart);
  };

  const loadCart = async () => {
    if (!user) return save(readGuestCart(), true);
    const response = await getCart();
    return save(response, false);
  };

  const cartCount = useMemo(() => cart.books.reduce((sum, item) => sum + Number(item?.quantity || 1), 0), [cart.books]);
  const cartTotal = useMemo(() => cart.books.reduce((sum, item) => sum + getPrice(item) * Number(item?.quantity || 1), 0), [cart.books]);

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, loading, loadCart, addToCart: addBookToCart, removeFromCart: removeBookFromCart, clearCart, setCart: (value) => save(value, !user) }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
