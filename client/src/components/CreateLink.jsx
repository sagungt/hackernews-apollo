import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CREATE_LINK_MUTATION } from '@/graphql/mutation';
import { FEED_QUERY } from '@/graphql/query';
import { LINKS_PER_PAGE } from '../constants';

export default function CreateLink() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    description: '',
    url: '',
  });

  const [createLink, { error }] = useMutation(CREATE_LINK_MUTATION, {
    variables: {
      description: formState.description,
      url: formState.url,
    },
    update: (cache, { data: { createLink: newLink } }) => {
      const take = LINKS_PER_PAGE;
      const skip = 0;
      const orderBy = { createdAt: 'desc' };
      const { feed } = cache.readQuery({
        query: FEED_QUERY,
        variables: { take, skip, orderBy },
      });

      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            id: feed.id,
            links: [...feed.links, newLink],
            count: feed.count + 1,
          },
        },
        variables: { take, skip, orderBy },
      });
    },
    onCompleted: () => navigate('/'),
  });

  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault();
        createLink();
      }}
      >
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={formState.description}
            onChange={(e) => setFormState({
              ...formState,
              description: e.target.value,
            })}
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={formState.url}
            onChange={(e) => setFormState({
              ...formState,
              url: e.target.value,
            })}
            type="text"
            placeholder="A URL for the link"
          />
          {error && (
            <span style={{ color: 'red' }}>{error.message}</span>
          )}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
