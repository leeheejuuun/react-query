import InfiniteScroll from 'react-infinite-scroller';
import { Person } from './Person';

import { useInfiniteQuery } from 'react-query';

const initialUrl = 'https://swapi.dev/api/people/';
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  // fetchNextPage는 더 많은 데이터가 필요할 때 어느 함수를 실행할지를 infiniteScroll에 지시하는 역할을 한다.
  // hasNextPage는 수집할 데이터가 더 있는지를 결정하는 불리언이다.
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    isFetching,
  } = useInfiniteQuery(
    'sw-people',
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    // useInfiniteQuery의 모든것은 pageParam에 달려 있다. pageParam은 fetchNextPage가 어떻게 보일지 결정하고 다음 페이지가 있는지 결정한다.

    {
      getNextPageParam: (lastPage) => lastPage.next || undefined,
    }
  );

  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div>Error!{error.toString()}</div>;
  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}
      <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
        {data.pages.map((pageData) => {
          return pageData.results.map((person) => {
            // pageData는 각 페이지에 useInfiniteQuery가 fetchNextPage로 불러온 데이터 배열을 맵핑한다.
            return (
              <Person
                key={person.name}
                name={person.name}
                hairColor={person.hair_color}
                eyeColor={person.eye_color}
              />
            );
          });
        })}
      </InfiniteScroll>
    </>
  );
}
