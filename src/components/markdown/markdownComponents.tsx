import { type ReactNode } from 'react';

const markdownComponents = {
  p: ({ children }: { children?: ReactNode }): JSX.Element => (
    <p className="mt-5">
      <span>{children}</span>
    </p>
  ),
  strong: ({ children }: { children?: ReactNode }): JSX.Element => (
    <strong className="font-semibold text-violet-900 dark:text-primary">{children}</strong>
  ),
  em: ({ children }: { children?: ReactNode }): JSX.Element => (
    <em className="text-violet-900 dark:text-primary">{children}</em>
  ),
  h1: ({ children }: { children?: ReactNode }): JSX.Element => (
    <h1 className="text-5xl font-black lg:text-7xl mt-5 text-left">{children}</h1>
  ),
  h2: ({ children }: { children?: ReactNode }): JSX.Element => (
    <h2 className="text-3xl lg:text-4xl font-black mt-5 text-left">{children}</h2>
  ),
  h3: ({ children }: { children?: ReactNode }): JSX.Element => (
    <div className="text-1xl lg:text-2xl font-semibold mt-5">{children}</div>
  ),
  h4: ({ children }: { children?: ReactNode }): JSX.Element => (
    <div className="text-1xl lg:text-2xl font-semibold mt-5">{children}</div>
  ),
  ul: ({ children }: { children?: ReactNode }): JSX.Element => (
    <ul className="list-disc">{children}</ul>
  ),
  ol: ({ children }: { children?: ReactNode }): JSX.Element => (
    <ol className="list-decimal">{children}</ol>
  ),
  li: ({ children }: { children?: ReactNode }): JSX.Element => (
    <li className="mt-2 ml-5">{children}</li>
  ),
  a: ({ children, href }: { children?: ReactNode; href?: string }): JSX.Element => (
    <a
      href={href}
      className="font-semibold text-blue-300 dark:text-primary cursor-pointer hover:text-white hover:underline"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  ),
};

export default markdownComponents;
