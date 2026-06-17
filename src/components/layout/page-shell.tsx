type PageShellProps = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}>;

export function PageShell({
  eyebrow,
  title,
  description,
  children,
}: PageShellProps) {
  return (
    <>
      <section className="page-header">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lede">{description}</p>
      </section>
      {children}
    </>
  );
}
