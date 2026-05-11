"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: Props) {
  useEffect(() => {
    if (!isOpen) return;

    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={css.backdrop}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={css.modal}>{children}</div>
    </div>,
    document.body
  );
}
