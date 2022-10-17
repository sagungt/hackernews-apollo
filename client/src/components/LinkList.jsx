import React from 'react';
import LinkItem from '@/components/LinkItem';
import { useQuery } from '@apollo/client';
import { useLocation, useNavigate } from 'react-router-dom';
import { FEED_QUERY } from '@/graphql/query';
import { NEW_LINK_SUBSCRIPTION, NEW_VOTES_SUBSCRIPTION } from '../graphql/subscription';
import { LINKS_PER_PAGE } from '../constants';

export default function LinkList() {
  const location = useLocation();
  const navigate = useNavigate();
  const isNewPage = location.pathname.includes('new');
  const pageIndexParams = location.pathname.split('/');
  const page = Number(pageIndexParams[pageIndexParams.length - 1]);
  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE : 0;
  const getQueryVariables = (newPage, currentPage) => {
    const skip = newPage ? (currentPage - 1) * LINKS_PER_PAGE : 0;
    const take = newPage ? LINKS_PER_PAGE : 100;
    const orderBy = { createdAt: 'desc' };
    return { take, skip, orderBy };
  };
  const getLinksToRender = (newPage, data) => {
    if (newPage) {
      return data.feed.links;
    }
    const rankedLinks = data.feed.links.slice();
    rankedLinks.sort(
      (l1, l2) => l2.voters.length - l1.voters.length,
    );
    return rankedLinks;
  };
  const {
    data, loading, error, subscribeToMore,
  } = useQuery(FEED_QUERY, {
    variables: getQueryVariables(isNewPage, page),
  });
  subscribeToMore({
    document: NEW_LINK_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      const { newLink } = subscriptionData.data;
      const exist = prev.feed.links.find(
        ({ id }) => id === newLink.newLink.id,
      );
      if (exist) return prev;
      return {
        feed: {
          // eslint-disable-next-line no-underscore-dangle
          __typename: prev.feed.__typename,
          id: prev.feed.id,
          count: prev.feed.links.length + 1,
          links: [newLink.newLink, ...prev.feed.links],
        },
      };
    },
  });

  subscribeToMore({
    document: NEW_VOTES_SUBSCRIPTION,
  });

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
      {data && (
        <>
          {
            getLinksToRender(isNewPage, data).map(
              (link, index) => (
                <LinkItem
                  key={`link-${link.id}:${Math.random()}`}
                  link={link}
                  index={index + pageIndex}
                />
              ),
            )
          }
          {
            isNewPage && (
              <div className="flex ml4 mv3 gray">
                <div
                  className="pointer mr2"
                  onClick={() => {
                    if (page > 1) {
                      navigate(`/new/${page - 1}`);
                    }
                  }}
                  aria-hidden
                >
                  Previous
                </div>
                <div
                  className="pointer"
                  onClick={() => {
                    if (page <= data.feed.count / LINKS_PER_PAGE) {
                      const nextPage = page + 1;
                      navigate(`/new/${nextPage}`);
                    }
                  }}
                  aria-hidden
                >
                  Next
                </div>
              </div>
            )
          }
        </>
      )}
    </>
  );
}
