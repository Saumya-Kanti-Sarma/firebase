import React from 'react'
import { useState } from 'react'
import PhoneInput from 'react-phone-input-2'; // to create user-friendly phone number UI
import 'react-phone-input-2/lib/style.css'  // this is default styling for react-phone-input-2
import { auth, storage } from './firebase'
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"

const App = () => {
  const [phone, setPhone] = useState(""); // storing phonenumbers state
  const [image, setImage] = useState([]); // storing the images state before uploading it into firebase
  const [url, setUrl] = useState([]); // storing the urls of the image that is stored in firebase
  const [progress, setProgress] = useState(0); // tracking the upload progress

  // OTP sending function to send OTP into the provided phone-number (user have to generate billing account with firebase)
  const sentOtp = async () => {
    try {
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});  // generating captcha before sending OTP, it takes 3 params, 1. authentication that is imported from firebase.js, 2.  the id of an element that will show the captcha
      const conformation = await signInWithPhoneNumber(auth, phone, recaptcha); // this sends OTP to the provided phone-number 
      console.log(conformation);
    } catch (error) {
      console.log(error);
    }
  }

  // storing the list of image, onChange function
  const handleImageChange = (e) => {
    if (e.target.files) {
      //setImage(e.target.files[0]); this will target a single file
      setImage([...e.target.files]); // Store multiple selected images
    }
  };

  // uploading image to firebase, onClick function
  const handleUpload = () => {
    // to upload a single file 
    // if (image) {
    //   const storageRef = ref(storage, `images/${image.name}`);
    //   const uploadTask = uploadBytesResumable(storageRef, image);

    //   uploadTask.on('state_changed',
    //     (snapshot) => {
    //       // Progress can be monitored here if needed
    //     },
    //     (error) => {
    //       console.error("Upload failed:", error);
    //     },
    //     () => {
    //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //         setUrl(downloadURL);
    //       });
    //     }
    //   );
    // }

    // to upload an array of files
    const promises = []; // Create an array to track promises
    image.forEach((image) => {
      const storageRef = ref(storage, `images/${image.name}`); // creating a referance that stored two parameters 1. the location to save the image, 2. the path and image name 
      const uploadTask = uploadBytesResumable(storageRef, image); // uploading the image to the created referance

      promises.push(
        new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              // an algorithm to calculate and update upload progress
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              // console.log(`Upload is ${progress}% done`);
              setProgress(progress); // Update the progress state;
            },
            (error) => {
              console.error("Upload failed:", error);
              reject(error); // to prevent the app from crashing..
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setUrl((prevUrls) => [...prevUrls, downloadURL]); // Store each uploaded image URL
                resolve();
              });
            });
        }));
    });
    // Wait for all uploads to finish
    Promise.all(promises)
      .then(() => {
        // console.log("All images uploaded successfully!");
      })
      .catch((err) => console.error("Error uploading files:", err));
  };
  return (
    <div>
      <PhoneInput
        country={"in"}
        value={phone}
        onChange={(value) => {
          setPhone("+" + value); console.log("+" + value);
        }}
      />
      <button onClick={sentOtp}>send OTP</button>
      <div id='recaptcha'></div>

      <div>
        <input type="file" multiple onChange={handleImageChange} /> {/* Allow multiple image selection */}
        <button onClick={handleUpload}>Upload</button>
        <div>
          {url.map((url, index) => (
            <>
              <img key={index} src={url} alt={`Uploaded ${index}`} style={{ width: '200px' }} />
            </>

          ))}
        </div>
      </div>
      {/* Display the upload progress */}
      {progress > 0 && (
        <div>
          <progress value={progress} max="100" />
          <span>{Math.round(progress)}% uploaded</span>
        </div>
      )}

    </div>
  )
}

export default App

