import React, { useState, useEffect } from 'react'
import Avatar from '@mui/material/Avatar';
import './Post.css'
import { db } from "./firebase";
import firebase from 'firebase/compat/app';
import { Box,   Modal } from '@mui/material';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';

function Post({postId ,user , username, caption, imgurl, likeCount,posttimestamp }) {
  var style = {
    color: 'black'
  }
  const isLiked = () => {
    db.collection('posts').get().then((querySnapshot) => {

      querySnapshot.forEach(element => {
        var data = element.data();
        if (element.id === postId) {
          if (user) {
            if (data.liker.includes(user.displayName) === false) {
              setLikest({
                fontSize:35,
                color: '#ffc6c4'
              })

            }
            else {
              setLikest({
                fontSize: 35,
                color: 'red'
              })

            }
          }
          else {
            setLikest({
              fontSize: 35,
              color: '#ffc6c4'
            })
          }

        }
      }

      )
    }

    )
    return style
  }

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [open, setOpen] = React.useState(false);
  const [Like, setLike] = useState(likeCount)
  const handleOpen = () => setOpen(true);
  const [likest, setLikest] = useState(isLiked);
  const handleClose = () => setOpen(false);

  function doLike() {

    if (user) {

// list
      db.collection('posts').get().then((querySnapshot) => {
        querySnapshot.forEach(element => {
          var data = element.data();
          if (element.id === postId) {

            if (user && data.liker.includes(user.displayName) === false) {
             setLikest({
                fontSize: 35,
                color: 'red'
              })

              data.liker.push(user.displayName)
              db.collection('posts').doc(postId).update({ liker: data.liker })
              db.collection('posts').doc(postId).update({ like: Like + 1 })
           
              setLike(Like + 1)
            }

            else {
                 setLikest({
                fontSize: 35,
                color: '#ffc6c4'
              })
              var arr = data.liker;
              setLike(Like - 1)

              arr = arr.filter(function (item) {
                return item !== user.displayName
              })
              db.collection('posts').doc(postId).update({ liker: arr })
              db.collection('posts').doc(postId).update({ like: Like - 1 })
              console.log(Like - 1);
            }


          }


        });

      }

      )
    }
    else {
      alert("Please Login to Like");
    }

  }
 useEffect(() => {
    if (postId) {
      
      db
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
    const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
    var date=new Date(Date.now());
    if(posttimestamp)
     date=posttimestamp.toDate();
     else posttimestamp=Date(Date.now());
    const d=date.getDate();
  const m=   date.getMonth()
  const y=date.getFullYear();
   var time="";
   var timeDifference=new Date(Date.now()).getTime()-posttimestamp.toDate();
   if(timeDifference<60000){
    time="just now"
}
  else if(timeDifference<3600000){
      time=Math.floor((timeDifference)/60000)+" Min"
      if(Math.floor(timeDifference/60000)>1){
        time+="s"
      }
      time+=" ago"
  }
  else if(timeDifference<86400000){
    time=Math.floor(timeDifference/3600000)+" Hr"
    if(Math.floor(timeDifference/3600000)>1){
      time+="s"
    }
    time+=" ago"
  }
  else if(timeDifference<259200000){
    time=Math.floor(timeDifference/86400000)+" Day"
    if(Math.floor(timeDifference/86400000)>1){
      time+="s"
    }
    time+=" ago"
  }
  else {
  if(new Date(Date.now()).getFullYear()===posttimestamp.toDate().getFullYear()){
      time+=d+" "+monthNames[m]
  }
  else{
    time+=d+" "+monthNames[m]+" "+y;
  }
}
  return (
  
    <div className="post">
      <div className="post__header">
        <div className="post__headerUser">
          <Avatar
            className="post__avatar"
            alt={username.toUpperCase()}
            src="/static/images/avatar/1.jpg"

          />
          <div className="usernameTime">
                 <h3>{username}</h3>
                 {time}
          </div>
     
        </div>
        {username === user?.displayName ? (
          <button className="post__deletePost" onClick={deletePost}>
            x
          </button>
        ) : (
          <div></div>
        )}
      </div>

      <img onDoubleClick ={() => doLike()}  className="post__image" src={imgurl} alt="" />

      <h4  className="post__text">
        <strong>{username}: </strong>#instagram {caption}
      </h4>

      {user ? (
        <div className="">
        <div className="likeComment">

          <div onClick={() => doLike()} className="like">
           
            <FavoriteIcon sx={likest} className='likeIcon'></FavoriteIcon>


          </div>

          <div className="comment__icon">
            <ModeCommentOutlinedIcon sx={{fontSize:35}} onClick={handleOpen}></ModeCommentOutlinedIcon >
          </div>
          </div>

          <Modal
            open={open}
            onClose={handleClose}

          >

            <Box >
              <div className="comment__container">
                <h1 id='1' className='back__btn' onClick={() => setOpen(false)} >⇦</h1>
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
      ) : (
        <div></div>
      )}


      <h3 className='likeCount'>{Like} {Like<2?(<span>like</span>):(<span>likes</span>)}</h3>






    </div>
  );
}

export default Post;