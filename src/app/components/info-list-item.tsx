import type { FC, ElementType } from 'react';
import {  ListItem, Typography } from '@mui/material';
import type { ListItemProps, TypographyProps } from '@mui/material';

interface ListInfoItemProps extends ListItemProps {
  title?: string;
  content?: string | number;
  type?: 'line' | 'stacked';
  contentTypographyProps?: TypographyProps<ElementType, { component: ElementType }>;
}

export const InfoListItem: FC<ListInfoItemProps> = (props) => {
  const { children, title, content = null, type = 'stacked', contentTypographyProps, ...rest } = props;

  const stackedStyle = {
    display: 'block',
  }

  const lineStyle = {
    display: 'grid',
    gridAutoFlow: 'column',
    gap: 2,
    gridTemplateColumns: '3fr 5fr'
  }

  const style = type === 'stacked' ? stackedStyle : lineStyle;

  return (
    <ListItem
      disableGutters
      disablePadding
      sx={{ ...style, wordBreak: 'break-word' }}
      {...rest}
    >
      {title && (
        <Typography
          color="textPrimary"
          sx={{ fontWeight: 700 }}
          variant="subtitle2"
        >
          {title}
        </Typography>
      )}
      {
        content !== null && (
          <Typography
            color="textSecondary"
            variant="body2"
            {...contentTypographyProps}
          >
            {content}
          </Typography>
        )
      }
      {children}
    </ListItem>
  )
}