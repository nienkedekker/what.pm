import {
  forwardRef,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type ButtonHTMLAttributes,
  type FormHTMLAttributes,
  type ReactNode,
} from "react";

// Shared styles
const inputStyles =
  "w-full px-2 py-1 font-mono text-sm bg-white dark:bg-neutral-800 text-black dark:text-gray-100 border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white dark:border-t-neutral-950 dark:border-l-neutral-950 dark:border-b-neutral-600 dark:border-r-neutral-600 focus:outline-none focus:ring-2 focus:ring-orange-400";

const buttonStyles =
  "px-4 py-1.5 bg-[#c0c0c0] dark:bg-neutral-600 text-black dark:text-gray-100 font-bold border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 dark:border-t-neutral-500 dark:border-l-neutral-500 dark:border-b-neutral-800 dark:border-r-neutral-800 hover:bg-[#d0d0d0] dark:hover:bg-neutral-500 active:border-t-gray-600 active:border-l-gray-600 active:border-b-white active:border-r-white dark:active:border-t-neutral-800 dark:active:border-l-neutral-800 dark:active:border-b-neutral-500 dark:active:border-r-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed";

const formStyles =
  "space-y-4 p-4 bg-[#c0c0c0] dark:bg-neutral-700 border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 dark:border-t-neutral-600 dark:border-l-neutral-600 dark:border-b-neutral-900 dark:border-r-neutral-900";

// RetroInput
interface RetroInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const RetroInput = forwardRef<HTMLInputElement, RetroInputProps>(
  ({ className = "", ...props }, ref) => {
    return <input ref={ref} className={`${inputStyles} ${className}`} {...props} />;
  }
);
RetroInput.displayName = "RetroInput";

// RetroTextarea
interface RetroTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const RetroTextarea = forwardRef<HTMLTextAreaElement, RetroTextareaProps>(
  ({ className = "", ...props }, ref) => {
    return <textarea ref={ref} className={`${inputStyles} resize-none ${className}`} {...props} />;
  }
);
RetroTextarea.displayName = "RetroTextarea";

// RetroButton
interface RetroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const RetroButton = forwardRef<HTMLButtonElement, RetroButtonProps>(
  ({ className = "", ...props }, ref) => {
    return <button ref={ref} className={`${buttonStyles} ${className}`} {...props} />;
  }
);
RetroButton.displayName = "RetroButton";

// RetroForm
interface RetroFormProps extends FormHTMLAttributes<HTMLFormElement> {}

export const RetroForm = forwardRef<HTMLFormElement, RetroFormProps>(
  ({ className = "", ...props }, ref) => {
    return <form ref={ref} className={`${formStyles} ${className}`} {...props} />;
  }
);
RetroForm.displayName = "RetroForm";

// RetroLabel
interface RetroLabelProps {
  htmlFor: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  children: ReactNode;
}

export function RetroLabel({ htmlFor, required, optional, hint, children }: RetroLabelProps) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-bold mb-1 text-black dark:text-gray-100">
      {children}
      {required && <span className="text-red-600"> *</span>}
      {optional && (
        <span className="text-gray-500 dark:text-gray-400 font-normal"> (optional)</span>
      )}
      {hint && <span className="text-gray-500 dark:text-gray-400 font-normal"> {hint}</span>}
    </label>
  );
}

// RetroCharCount
interface RetroCharCountProps {
  current: number;
  max: number;
}

export function RetroCharCount({ current, max }: RetroCharCountProps) {
  return (
    <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 font-mono">
      {current}/{max}
    </p>
  );
}
