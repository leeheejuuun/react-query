import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query'; // 설명 : 서버에서 데이터를 가져올 때 사용하는 훅

import { PostDetail } from './PostDetail';
const maxPostPage = 10;

async function fetchPosts(pageNum) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentPage < maxPostPage) {
      // 설명 : 9페이지 이전에는 프리페칭이 이루어지지만 10페이지에 있다면 미리 가져올 데이터가 없을것이다.
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery(['posts', nextPage], () =>
        fetchPosts(nextPage)
      ); // 설명 : prefetchQuery의 인자는 useQuery의 인자와 비슷하다.
    }
  }, [currentPage, queryClient]);

  // const data = [];

  // 설명 : 위 const data = []; 코드를 useQuery로 data를 구조 분해한다.
  // 설명 : useQuery의 첫 번째 인자는 쿼리 키 이다.
  //       두 번째 인자는 쿼리에 대한 데이터를 가져오는 방법 즉, 함수를 의미한다. (비동기 함수여야 함)
  //       세 번째 인자는 옵션이며 staleTime이다. 1/1000초 단위이다.

  const { data, isError, error, isLoading, isFetching } = useQuery(
    ['posts', currentPage], // 의존성 배열에 넣음으로 써 쿼리 키가 바뀔때마다 데이터패칭을 한다.
    () => fetchPosts(currentPage),
    {
      staleTime: 2000,
      keepPreviousData: true,
      // 설명 : query키가 바뀔 때도 지난 데이터를 유지해서 혹여나 이전 페이지로 돌아갔을 때 케시에 해당 데이터가 있도록 하는 기능
    }
  );

  if (isLoading) return <h3>Loading...</h3>;
  if (isError)
    return (
      <>
        <h3>Error.</h3>
        <p>{error.toString()}</p>
      </>
    );

  return (
    <>
      <ul>
        {/*설명 : 여기서 우리가 맵핑한 데이터는 위 fetchPosts함수의 HTTP요청에서 반환된 JSON이 된다.*/}
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
