import Link from '@/components/link';
import { Review } from '@/types/review';
import { Card, CardContent, Typography, Box, Rating } from '@mui/material';
import Image from 'next/image';
import type { FC } from 'react'

interface ReviewProductProps {
  review: Review;
}

export const ReviewProduct: FC<ReviewProductProps> = (props) => {
  const { review } = props;

  return (
    <Card>
      <CardContent
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Typography color="textPrimary" variant="subtitle1">
          Product details
        </Typography>
        <Image
          src={review.product.cover.url}
          alt={review.product.title}
          layout="responsive"
          width={16}
          height={9}
          priority
        />
        <Link
          color="primary"
          variant="body1"
          underline="hover"
          href={`/products/${review.product._id}`}
        >
          {review.product.title}
        </Link>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}
        >
          <Rating value={review.product.rating.average} readOnly />
          <Link
            color="textSecondary"
            variant="body2"
            underline="hover"
            href={`/products/${review.product._id}/reviews`}
          >
            {review.product.reviews.length} reviews
          </Link>
        </Box>
      </CardContent>
    </Card>
  )
};
