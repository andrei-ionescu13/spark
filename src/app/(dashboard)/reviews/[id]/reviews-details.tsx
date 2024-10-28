import Link from '@/components/link';
import { Review } from '@/types/review';
import { formatDate } from '@/utils/format-date';
import { Card, Box, Rating, Typography, Divider } from '@mui/material';
import type { FC } from 'react'

interface ReviewsDetailsProps {
  review: Review;
}

export const ReviewsDetails: FC<ReviewsDetailsProps> = (props) => {
  const { review } = props;

  return (
    <Card>
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Rating value={review.rating} readOnly />
        <Typography color="textSecondary" variant="body2">
          {formatDate(review.createdAt)}
        </Typography>
        <Typography color="textPrimary" variant="body2">
          {review.content}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography color="textPrimary" variant="body2">
          {`By ${review.userName} `}(
          <Link
            color="primary"
            variant="inherit"
            underline="hover"
            href={`/users/${review.user._id}`}
          >
            {review.user.email}
          </Link>
          )
        </Typography>
      </Box>
    </Card>
  )
};
