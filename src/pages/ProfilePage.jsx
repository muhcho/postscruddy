import { signOut } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import UserPosts from "../components/UserPosts";
import { auth } from "../firebase-config";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const url = `${import.meta.env.VITE_FIREBASE_DB_URL}/users/${
    auth.currentUser?.uid
  }.json`;
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function getUser() {
      const response = await fetch(url);
      const userData = await response.json();

      if (userData) {
        // if userData exists set states with values from userData (data from firestore)
        setName(userData.name);
        setEmail(auth.currentUser?.email);
        setTitle(userData.title || "");
        setImage(userData.image);
      }
    }
    getUser();
  }, [url]); // dependencies: useEffect is executed when url changes

  async function handleSubmit(event) {
    event.preventDefault();

    const userToUpdate = { name, mail: email, title, image }; // create an object to hold the user to update properties
    console.log(userToUpdate);

    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(userToUpdate)
    });
    if (response.ok) {
      const data = await response.json();
      console.log("User updated: ", data);
    } else {
      console.log("Sorry, something went wrong");
    }
  }

  function handleSignOut() {
    signOut(auth); // sign out from firebase/auth
  }

  /**
   * handleImageChange is called every time the user chooses an image in the fire system.
   * The event is fired by the input file field in the form
   */
  function handleImageChange(event) {
    const file = event.target.files[0];
    if (file.size < 500000) {
      // image file size must be below 0,5MB
      const reader = new FileReader();
      reader.onload = event => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
      setErrorMessage(""); // reset errorMessage state
    } else {
      // if not below 0.5MB display an error message using the errorMessage state
      setErrorMessage("The image file is too big!");
    }
  }

  return (
    <section className="page">
      <div className="container">
        <h1>Profile</h1>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            name="name"
            placeholder="Type name"
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            name="email"
            placeholder="Type email"
            disabled
          />

          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            name="title"
            placeholder="Type your title"
          />

          <label htmlFor="image">Image</label>
          <img
            id="image"
            className="image-preview"
            src={
              image
                ? image
                : "https://placehold.co/600x400?text=Click+here+to+select+an+image"
            }
            alt="Choose"
            onError={e =>
              (e.target.src =
                "https://placehold.co/600x400?text=Error+loading+image")
            }
            onClick={() => fileInputRef.current.click()}
          />
          <input
            id="image-file"
            type="file"
            className="file-input hide"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
          />
          <div className="error-message">
            <p>{errorMessage}</p>
          </div>
          <div className="btns">
            <button>Save User</button>
          </div>
        </form>
        <div className="btns">
          <button className="btn-cancel" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>
      <h2>Posts</h2>
      <UserPosts uid={auth.currentUser?.uid} />
    </section>
  );
}
