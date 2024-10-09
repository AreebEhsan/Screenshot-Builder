import { useState } from 'react';
import APIForm from './components/APIForm';
import Gallery from './components/Gallery';
import './App.css';

function App() {
  const [inputs, setInputs] = useState({
    url: "",
    format: "",
    no_ads: "",
    no_cookie_banners: "",
    width: "",
    height: "",
  });

  const [currentImage, setCurrentImage] = useState(""); // State for current image
  const [prevImages, setPrevImages] = useState([]); // State for storing previous images

  // Helper function to reset the form after submission
  const reset = () => {
    setInputs({
      url: "",
      format: "",
      no_ads: "",
      no_cookie_banners: "",
      width: "",
      height: "",
    });
  };

  // Helper function to make API query string
  const makeQuery = () => {
    let wait_until = "network_idle";
    let response_type = "json";
    let fail_on_status = "400%2C404%2C500-511";
    let url_starter = "https://";
    let fullURL = url_starter + inputs.url;

    let query = `https://api.apiflash.com/v1/urltoimage?access_key=${import.meta.env.VITE_APP_ACCESS_KEY}&url=${fullURL}&format=${inputs.format}&width=${inputs.width}&height=${inputs.height}&no_cookie_banners=${inputs.no_cookie_banners}&no_ads=${inputs.no_ads}&wait_until=${wait_until}&response_type=${response_type}&fail_on_status=${fail_on_status}`;
    
    callAPI(query);
  };

  // Function to make the API call and handle the response
  const callAPI = async (query) => {
    try {
      const response = await fetch(query);
      const json = await response.json();

      if (json.url) {
        setCurrentImage(json.url); // Set the current image
        setPrevImages((images) => [...images, json.url]); // Add to previous images
        reset(); // Reset the form
      } else {
        alert("Failed to take a screenshot!"); // Handle case where no screenshot was returned
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Form submit handler
  const submitForm = () => {
    let defaultValues = {
      format: "jpeg",
      no_ads: "true",
      no_cookie_banners: "true",
      width: "1920",
      height: "1080",
    };

    if (inputs.url === "" || inputs.url.trim() === "") {
      alert("You forgot to submit a URL!");
    } else {
      for (const [key, value] of Object.entries(inputs)) {
        if (value === "") {
          inputs[key] = defaultValues[key];
        }
      }
      makeQuery(); // Create the query and make the API call
    }
  };

  return (
    <div className="App">
      <h1>Build Your Own Screenshot! 📸</h1>

      <APIForm
        inputs={inputs}
        handleChange={(e) =>
          setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value.trim(),
          }))
        }
        onSubmit={submitForm}
      />

      <br />

      {/* Display the screenshot if it exists */}
      {currentImage ? (
        <img
          className="screenshot"
          src={currentImage}
          alt="Screenshot returned"
        />
      ) : (
        <div> </div>
      )}

      {/* Display the query string for user reference */}
      <div className="container">
        <h3> Current Query Status: </h3>
        <p>
          https://api.apiflash.com/v1/urltoimage?access_key=ACCESS_KEY
          <br />
          &url={inputs.url} <br />
          &format={inputs.format} <br />
          &width={inputs.width}
          <br />
          &height={inputs.height}
          <br />
          &no_cookie_banners={inputs.no_cookie_banners}
          <br />
          &no_ads={inputs.no_ads}
        </p>
      </div>

      {/* Center the button in its own row */}
      <div className="button-container">
        <button className="button" onClick={submitForm}>
          Take that Pic! 🎞️
        </button>
      </div>

      {/* Add the gallery component to display previous screenshots */}
      <div className="container">
        <Gallery images={prevImages} />
      </div>
    </div>
  );
}

export default App;
