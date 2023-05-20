import type { FC } from 'react';
import { Card, CardContent, CardHeader, Divider, Grid, List, useTheme } from '@mui/material';
import { InfoListItem } from '@/components/info-list-item';
import { Label } from '@/components/label';
import type { User } from '@/types/user';
import { InfoList } from '@/components/info-list';
import { formatDate } from '@/utils/format-date';

interface UserGeneralDetailsProps {
  user: User;
}

export const UserGeneralDetails: FC<UserGeneralDetailsProps> = (props) => {
  const { user } = props;
  const theme = useTheme()
  const mappedColors = {
    active: theme.palette.success.main,
    inactive: theme.palette.warning.main,
    banned: theme.palette.error.main,
  }

  return (
    <Card>
      <CardHeader title="General Details" />
      <Divider />
      <CardContent>
        <Grid
          container
          spacing={{
            xs: 0,
            sm: 2
          }}
        >
          <Grid
            item
            xs={12}
            sm={6}
          >
            <InfoList>
              <InfoListItem
                title="Email"
                content={user.email}
                type="stacked"
              />
              <InfoListItem
                title="Created"
                content={formatDate(user.createdAt)}
                type="stacked"
              />
              <InfoListItem
                title="Status"
                type="stacked"
              >
                <Label color={mappedColors[user.status]}>
                  {user.status}
                </Label>
              </InfoListItem>
            </InfoList>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
          >
            <InfoList >
              <InfoListItem
                title="Active orders"
                content="0"
                type="stacked"
              />
              <InfoListItem
                title="Last order"
                content={formatDate(user.createdAt)}
                type="stacked"
              />
              <InfoListItem
                title="Total orders"
                content={user.ordersCount}
                type="stacked"
              />
              <InfoListItem
                title="Total spend"
                content={`${user.totalSpend}$`}
                type="stacked"
              />
            </InfoList>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};