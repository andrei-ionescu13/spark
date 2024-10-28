import type { FC } from 'react';
import { Box, Card, colors, Typography, useTheme } from '@mui/material';
import { format } from 'date-fns';
import { Product } from '@/types/products';
import { User } from '@/types/user';

const formatDate = (date: string | Date) => {
  try {
    return format(new Date(date), 'dd.MM.yyyy hh:mm')
  } catch (error) {
    return '';
  }
}

interface PromoCodeSummaryProps {
  title?: string;
  code?: string;
  value?: string | number;
  startDate: Date | string | null;
  endDate: Date | string | null;
  products: Product[];
  type: string;
  productSelection: "general" | "selected";
  users: User[];
  userSelection: "general" | "selected";
}

export const PromoCodeSummary: FC<PromoCodeSummaryProps> = (props) => {
  const {
    value,
    startDate,
    endDate,
    products,
    type,
    code,
    productSelection,
    userSelection,
    users
  } = props;
  const theme = useTheme()

  const mappedColors = {
    scheduled: colors.grey[500],
    active: theme.palette.success.main,
    expired: theme.palette.error.main
  }
  const summaryFields = [
    {
      value: value,
      text: {
        post: `${type === 'amount' ? '$' : '%'} off ${productSelection === 'general' ? 'general' : products.length === 1 ? products[0].title : `${products.length} products`}`,
        pre: ''
      },
      show: productSelection === 'general' || (productSelection === 'selected' && !!products.length)
    },
    {
      value: '',
      text: {
        post: userSelection === 'general' ? 'general' : users.length === 1 ? users[0].email : `${users.length} users`,
        pre: ''
      },
      show: userSelection === 'general' || (userSelection === 'selected' && !!users.length)
    },
    {
      value: startDate && formatDate(startDate),
      text: {
        pre: 'Active from',
        post: '',
      },
      show: !!startDate
    },
    {
      value: endDate && formatDate(endDate),
      text: {
        pre: 'Expires on',
        post: '',
      },
      show: !!endDate
    },
  ]

  return (
    <Card sx={{
      p: 2,
      ul: {
        pl: 2.5
      },
      li: {
        '&:not(:last-of-type)': {
          mb: 0.5
        }
      }
    }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2
        }}
      >
        <Typography
          color="textPrimary"
          variant="subtitle1"
        >
          Summary
        </Typography>
      </Box>
      {[code, ...summaryFields.map((field) => field.value)].some((item) => !!item) ? (
        <>
          {(code) && (
            <Typography
              color="textPrimary"
              variant="subtitle1"
            >
              {code}
            </Typography>
          )}
          <ul>
            {summaryFields.map(({ value, text, show = true }) => show && (
              <li key={value}>
                <Typography
                  color="textPrimary"
                  variant="body2"
                >
                  {`${text.pre} ${value}${text.post}`}
                </Typography>
              </li>
            ))}
          </ul>
        </>
      ) :
        <Typography
          color="textSecondary"
          variant="body2"
        >
          No information entered yet
        </Typography>
      }
    </Card>
  )
}
