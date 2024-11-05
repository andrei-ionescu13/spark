import type { FC } from 'react';

interface HighlightProps {
  children: string;
  value: string;
}

export const Highlight: FC<HighlightProps> = (props) => {
  const { children, value } = props;
  const index = children
    ? children.toLocaleLowerCase().indexOf(value.toLocaleLowerCase())
    : -1;
  if (index === -1 || !value || !children) return <p>{children}</p>;

  const start = children.slice(0, index);
  const end = children.slice(index + value.length);

  return (
    <p>
      {start}
      <mark>{value}</mark>
      {end}
    </p>
  );
};
