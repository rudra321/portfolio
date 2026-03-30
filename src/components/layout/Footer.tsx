"use client";

export function Footer() {
  return (
    <footer className="px-6 pb-8 pt-16">
      <div className="mx-auto flex max-w-6xl items-end justify-between">
        <p className="font-mono text-xs text-text-secondary/30">
          &copy; {new Date().getFullYear()}
        </p>
        <p className="font-mono text-xs text-text-secondary/30">
          Rudra Pratap Singh Chouhan
        </p>
      </div>
    </footer>
  );
}
