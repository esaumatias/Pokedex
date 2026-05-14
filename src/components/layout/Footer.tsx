export function Footer() {
  return (
    <footer className="border-t border-[color:var(--color-border)]/70 bg-[color:var(--color-card)]/40 py-10 text-sm text-[color:var(--color-muted)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} — Projeto original por{' '}
          <a className="text-[color:var(--color-fg)] underline-offset-4 hover:underline" href="https://www.linkedin.com/in/esau-freire-matias/" target="_blank" rel="noreferrer">
            Esau
          </a>
          . Interface e arquitetura renovadas para uma experiência moderna.
        </p>
        <p className="text-xs">Dados da PokéAPI (não oficial).</p>
      </div>
    </footer>
  );
}
