"use client";

import { Oval } from "react-loader-spinner";
import css from "./Loader.module.css";

interface LoaderProps {
  label?: string;
  inline?: boolean;
}

export default function Loader({
  label = "Loading…",
  inline = false,
}: LoaderProps) {
  return (
    <div
      className={inline ? css.inlineLoader : css.loader}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Oval
        height={16}
        width={16}
        strokeWidth={4}
        color="#0d6efd"
        secondaryColor="#dee2e6"
        ariaLabel="loading"
        visible
      />
      <span className={css.label}>{label}</span>
    </div>
  );
}
