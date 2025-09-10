import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { logout } from '../lib/api';

const UseLogout = () => {
    const queryClient = useQueryClient();

      const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });
    return { logoutMutation };


}

export default UseLogout
