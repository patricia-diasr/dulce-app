import { useNavigate } from 'react-router-dom';
import { clearToken } from '@/shared/utils/tokenStorage';

export function useLogout(loginPath: string) {
  const navigate = useNavigate();

  return () => {
    clearToken();
    navigate(loginPath);
  };
}
