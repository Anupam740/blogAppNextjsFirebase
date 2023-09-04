import { useState } from 'react';
import { db } from '../../Firebase';
import { useRouter } from 'next/router';

export default function BlogPage({ blog, user, allComments }) {
  const [myComment, setMyComment] = useState('');
  const [allCommentsBlog, setAllComments] = useState(allComments);
  const router = useRouter();
  const { blogid } = router.query;

  const makeComment = async () => {
    if (!myComment.trim()) {
      return; // Prevent adding empty comments
    }

    try {
      // Add a comment to the Firestore collection
      await db.collection('blogs').doc(blogid).collection('comments').add({
        text: myComment,
        name: user.displayName,
      });

      // Retrieve and update the comments
      const commentQuery = await db.collection('blogs').doc(blogid).collection('comments').get();
      setAllComments(commentQuery.docs.map((docSnap) => docSnap.data()));
      setMyComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const deleteBlog = async () => {
    try {
      // Delete the blog post from Firestore
      await db.collection('blogs').doc(blogid).delete();

      // Redirect to the home page after deletion
      router.push('/'); // Adjust the path as needed
    } catch (error) {
      console.error('Error deleting blog:', error);
      // Handle any errors here, such as displaying an error message to the user
    }
  };

  return (
    <div className="container center">
      <h2>{blog.title}</h2>
      <h5>Created On - {new Date(blog.createdAt).toDateString()}</h5>
      <img src={blog.imageUrl} alt={blog.title} />
      <p>{blog.body}</p>

      {user ? (
        <>
          <div className="input-field">
            <input
              type="text"
              placeholder="Add a comment"
              value={myComment}
              onChange={(e) => setMyComment(e.target.value)}
            />
          </div>
          <button className="btn #fb8c00 orange darken-1" onClick={() => makeComment()}>
            Make comment
          </button>

          {/* Display the "Delete Blog" button only if the user is the author */}
          {user.displayName === blog.author && (
            <button className="btn red" onClick={() => deleteBlog()}>
              Delete Blog
            </button>
          )}
        </>
      ) : (
        <h3>Please login to make comments</h3>
      )}

      <hr />
      <div className="left-align">
        {allCommentsBlog.map((item, index) => (
          <h6 key={index}>
            <span>{item.name}</span> {item.text}
          </h6>
        ))}
      </div>

      <style jsx global>
        {`
          span {
            font-weight: 500;
          }
          body {
            color: orange;
          }
          img {
            width: 100%;
            max-width: 500px;
          }
        `}
      </style>
    </div>
  );
}

export async function getServerSideProps({ params: { blogid } }) {
  try {
    // Retrieve the blog post and its comments from Firestore
    const result = await db.collection('blogs').doc(blogid).get();
    const allCommentsSnap = await db.collection('blogs').doc(blogid).collection('comments').get();

    const allComments = allCommentsSnap.docs.map((comDocSnap) => comDocSnap.data());

    return {
      props: {
        blog: {
          ...result.data(),
          createdAt: result.data().createdAt.toMillis(),
        },
        allComments,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      notFound: true,
    };
  }
}
