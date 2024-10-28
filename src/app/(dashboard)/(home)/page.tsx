'use client';
import { PageHeader } from '@/components/page-header';
import { ArrowTrendingDown } from '@/icons/arrow-trending-down';
import { ArrowTrendingUp } from '@/icons/arrow-trending-up';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import Head from 'next/head';
import { AreaChart } from './area-chart';
import { LineChart } from './line-chart';

const Home = () => {
  const theme = useTheme();

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader title="Dashboard" />
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexFlow: 'column',
                      gap: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="textPrimary">
                      Product sold
                    </Typography>
                    <Typography variant="h5" color="textPrimary" component="p">
                      9000
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <ArrowTrendingUp color="primary" />
                      <Typography variant="subtitle2" color="textPrimary">
                        +5.6%{' '}
                        <Typography
                          variant="body2"
                          color="textPrimary"
                          component="span"
                        >
                          than last month
                        </Typography>
                      </Typography>
                    </Box>
                  </Box>
                  <LineChart color={theme.palette.primary.main} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexFlow: 'column',
                      gap: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="textPrimary">
                      Sales profit
                    </Typography>
                    <Typography variant="h5" color="textPrimary" component="p">
                      42912
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <ArrowTrendingDown color="error" />
                      <Typography variant="subtitle2" color="textPrimary">
                        -9.2%{' '}
                        <Typography
                          variant="body2"
                          color="textPrimary"
                          component="span"
                        >
                          than last month
                        </Typography>
                      </Typography>
                    </Box>
                  </Box>
                  <LineChart color={theme.palette.info.main} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexFlow: 'column',
                      gap: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="textPrimary">
                      Total balance
                    </Typography>
                    <Typography variant="h5" color="textPrimary" component="p">
                      39312
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <ArrowTrendingUp color="primary" />
                      <Typography variant="subtitle2" color="textPrimary">
                        +5.6%{' '}
                        <Typography
                          variant="body2"
                          color="textPrimary"
                          component="span"
                        >
                          than last month
                        </Typography>
                      </Typography>
                    </Box>
                  </Box>
                  <LineChart color={theme.palette.warning.main} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Card>
                <Box sx={{ p: 2, paddingBottom: 0 }}>
                  <Typography
                    variant="subtitle1"
                    color="textPrimary"
                    sx={{ marginBottom: 2 }}
                  >
                    Yearly sales
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 3,
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        <Box
                          sx={{
                            bgcolor: 'primary.main',
                            borderRadius: 999,
                            width: 8,
                            height: 8,
                          }}
                        ></Box>
                        <Typography variant="subtitle2" color="textSecondary">
                          Total income
                        </Typography>
                      </Box>
                      <Typography variant="subtitle1" color="textPrimary">
                        321
                      </Typography>
                    </Box>
                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        <Box
                          sx={{
                            bgcolor: 'warning.main',
                            borderRadius: 999,
                            width: 8,
                            height: 8,
                          }}
                        ></Box>
                        <Typography variant="subtitle2" color="textSecondary">
                          Total expenses
                        </Typography>
                      </Box>
                      <Typography variant="subtitle1" color="textPrimary">
                        321
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <AreaChart />
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Home;
