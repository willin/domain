'use client';
import type { Session } from 'next-auth';
import useSWR from 'swr';
import { AdminId } from '@/lib/config';
import { useEffect, useState } from 'react';

export async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const res = await fetch(input, init);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res.json();
}

export function useLoginInfo() {
  const [loading, setLoading] = useState(true);
  const [maxDomains, setMaxDomains] = useState(1);
  const [following, setFollowing] = useState(false);
  const { data } = useSWR<Session['user']>('/api/me', fetcher);
  const { username, vip = false, admin = false } = data || {};

  useEffect(() => {
    if (username != undefined) {
      setLoading(false);
    }
    if (!username || vip || admin) {
      return;
    }
    if (username === AdminId) {
      setFollowing(true);
      return;
    }
    fetch(`https://api.github.com/users/${username}/following/${AdminId}`)
      .then((res) => {
        if (res.status === 204) {
          setFollowing(true);
        }
      })
      .catch(() => {});
  }, [username]);

  useEffect(() => {
    if (admin) {
      setMaxDomains(999);
    } else if (vip) {
      setMaxDomains(20);
    } else if (following) {
      setMaxDomains(5);
    } else {
      setMaxDomains(1);
    }
  }, [following, vip, admin]);

  return {
    loading,
    username,
    maxDomains
  };
}
