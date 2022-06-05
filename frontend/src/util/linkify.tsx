export const componentDecorator = (href: string, text: string, key: number) => (
  <a href={href} key={key} target="_blank" rel="noreferrer">
    {text}
  </a>
);
