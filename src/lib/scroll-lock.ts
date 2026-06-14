/* ============================================================
 * Reference-counted body scroll lock.
 *
 * Several modals/drawers can be open at once (e.g. an item
 * detail popup -> auth gate -> cart drawer). Each independently
 * locking/restoring document.body.style.overflow can strand the
 * page scrolled-locked when they unmount out of order. This
 * counts active locks and only restores when the last releases.
 * ============================================================ */

let count = 0;
let saved = "";

export function lockScroll(): void {
  if (typeof document === "undefined") return;
  if (count === 0) {
    saved = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  count += 1;
}

export function unlockScroll(): void {
  if (typeof document === "undefined") return;
  count = Math.max(0, count - 1);
  if (count === 0) document.body.style.overflow = saved;
}
