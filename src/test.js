import React, { useState, useEffect } from 'react'
import Avatar from '@mui/material/Avatar';
import './Post.css'
import { db, auth } from "./firebase";
import firebase from 'firebase/compat/app';
import { Box, Button, Input, Modal } from '@mui/material';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import FavoriteIcon from '@mui/icons-material/Favorite';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
function Post({ user, postId, username, caption, imgurl,likeCount }) {
  var style={
    color:'black'
  }
const  isLiked =()=>{
  db.collection('posts').get().then((querySnapshot) => {
             
    querySnapshot.forEach(element => {
    // console.log(element.id+"==="+postId);
      var data = element.data();
       if(element.id===postId){
        console.log(element.id+'='+postId);
        var arr=data.liker;
      console.log(data.liker);
      console.log(user.displayName);
        if(data.liker.includes(user.displayName)===false){
          console.log('false'+postId+user.displayName);
          setLikest( {
            color:'#ffc6c4'
          })
          
        }
        else{
          console.log('true')

          setLikest({
            color:'red'
          })
          
        }
      }
    }
    
    )}
    
    )
    return style
}

//  console.log(isLiked())
const liked={
  color:'red'
}
const unliked={
  color:'black'
}
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [open, setOpen] = React.useState(false);
  const [Like,setLike]=useState(likeCount)
  const handleOpen = () => setOpen(true);
  const [posts, setPosts] = useState([]);
  const [likest,setLikest]=useState(isLiked);
  const handleClose = () => setOpen(false);
  const likeIcon=document.querySelector('.likeIcon')
var  likeStyle={
  color:'red'
}
 

  function doLike(){
  db.collection('posts').get().then((querySnapshot) => {
             
 
    querySnapshot.forEach(element => {
        var data = element.data();
         if(element.id===postId){
          var arr=data.liker;
        if(data.liker.includes(user.displayName)==false){
          console.log('no match');
          setLike(Like+1)
          setLikest({
            color:'red'
          })
          data.liker.push(user.displayName) 
          db.collection('posts').doc(postId).update({liker:data.liker})
          
          // likeIcon.sx.color='green'
        }
       
        else{
          console.log('match');
          setLike(Like-1)
          setLikest({
            color:'ffc6c4'
          })
          arr = arr.filter(function(item) {
            return item !== user.displayName
        })
        db.collection('posts').doc(postId).update({liker:arr})
        
        }
       

       }
       
          
    });
})
 
     
  }
 

  const [openAdd, setOpenAdd] = React.useState(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
 

  useEffect(() => {
    // log
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              comment: doc.data(),
            }))
          );
        });
    }


  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  const deleteComment = (id) => {
    db.collection("posts").doc(postId).collection("comments").doc(id).delete();
  };

  const deletePost = () => {
    db.collection("posts").doc(postId).delete();
  };

  return (
    <div className="post">
      <div className="post__header">
        <div className="post__headerUser">
          <Avatar
            className="post__avatar"
            alt={username.toUpperCase()}
            src="/static/images/avatar/1.jpg"

          />
          <h3>{username}</h3>
        </div>
        {username === user?.displayName ? (
          <button className="post__deletePost" onClick={deletePost}>
            x
          </button>
        ) : (
          <div></div>
        )}
      </div>

      <img className="post__image" src={imgurl} alt="" />

      <h4 className="post__text">
         {/* <Button onClick={handleOpen}>ModeCommentIcon</Button> */}
        <strong>{username}: </strong>#instagram {caption}
      </h4>
      <div>
      <div className="likeComment">
        

      <div onClick={()=>doLike()} className="like">
      <FavoriteIcon sx={likest} className='likeIcon'></FavoriteIcon>
              <h3 className='likeCount'>{Like}</h3>
            </div>
          
      <div className="comment__icon">
              <ModeCommentIcon onClick={handleOpen}></ModeCommentIcon>
          </div>
          </div>
    
     
      <Modal
        open={open}
        onClose={handleClose}

      >

        <Box >
          <div className="comment__container">
            <h1 className='back__btn' onClick={() => setOpen(false)} >⇦</h1>
            <div className="post__comments">
              {comments.map(({ id, comment }) => (
                <div className="post__comment">
                  {comment.username === user?.displayName ? (
                    <button
                      className="post__deleteComment"
                      onClick={() => deleteComment(id)}
                    >
                      X
                    </button>

                  ) : (
                    <div></div>
                  )}
                  <p>
                    <strong>{comment.username}</strong> {comment.text}
                  </p>
                </div>
              ))}
            </div>

            {user && (
              <form className="post__commentBox">
                <input
                  type="text"
                  className="post__comment__input"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                <button
                  className="post__comment__button"
                  disabled={!comment}
                  type="submit"
                  onClick={postComment}
                >
                  Post
                </button>
              </form>
            )}
          </div>


        </Box>
      </Modal>

      </div>
          






    </div>
  );
}

export default Post;