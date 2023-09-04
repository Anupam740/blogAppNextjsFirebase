import { db } from '../Firebase';
import Link from 'next/link';
import { useState } from 'react';

export default function Home({ Allblogs }) {
  const [blogs, setBlogs] = useState(Allblogs);
  const [end, setEnd] = useState(false);

  const loadMore = async () => {
    const last = blogs[blogs.length - 1];
    const res = await db
      .collection('blogs')
      .orderBy('createdAt', 'desc')
      .startAfter(new Date(last.createdAt))
      .limit(3)
      .get();

    const newBlogs = res.docs.map((docSnap) => ({
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt.toMillis(),
      id: docSnap.id,
    }));

    setBlogs(blogs.concat(newBlogs));

    if (newBlogs.length < 3) {
      setEnd(true);
    }
  };

  return (
    <div className="center">
      {blogs.map((blog) => (
        <div className="card" key={blog.id}>
          <div className="card-image">
            <img src={blog.imageUrl} alt={blog.title} />
            <span className="card-title">{blog.title}</span>
          </div>
          <div className="card-content">
            <p>{blog.body}</p>
          </div>
          <div className="card-action">
            <Link href={`/blogs/${blog.id}`}>Read More</Link>
          </div>
        </div>
      ))}

      {end === false ? (
        <button className="btn #fb8c00 orange darken-1" onClick={() => loadMore()}>
          Load more
        </button>
      ) : (
        <h3>You have reached the end</h3>
      )}

      <style jsx>
        {`
          .card {
            max-width: 500px;
            margin: 22px auto;
          }
          p {
            display: -webkit-box;
            overflow: hidden;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }
        `}
      </style>
    </div>
  );
}

export async function getServerSideProps(context) {
  const querySnap = await db
    .collection('blogs')
    .orderBy('createdAt', 'desc')
    .limit(3)
    .get();

  const Allblogs = querySnap.docs.map((docSnap) => ({
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt.toMillis(),
    id: docSnap.id,
  }));

  return {
    props: { Allblogs }, // will be passed to the page component as props
  };
}
