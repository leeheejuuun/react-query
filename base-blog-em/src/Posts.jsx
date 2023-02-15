import { useState } from 'react';
import { useQuery } from 'react-query'; // 설명 : 서버에서 데이터를 가져올 때 사용하는 훅

import { PostDetail } from './PostDetail';
const maxPostPage = 10;

async function fetchPosts() {
  const response = await fetch(
    'https://jsonplaceholder.typicode.com/posts?_limit=10&_page=0'
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  // replace with useQuery
  // const data = [];
  // 설명 : 위 const data = []; 코드를 useQuery로 data를 구조 분해한다.
  // 설명 : useQuery의 첫 번째 인자는 쿼리 키 이다.
  //       두 번째 인자는 쿼리에 대한 데이터를 가져오는 방법 즉, 함수를 의미한다. (비동기 함수여야 함)
  //       세 번째 인자는 옵션이며 staleTime이다. 1/1000초 단위이다.
  const { data, isError, error, isLoading } = useQuery('posts', fetchPosts, {
    staleTime: 2000,
  });

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
        <button disabled onClick={() => {}}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button disabled onClick={() => {}}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
