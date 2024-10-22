import { useEffect, useRef, useState } from "react";

export default function PostForm({ savePost, post }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (post?.caption && post?.image) {
      // if post, set the states with values from the post object.
      // The post object is a prop, passed from UpdatePage
      setCaption(post.caption);
      setImage(post.image);
    }
  }, [post]); // useEffect is called every time post changes.

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

  function handleSubmit(event) {
    event.preventDefault();
    const formData = {
      // create a new objebt to store the value from states / input fields
      caption: caption,
      image: image
    };

    const validForm = formData.caption && formData.image; // will return false if one of the properties doesn't have a value
    if (validForm) {
      // if all fields/ properties are filled, then call savePost
      savePost(formData);
    } else {
      // if not, set errorMessage state.
      setErrorMessage("Please, fill in all fields.");
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label htmlFor="caption">Caption</label>
      <input
        id="caption"
        name="caption"
        type="text"
        value={caption}
        aria-label="caption"
        placeholder="Write a caption..."
        onChange={e => setCaption(e.target.value)}
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
        <button>Save</button>
      </div>
    </form>
  );
}
