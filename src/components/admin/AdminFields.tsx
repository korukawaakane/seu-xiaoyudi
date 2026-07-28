"use client";

import type { ReactNode } from "react";

type FieldProps = {
  children: ReactNode;
  label: string;
  required?: boolean;
  wide?: boolean;
};

export function Field({ children, label, required = false, wide = false }: FieldProps) {
  return (
    <label className={wide ? "grid gap-2 md:col-span-2" : "grid gap-2"}>
      <span className="text-sm font-semibold text-ink">
        {label}
        {required ? <span className="ml-1 text-brand">*</span> : null}
      </span>
      {children}
    </label>
  );
}

type InputProps = {
  disabled?: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "date" | "number" | "text" | "url";
  value: string | number;
};

export function Input({
  disabled,
  onChange,
  placeholder,
  type = "text",
  value,
}: InputProps) {
  return (
    <input
      className="field-control"
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      type={type}
      value={value}
    />
  );
}

type TextareaProps = {
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  value: string;
};

export function Textarea({ onChange, placeholder, rows = 5, value }: TextareaProps) {
  return (
    <textarea
      className="field-control resize-y"
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      value={value}
    />
  );
}

type SelectProps = {
  children: ReactNode;
  onChange: (value: string) => void;
  value: string;
};

export function Select({ children, onChange, value }: SelectProps) {
  return (
    <select
      className="field-control"
      onChange={(event) => onChange(event.target.value)}
      value={value}
    >
      {children}
    </select>
  );
}

type SectionProps = {
  children: ReactNode;
  title: string;
};

export function FormSection({ children, title }: SectionProps) {
  return (
    <fieldset className="border-t border-line pt-6">
      <legend className="pr-3 font-serif text-lg font-semibold text-ink">{title}</legend>
      <div className="mt-5 grid gap-5 md:grid-cols-2">{children}</div>
    </fieldset>
  );
}
