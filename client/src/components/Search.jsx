import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import LinkItem from '@/components/LinkItem';
import { FEED_SEARCH_QUERY } from '../graphql/query';

export default function Search() {
  const [searchFilter, setSearchFilter] = useState('');
  const [executeSearch, { data }] = useLazyQuery(FEED_SEARCH_QUERY);

  return (
    <>
      <div>
        Search
        <input type="text" onChange={(e) => setSearchFilter(e.target.value)} />
        <button
          type="button"
          onClick={() => {
            executeSearch({
              variables: { filter: searchFilter },
            });
          }}
        >
          OK
        </button>
      </div>
      {
        data && data
          .feed
          .links
          .map((link, index) => <LinkItem key={link.id} link={link} index={index} />)
      }
    </>
  );
}
