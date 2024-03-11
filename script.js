const generateForm = document.querySelector(".generate-form");
const imageGallary = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "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";

let isImageGenerating = false;

const updateImageCard = (imgDataArray) => {
  imgDataArray.forEach((imgObject, index) => {
    const imgCard = imageGallary.querySelectorAll(".img-card")[index];
    const imgElement = imgCard.querySelector("img");
    const downloadBtn = imgCard.querySelector(".download-btn");

    //set the image source to the AI- generated image data
    const aiGeneratedImg = `data:imgage/jpeg;base64,${imgObject.b64_json}`;
    imgElement.src = aiGeneratedImg;

    //when the image is loaded, Remove the loading class and set download attribute.
    imgElement.onload = () => {
      imgCard.classList.remove("loading");
      downloadBtn.setAttribute("href", aiGeneratedImg);
      downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
    };
  });
};

const generateAiImages = async (userPrompt, userImageQuantity) => {
  try {
    // Send a request to the OpenAI API to generate images based on user inputs
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: userPrompt,
          n: parseInt(userImageQuantity),
          size: "512x512",
          response_format: "b64_json",
        }),
      },
    );

    if (!response.ok)
      throw new Error("Falied to generate image! Please try again.");
    const { data } = await response.json(); //Get a response
    updateImageCard([...data]);
  } catch (error) {
    alert(error.message);
  } finally {
    isImageGenerating = false;
  }
};

const handleFormSUbmission = (e) => {
  e.preventDefault();
  if (isImageGenerating) return;
  isImageGenerating = true;

  // Get user input and image quantity value from the form :
  const userPrompt = e.srcElement[0].value;
  const userImageQuantity = e.srcElement[1].value;

  // Creating HTML markup for image cards with loading state.
  const imgCardMarkUp = Array.from(
    { length: userImageQuantity },
    () =>
      `<div class="img-card loading">
        <img src="../assets/images/loader.svg" alt="image" />
        <a href="#" class="download-btn">
          <img src="../assets/images/download.svg" alt="download icon" />
        </a>
      </div>`,
  ).join("");

  imageGallary.innerHTML = imgCardMarkUp;
  generateAiImages(userPrompt, userImageQuantity);
};

generateForm.addEventListener("submit", handleFormSUbmission);
