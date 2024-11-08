import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  Typography,
} from '@mui/material';
import type { FC } from 'react';
import { Discount } from '../../../types/discounts';
import { formatDate } from '../../../utils/format-date';
import { useGetProduct } from './api';

interface ProductDiscountProps {
  discount: Discount;
}

export const ProductDiscount: FC<ProductDiscountProps> = (props) => {
  const { data: product } = useGetProduct();

  if (!product?.discount) return null;

  const { discount } = product;
  const { value, type, startDate, endDate } = discount;
  const summaryFields = [
    {
      value: value,
      text: {
        post: `${type === 'amount' ? '$' : '%'}`,
        pre: '',
      },
    },
    {
      value: formatDate(startDate),
      text: {
        pre: 'Active from',
        post: '',
      },
    },
    {
      value: endDate && formatDate(endDate),
      text: {
        pre: 'Expires on',
        post: '',
      },
    },
  ];
  return (
    <Card>
      <CardHeader
        // action={
        //   <Button
        //     variant="text"
        //     color="secondary"
        //     onClick={handleOpenDialog}
        //     disabled={isEditDisabled}
        //   >
        //     Edit
        //   </Button>
        // }
        title="Discount"
      />
      <Divider />
      <CardContent>
        <List sx={{ listStyle: 'inherit', ml: 2 }}>
          {summaryFields.map(
            ({ value, text }) =>
              value && (
                <li key={value}>
                  <Typography
                    color="textPrimary"
                    variant="body2"
                  >
                    {`${text.pre} ${value}${text.post}`}
                  </Typography>
                </li>
              )
          )}
        </List>
      </CardContent>
    </Card>
  );
};
