import type { FC } from 'react';
import { Label } from '@/components/label';
import { Link } from '@/components/link';
import { Box, Card, CardContent, CardHeader, Divider, List, ListItem, Typography, useTheme } from '@mui/material';
import { yellow } from '@mui/material/colors';
import { Order, OrderStatus } from '@/types/orders';

interface UserGeneralOrdersProps {
  orders: Order[];
}

export const UserGeneralOrders: FC<UserGeneralOrdersProps> = (props) => {
  const { orders } = props;
  const theme = useTheme()

  const mappedColors: Record<OrderStatus, string> = {
    open: theme.palette.success.main,
    archived: theme.palette.error.main,
    canceled: yellow[600],
  }

  return (
    <Card>
      <CardHeader title="Latest Orders" />
      <Divider />
      <CardContent sx={{
        p: 0,
        '&:last-child': {
          pb: 0
        }
      }}>
        <List
          sx={{ width: '100%' }}
          disablePadding
        >
          {orders.map((order, index) => (
            <ListItem
              divider={index + 1 < orders.length}
              key={order._id}
              sx={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  placeItems: 'center'
                }}
              >
                <Typography
                  color="textSecondary"
                  variant="subtitle1"
                >
                  20
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="body2"
                >
                  Sep 22
                </Typography>
              </Box>
              <Link
                href="orders/1"
                color="textPrimary"
                variant="subtitle1"
                sx={{ mx: 5 }}
                underline="hover"
              >
                #132
              </Link>
              <Box sx={{ flexGrow: 1 }} />
              <Label color={mappedColors[order.status]}>
                {order.status}
              </Label>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};