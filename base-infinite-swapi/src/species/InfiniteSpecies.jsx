import InfiniteScroll from 'react-infinite-scroller';
import { Species } from './Species';
import { useInfiniteQuery } from 'react-query';

const initialUrl = 'https://swapi.dev/api/species/';
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'sw-species',
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    // 위 쿼리 함수는 useInfiniteQuery의 pageParam을 쓰는데 initialUrl에서 시작하여 pageParam값으로 fetchUrl을 실행한다.
    {
      getNextPageParam: (lastPage) => lastPage.next || undefined,
      // getNextPageParam는 이전페이지의 다음 프로퍼티를 불러와서 새 페이지 데이터가 있을 때마다 pageParam에 지정 해준다.
    }
  );

  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div>Error!{error.toString()}</div>;
  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}
      <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
        {/* hasMore함수는 infiniteScroll 컴포넌트가 계속 데이터를 불러올지를 결정하는 역할을 한다.*/}
        {data.pages.map((pageData) => {
          return pageData.results.map((species) => {
            return (
              <Species
                key={species.name}
                name={species.name}
                language={species.language}
                averageLifespan={species.average_lifespan}
              />
            );
          });
        })}
      </InfiniteScroll>
    </>
  );
}
