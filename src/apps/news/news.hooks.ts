import * as React from 'react';
import { useRouter } from 'next/router';
import { shallow } from 'zustand/shallow';
import { useAppStateStore } from '~/common/state/store-appstate';
import { incrementalVersion } from './news.data';

export function useShowNewsOnUpdate() {
  const { push } = useRouter();
  const { lastSeenNewsVersion } = useAppStateStore(state => ({
    lastSeenNewsVersion: state.lastSeenNewsVersion,
  }), shallow);

  React.useEffect(() => {
    const isNewsOutdated = (lastSeenNewsVersion || 0) < incrementalVersion;
    if (isNewsOutdated) {
      push('/news').then(() => null);
    }
  }, [lastSeenNewsVersion, push]);
}

export function useMarkNewsAsSeen() {
  const { push } = useRouter();

  return React.useCallback((keyword: string) => {
    if (keyword === 'aitt23') {
      useAppStateStore.getState().setLastSeenNewsVersion(incrementalVersion);
      push('/'); // redirects to the home or app page
    } else {
      alert('Invalid Keyword!');
    }
  }, [push]);
}
