import React, {useState,useEffect} from 'react'
import './App.css';
import { db, auth } from "./firebase";
import './index.css'
import Post from './Post'
import ImageUpload from './ImageUpload';
import { Box, Button,   Input,    Modal } from '@mui/material';
import './compontent/logIn/logIn.css'
import PostAddIcon from '@mui/icons-material/PostAdd';

function App() {

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  // const [openImageUpload, setOpenImageUpload] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState('raj');

  const [openAdd, setOpenAdd] = React.useState(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
   useEffect(()=>{
      db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>{
        setPosts(snapshot.docs.map(doc=>({
          id:doc.id,
          post:doc.data()
        }) ))
      })
    },[])
  

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((authUser) => {
        if (authUser) {
          // if user has logged in...
          setUser(authUser);
          
  
        } else {
          // if user has logged out... 
          setUser(null);
        }
        
      })
  
      return () => {
        // perform some cleanup actions
        unsubscribe();
      }
    }, []);



    const signUp = (event) => {

      // This is to prevent the page from refreshing when we submit the form
      event.preventDefault();
      auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.sendEmailVerification();
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));
  
      // Set user so that footer changes accordingly
      
  
      // Close modal
      setOpen(false);
    }
  
    const signIn = (event) => {
      event.preventDefault();
      auth
        .signInWithEmailAndPassword(email, password)
        .catch((error) => alert(error.message));
      
      // Close modal
      setOpenSignIn(false);
    }
 

  return (
    <div className="App">
      


    <Modal 
      open={open}
      onClose={()=> setOpen(false)}
                  >
        <div >
         <form className="form_div"> 
         <div>
            <label className='label' >Email</label>
            
              <Input
               className='field_class '
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e)=> setUsername(e.target.value)}
            />
           </div>
         <div>
            <label className='label' >Email</label>
            
              <Input
               className='field_class '
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
           </div>
          <div>
            <label className='label' >Passward</label>
            <Input
               className='field_class '
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
            
            <Button type="submit" onClick={signUp}
               className='field_class '>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div >
          <form className="form_div">
            <div className="
            "> <label className='label'>Email</label>
            <Input
            className='field_class '
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            /></div>
         <div>
            <label className='label'>Password</label>
            <Input
             className='field_class'
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
         </div>
           
            <Button type="submit" onClick={signIn}
             className='field_class'>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>
        <div className="app__logoutContainer"></div>
      
      
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/800px-Instagram_logo.svg.png?20160616034027"
          height="40px"
          alt=""
        />
        
         {/* add post  */}
          {
            user?.displayName ? (
              
              <div className="add__post__btn">
             <p  className="add__post__btn__B" onClick={handleOpenAdd}> <PostAddIcon sx={{ fontSize: 30 }}/> </p>  

              
<Modal
        open={openAdd}
        onClose={handleCloseAdd}
        
      >
        <Box >
          
          
<div id="addpost">
{user?.displayName ? (
    <ImageUpload  username={user.displayName}/>

      ): (
        <div></div>
      )}
</div>
          
        </Box>
      </Modal>
              </div>

            ):(
              <div></div>
            )
          }
      
        {user ? (
          <div className="app__logoutContainer">

<Button onClick={()=>auth.signOut()}>Log out</Button>
          </div>
        ) : (
          <div className="app__loginContainer">
            
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
           
          </div>
        )}
        
      
      </div>
 

   
        {/* {
          console.log(username)
        } */}
      <div className="app__posts">
      { 
        posts.map(({id,post})=>{
      //  console.log(post.timestamp.toDate());
        return(
        <Post
        
         key={id} 
        postId={id}
        username={post.username}
        posttimestamp={post.timestamp}
        
        user={user} 
        imgurl={post.imgurl} 
        caption={post.caption}
        likeCount={post.like}
        />)
      })
    }
      </div>
      


    </div>
  );
}

export default App;




