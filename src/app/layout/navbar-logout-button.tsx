import type { FC } from 'react';
import { Button } from '../components/button'
import { useRouter } from 'next/navigation';

export const NavbarLogoutButton: FC = () => {
  const { push } = useRouter();

  const handleClick = async () => {
    try {
      await fetch('/api/logout');
      push('/login')
    } catch (error) {
    }
  }

  return (
    <Button
      color="secondary"
      variant="text"
      onClick={handleClick}
    >
      Logout
    </Button>
  )
}
