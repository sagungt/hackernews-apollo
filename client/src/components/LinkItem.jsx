import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { timeDifferenceForDate } from '@/utils';
import { FEED_QUERY } from '@/graphql/query';
import { VOTE_MUTATION } from '@/graphql/mutation';
import { AUTH_TOKEN, LINKS_PER_PAGE } from '@/constants';

export default function LinkItem(props) {
  const { link, index } = props;
  const authToken = localStorage.getItem(AUTH_TOKEN);

  const take = LINKS_PER_PAGE;
  const skip = 0;
  const orderBy = { createdAt: 'desc' };

  const [vote] = useMutation(VOTE_MUTATION, {
    variables: {
      linkId: link.id,
    },
    update: (cache, { data: { vote: newVote } }) => {
      const { feed } = cache.readQuery({
        query: FEED_QUERY,
        variables: {
          take, skip, orderBy,
        },
      });

      const updatedLinks = feed.links.map((feedLink) => {
        if (feedLink.id === link.id) {
          const isVoterExist = feedLink.voters.find(({ id }) => id === newVote.user.id);
          return {
            ...feedLink,
            voters: isVoterExist ? [...feedLink.voters] : [...feedLink.voters, newVote.user],
          };
        }
        return feedLink;
      });

      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            id: feed.id,
            links: updatedLinks,
            count: feed.count,
          },
        },
        variables: {
          take, skip, orderBy,
        },
      });
    },
  });

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">
          {index + 1}
          .
        </span>
        {authToken && (
          <div className="ml1 gray f11" style={{ cursor: 'pointer' }} onClick={vote} aria-hidden>
            ▲
          </div>
        )}
      </div>
      <div className="ml1">
        <div>
          {link.description}
          {' '}
          (
          {link.url}
          )
        </div>
        <div className="f6 lh-copy gray">
          {link.voters.length}
          {' '}
          votes | by
          {' '}
          {link.postedBy ? link.postedBy.name : 'Unknown'}
          {' '}
          {timeDifferenceForDate(link.createdAt)}
        </div>
      </div>
    </div>
  );
}

LinkItem.propTypes = {
  index: PropTypes.number.isRequired,
  link: PropTypes.shape({
    id: PropTypes.number,
    createdAt: PropTypes.string,
    url: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    voters: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
      }),
    ),
    postedBy: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  }).isRequired,
};
