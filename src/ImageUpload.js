 import { Button } from '@mui/material'
import React,{useState} from 'react'
import {storage,db} from './firebase'
import firebase from 'firebase/compat/app';
import './imageUpload.css'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
function ImageUpload({username}) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState("");
  
    const handleChange = (e) => {
      if (e.target.files[0]) {
        setImage(e.target.files[0]);
      }
    };
  
    const handleUpload = () => {
      // const uploadTask = storage.ref(`images/${image.name}`).put(image);
      const storageRef = ref(storage, `/images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          // complete function
          getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => {
              db.collection("posts").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption: caption,
                imgurl: url,
                username: username,
                like:0,
                liker:[]
              });
              setProgress(0);
              setCaption("");
              setImage(null);
            });
        }
      );
    };
  
   return (
     <div className='uplaod__post__div'>
     
        <input className='caption' type="text" placeholder='Enter a caption...' onChange={event=>setCaption(event.target.value)} value={caption}/>
        <input type="file" onChange={handleChange}/>
        <Button className='choose' onClick={handleUpload}>Upload </Button> 
        <br />
        <progress className="imageUpload__progress" value={progress} max="100" />
     </div>
   )
 }
 
 export default ImageUpload


 