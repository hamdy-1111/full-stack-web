/* start user info */
  // Declare global variables
let actuallUserName = localStorage.getItem("actuallUserName") || '';
let actuallUserImage = localStorage.getItem("actuallUserImage") || 'user.png';

  // Function to open SweetAlert for user input
function openUserInputModal() {
    Swal.fire({
    title: 'Enter your Information',
    html:
        '<label for="swal-input-image" style="margin-bottom: 15px;">' +
        '<div id="image-preview-container">' +
        '<img id="uploaded-image" src="' + actuallUserImage + '" alt="Uploaded Image">' +
        '</div>' +
        '</label>' +
        '<input id="swal-input-image" type="file" class="swal2-input" accept="image/*">' +
        `<input id="swal-input-name" class="swal2-input" placeholder="User Name" value="${actuallUserName}" style="background-color: #1a1a1a; color: #fff; border: 1px solid #19c8fa;">` +
        '<input id="swal-input-id" class="swal2-input" placeholder="User ID" value="' + localStorage.getItem("userId") + '" style="background-color: #1a1a1a; color: #fff; border: 1px solid #19c8fa;">',
        background: '#1a1a1a', // Set the background color to a dark shade

    focusConfirm: false,
    preConfirm: () => {
        // Update global variables
        actuallUserName = document.getElementById("swal-input-name").value;
        const userId = document.getElementById("swal-input-id").value;
        actuallUserImage = document.getElementById("uploaded-image").src;

        localStorage.setItem("actuallUserName", actuallUserName);
        localStorage.setItem("userId", userId);
        localStorage.setItem("actuallUserImage", actuallUserImage);
    },
    didOpen: () => {
        const imageInput = document.getElementById("swal-input-image");
        const uploadedImage = document.getElementById("uploaded-image");

        imageInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
            uploadedImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
        });
    }
    }).then((result) => {
      // Your then logic here
    const userId = localStorage.getItem("userId");

    console.log("User Name:", actuallUserName);
    console.log("User ID:", userId);
    console.log("User Image:", actuallUserImage);

      // Update the content of the <p> element
    document.getElementById("user-name").textContent = actuallUserName;
    document.getElementById("user-image").src = actuallUserImage;
    });
}

  // Call the function to open the modal
openUserInputModal();
/* end user info */



/* start makePost */
        // Load posts from localStorage when the page loads
    window.addEventListener('load', function () {
        loadPosts();
    });

function loadPosts() {
    // Retrieve existing posts from localStorage
    var existingPosts = JSON.parse(localStorage.getItem('posts')) || [];

    // Loop through existing posts and create them on the page
    existingPosts.forEach(function (postData) {
        createPostFromData(postData);
    });
}


function createPostFromData(postData) {
    // Clone the template post
    var templatePost = document.getElementById("templatePost");
    var newPost = templatePost.cloneNode(true);

    // Set the unique ID for the new post
    newPost.setAttribute("id", postData.postId);

    // Display the new post
    newPost.style.display = "block";

    // Set the content of the new post's text element
    var makingPostText = newPost.querySelector(".text");
    makingPostText.textContent = postData.userInput;

    // Set the content of the new post's feeling element
    var newFeeling = newPost.querySelector(".fealing");
    newFeeling.innerHTML = `${postData.feeling}`;

    // Set the content of the new post's user name element
    var userName = newPost.querySelector(".user-name");
    userName.textContent = postData.actuallUserName;

    // Set the content of the new post's user image element
    var userImage = newPost.querySelector(".user-image");
    userImage.src = postData.actuallUserImage;

    // Create a new media container in the new post
    var newMediaContainer = document.createElement("div");
    newMediaContainer.className = "media";

    // Append images from the image container
    postData.images.forEach(function (imgSrc) {
        var img = document.createElement("img");
        img.src = imgSrc;
        newMediaContainer.appendChild(img);
    });

    // Append videos from the video container
    postData.videos.forEach(function (videoSrc) {
        var video = document.createElement("video");
        video.src = videoSrc;
        newMediaContainer.appendChild(video);
    });

    // Append the new media container to the new post
    newPost.querySelector(".content").appendChild(newMediaContainer);

    // Append the new post to the document
    document.body.appendChild(newPost);

    // Set up reactions for the new post
    setupReactions(newPost);

    // Set up the comment section for the new post
    var newCommentIcon = newPost.querySelector('.fa-regular.fa-comment');
    newCommentIcon.addEventListener('click', function () {
        toggleCommentSection(newCommentIcon);
    });

    // Add the soundButton class and data-sound attribute to the angry face icon
    var newAngryFaceIcon = newPost.querySelector('.fa-regular.fa-face-angry');
    newAngryFaceIcon.classList.add('soundButton');
    newAngryFaceIcon.setAttribute('data-sound', 'angrySound');

    // Add the soundButton class and data-sound attribute to the heart icon
    var newHeartIcon = newPost.querySelector('.fa-regular.fa-heart');
    newHeartIcon.classList.add('soundButton');
    newHeartIcon.setAttribute('data-sound', 'loveSound');

    // Add event listener to the heart icon for playing the sound
    newHeartIcon.addEventListener('click', function () {
        var soundId = this.getAttribute('data-sound');
        playSound(soundId);
    });

    // Add event listener to the angry face icon for playing the sound
    newAngryFaceIcon.addEventListener('click', function () {
        var soundId = this.getAttribute('data-sound');
        playSound(soundId);
    });

    function playSound(soundId) {
        var audio = document.getElementById(soundId);
        if (audio) {
            audio.play();
        }
    }

    // Add the soundButton class and data-sound attribute to the thumbs up icon
    var newThumbsUpIcon = newPost.querySelector('.fa-regular.fa-thumbs-up');
    newThumbsUpIcon.classList.add('soundButton');
    newThumbsUpIcon.setAttribute('data-sound', 'likeSound');

    // Add event listener to the thumbs up icon for playing the sound
    newThumbsUpIcon.addEventListener('click', function () {
        var soundId = this.getAttribute('data-sound');
        playSound(soundId);
    });

        // Add the soundButton class and data-sound attribute to the thumbs up icon
    var trashIcon = newPost.querySelector('.fa-solid.fa-trash-can');
    trashIcon.classList.add('soundButton');
    trashIcon.setAttribute('data-sound', 'deleteSound');

    // Add event listener to the thumbs up icon for playing the sound
    trashIcon.addEventListener('click', function () {
        var soundId = this.getAttribute('data-sound');
        playSound(soundId);
    });

    // Reset comment section display
    var newCommentSection = newPost.querySelector(".comment-section");
    var newCommentsContainer = newPost.querySelector(".comments-container");
    newCommentSection.style.display = "none";
    newCommentsContainer.style.display = "none";
}

function makePost() {
    // Clone the template post
    var templatePost = document.getElementById("templatePost");
    var newPost = templatePost.cloneNode(true);

    // Set a unique ID for the new post
    var postId = "post" + new Date().getTime();
    newPost.setAttribute("id", postId);

    // Display the new post
    newPost.style.display = "block";

    // Get the user input from the makingPost-text input
    var userInput = document.getElementById("makingPost-text").value.trim();
    if (userInput === "") {
        // Use SweetAlert2 with dark theme for a visually appealing alert
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please enter some text before making a post.',
            background: '#1a1a1a', // Set the background color to a dark shade
            confirmButtonColor: '#3085d6', // Set the confirm button color
            iconColor: '#ffcc00', // Set the icon color
            customClass: {
                container: 'dark-container', // Add a custom class for additional styling
            },
        });

        return;
    }

    // Set the content of the new post's text element
    var makingPostText = newPost.querySelector(".text");
    makingPostText.textContent = userInput;

    // Set the content of the new post's user name element
    var userName = newPost.querySelector(".user-name");
    userName.textContent = actuallUserName;

    // Set the content of the new post's user image element
    var userImage = newPost.querySelector(".user-image");
    userImage.src = actuallUserImage;

    // Store actuallUserImage and actuallUserName in the post's data
    newPost.dataset.actuallUserName = actuallUserName;
    newPost.dataset.actuallUserImage = actuallUserImage;

    // Get the feeling from the original feeling element
    var originalFeeling = document.getElementById("feelingCaption").innerHTML;

    // Translate feeling to emoji only if there is a valid feeling
    var emoji = originalFeeling.trim() !== "I feel" ? translateFeelingToEmoji(originalFeeling) : '';

    // Set the content of the new post's feeling element
    var newFeeling = newPost.querySelector(".fealing");
    newFeeling.innerHTML = `${emoji} ${originalFeeling}`;

    // Check for uploads
    var imageContainer = document.getElementById("imageContainer");
    var videoContainer = document.getElementById("videoContainer");

    // Create a new media container in the new post
    var newMediaContainer = document.createElement("div");
    newMediaContainer.className = "media";

    // Append images from the image container
    imageContainer.querySelectorAll("img").forEach(function (img) {
        var clonedImage = img.cloneNode(true);
        newMediaContainer.appendChild(clonedImage);
    });

    // Append videos from the video container
    videoContainer.querySelectorAll("video").forEach(function (video) {
        var clonedVideo = video.cloneNode(true);
        newMediaContainer.appendChild(clonedVideo);
    });

    

    // Append the new media container to the new post
    newPost.querySelector(".content").appendChild(newMediaContainer);

    // Append the new post to the document
    document.body.appendChild(newPost);

    // Store the post in localStorage
    storePost(postId, userInput, originalFeeling, imageContainer, videoContainer, actuallUserName, actuallUserImage);

    // Reset input values after making a post
    resetInputValues();

    // Set up reactions for the new post
    setupReactions(newPost);
    clearFileContainer();

    // Set up the comment section for the new post
    var newCommentIcon = newPost.querySelector('.fa-regular.fa-comment');
    newCommentIcon.addEventListener('click', function () {
        toggleCommentSection(newCommentIcon);
    });
    newCommentIcon.classList.add('soundButton');
    newCommentIcon.setAttribute('data-sound', 'likeSound');
    newCommentIcon.addEventListener('click', function () {
        var soundId = this.getAttribute('data-sound');
        playSound(soundId);
    });
    // Add the soundButton class and data-sound attribute to the angry face icon
    var newAngryFaceIcon = newPost.querySelector('.fa-regular.fa-face-angry');
    newAngryFaceIcon.classList.add('soundButton');
    newAngryFaceIcon.setAttribute('data-sound', 'likeSound');

    // Add the soundButton class and data-sound attribute to the heart icon
    var newHeartIcon = newPost.querySelector('.fa-regular.fa-heart');
    newHeartIcon.classList.add('soundButton');
    newHeartIcon.setAttribute('data-sound', 'likeSound');

    // Add event listener to the heart icon for playing the sound
    newHeartIcon.addEventListener('click', function () {
        var soundId = this.getAttribute('data-sound');
        playSound(soundId);
    });

        // Add the soundButton class and data-sound attribute to the thumbs up icon
    var newThumbsUpIcon = newPost.querySelector('.fa-regular.fa-thumbs-up');
    newThumbsUpIcon.classList.add('soundButton');
    newThumbsUpIcon.setAttribute('data-sound', 'likeSound');

    // Add event listener to the thumbs up icon for playing the sound
    newThumbsUpIcon.addEventListener('click', function () {
        var soundId = this.getAttribute('data-sound');
        playSound(soundId);
    });
    
    // Add the soundButton class and data-sound attribute to the thumbs up icon
    var trashIcon = newPost.querySelector('.fa-solid.fa-trash-can');
    trashIcon.classList.add('soundButton');
    trashIcon.setAttribute('data-sound', 'deleteSound');

    // Add event listener to the thumbs up icon for playing the sound
    trashIcon.addEventListener('click', function () {
        var soundId = this.getAttribute('data-sound');
        playSound(soundId);
    });

    function playSound(soundId) {
        var audio = document.getElementById(soundId);
        if (audio) {
            audio.play();
        }
    }

    // Add event listener to the angry face icon for playing the sound
    newAngryFaceIcon.addEventListener('click', function () {
        var soundId = this.getAttribute('data-sound');
        playSound(soundId);
    });
    resetFeelingCaption();

    // Reset comment section display
    var newCommentSection = newPost.querySelector(".comment-section");
    var newCommentsContainer = newPost.querySelector(".comments-container");
    newCommentSection.style.display = "none";
    newCommentsContainer.style.display = "none";
            // After successful post, show SweetAlert
Swal.fire({
    title: 'Posted Successfully',
    icon: 'success',
    showConfirmButton: false,
    timer: 1200, // Adjust the timer as needed
    background: '#1a1a1a', // Set the background color to a dark shade
    iconColor: '#28a745', // Set the icon color
    text: 'Your post has been successfully submitted!', // Add a descriptive text
    padding: '2rem', // Increase padding for better visibility
});

}

function clearFileContainer() {
    // Get the file container element dynamically
    var fileContainer = document.querySelector('.file-container');
    var videoContainer = document.getElementById('videoContainer');

    // Clear the contents of the file container
    fileContainer.innerHTML = '';
    videoContainer.innerHTML = '';
}


function resetInputValues() {
    // Reset text input value
    document.getElementById("makingPost-text").value = "";

    // Reset file inputs for photos
    var photoUpload = document.getElementById("photoUpload");
    var newPhotoUpload = photoUpload.cloneNode(true);
    photoUpload.parentNode.replaceChild(newPhotoUpload, photoUpload);

    // Reset file inputs for videos
    var videoUpload = document.getElementById("videoUpload");
    var newVideoUpload = videoUpload.cloneNode(true);
    videoUpload.parentNode.replaceChild(newVideoUpload, videoUpload);
}

    function toggleTrashIcon(trashIcon) {
        var post = trashIcon.closest('.manshor');
        post.remove();
        // Optionally, you might want to remove the post from localStorage as well
        removePostFromStorage(post.id);
    }

    function toggleCommentSection(commentIcon) {
        var newCommentSection = commentIcon.parentElement.parentElement.querySelector(".comment-section");
        var newCommentsContainer = commentIcon.parentElement.parentElement.querySelector(".comments-container");

        if (newCommentSection.style.display === "none" || newCommentSection.style.display === "") {
            newCommentSection.style.display = "block";
            newCommentsContainer.style.display = "block";
        } else {
            newCommentSection.style.display = "none";
            newCommentsContainer.style.display = "none";
        }
    }

    function translateFeelingToEmoji(feeling) {
        const emojiMapping = {
            'happy': '😊',
            'sad': '😢',
            'angry': '😠',
            'surprised': '😲',
            'laughing': '😄',
            'confused': '😕',
            'love': '❤️',
            'ok': '👍',
            'not ok': '👎',
            'cool': '😎',
            'celebration': '🎉',
            'thinking': '🤔',
            'sleepy': '😴',
            'excited': '😃',
            'shocked': '😱',
            'nerd': '🤓',
            'worried': '😟',
            'bored': '😑',
            'grinning': '😁',
            'clapping': '👏',
            'facepalm': '🤦‍♂️',
            'sunglasses': '😎',
            'fire': '🔥',
            'money': '💰',
            'robot': '🤖',
            'unicorn': '🦄',
            'pizza': '🍕',
            'coffee': '☕',
            'taco': '🌮',
            'cake': '🍰',
            'soccer': '⚽',
            'music': '🎵',
            'book': '📚',
            'film': '🎬',
            'guitar': '🎸',
            'surfing': '🏄‍♂️',
            'gaming': '🎮',
            'meditation': '🧘‍♂️',
            'boxing': '🥊',
            'karaoke': '🎤',
            'painting': '🎨',
            'basketball': '🏀',
            'rocket': '🚀',
            'earth': '🌍',
            'rainbow': '🌈',
            'moon': '🌙',
            'sun': '☀️',
            'cloud': '☁️',
            'thumbsUp': '👍',
            'thumbsDown': '👎',
            'heart': '❤️',
            'brokenHeart': '💔',
            'poop': '💩',
            'ghost': '👻',
            'alien': '👽',
            'camera': '📷',
            'microphone': '🎤',
            'telephone': '☎️',
            'bomb': '💣',
            'trafficLight': '🚦',
            'hammer': '🔨',
            'key': '🔑',
            'lock': '🔒',
            'unlock': '🔓',
            'gear': '⚙️',
            'hourglass': '⌛',
            'snowflake': '❄️',
            'umbrella': '☔',
            'santa': '🎅',
            'christmasTree': '🎄',
            'fireworks': '🎆',
            'birthday': '🎂',
            // Add more mappings as needed
        };


        return emojiMapping[feeling.toLowerCase()] || feeling;
    }

function storePost(postId, userInput, feeling, imageContainer, videoContainer, actuallUserName, actuallUserImage) {
    // Retrieve existing posts from localStorage
    var existingPosts = JSON.parse(localStorage.getItem('posts')) || [];

    // Add the new post data
    var newPostData = {
        postId: postId,
        userInput: userInput,
        feeling: feeling,
        images: Array.from(imageContainer.querySelectorAll("img")).map(img => img.src),
        videos: Array.from(videoContainer.querySelectorAll("video")).map(video => video.src),
        actuallUserName: actuallUserName,
        actuallUserImage: actuallUserImage
    };

    // Add the new post data to the existing posts
    existingPosts.push(newPostData);

    // Save the updated posts back to localStorage
    localStorage.setItem('posts', JSON.stringify(existingPosts));
}



    function removePostFromStorage(postId) {
        // Retrieve existing posts from localStorage
        var existingPosts = JSON.parse(localStorage.getItem('posts')) || [];

        // Remove the post with the given postId
        var updatedPosts = existingPosts.filter(post => post.postId !== postId);

        // Save the updated posts back to localStorage
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
    }
/* end makePost */



/* start makeComment */
    // Function to toggle the display of the comment section
    function toggleCommentSection(commentIcon) {
        var newPost = commentIcon.closest('.manshor');
        var commentSection = newPost.querySelector(".comment-section");
        var commentsContainer = newPost.querySelector(".comments-container");

        if (commentSection.style.display === "none" || commentSection.style.display === "") {
            commentSection.style.display = "block";
            commentsContainer.style.display = "block";
        } else {
            commentSection.style.display = "none";
            commentsContainer.style.display = "none";
        }
    }

    // Function to add a new comment
    function addComment(commentIcon) {
        var newPost = commentIcon.closest('.manshor');
        var commentInput = newPost.querySelector(".comment-section #commentInput");
        var commentText = commentInput.value;
        if (commentText.trim() !== "") {
            // Create a new comment element
            var newComment = document.createElement("div");
            newComment.className = "comment";

            // Create the user information structure
            var userInfo = document.createElement("div");
            userInfo.className = "user-info";

            var userImage = document.createElement("img");
            userImage.src = actuallUserImage;
            userImage.alt = "User Image";

            var userName = document.createElement("p");
            userName.textContent = actuallUserName; // You may want to replace this with the actual user's name

            userInfo.appendChild(userImage);
            userInfo.appendChild(userName);

            newComment.appendChild(userInfo);

            // Create comment text element
            var commentTextElement = document.createElement("p");
            commentTextElement.textContent = commentText;

            newComment.appendChild(commentTextElement);

            // Create heart icon and delete button
            var heartIcon = document.createElement("i");
            heartIcon.className = "fa-regular fa-heart";
            heartIcon.addEventListener("click", function() {
                toggleHeartIcon(heartIcon);
            });

            var deleteIcon = document.createElement("i");
            deleteIcon.className = "fa-solid fa-trash-can";
            deleteIcon.addEventListener("click", function() {
                newComment.remove();
                saveCommentsToLocalStorage(newPost); // Update local storage when a comment is deleted
            });

            newComment.appendChild(heartIcon);
            newComment.appendChild(deleteIcon);

            // Append the new comment to the comments container
            var commentsContainer = newPost.querySelector(".comments-container");
            commentsContainer.appendChild(newComment);

            // Save comments to local storage
            saveCommentsToLocalStorage(newPost);

            // Clear the input field
            commentInput.value = "";
        }
    }

    // Function to toggle the heart icon
    function toggleHeartIcon(heartIcon) {
        if (heartIcon.classList.contains("fa-regular")) {
            heartIcon.classList.remove("fa-regular");
            heartIcon.classList.add("fa-solid");
        } else {
            heartIcon.classList.remove("fa-solid");
            heartIcon.classList.add("fa-regular");
        }
    }

    // Function to handle key events in the comment input field
    function handleCommentInputKey(event, commentIcon) {
        if (event.key === "Enter") {
            // Call the addComment function when Enter key is pressed
            addComment(commentIcon);
            event.preventDefault(); // Prevent the default Enter key behavior (e.g., newline in the input field)
        }
    }

    // Function to save comments to local storage
    function saveCommentsToLocalStorage(newPost) {
        var commentsContainer = newPost.querySelector(".comments-container");
        var comments = [];

        // Iterate through each comment and save the data
        var commentElements = commentsContainer.querySelectorAll(".comment");
        commentElements.forEach(function(commentElement) {
            var userImage = commentElement.querySelector(".user-info img").src;
            var userName = commentElement.querySelector(".user-info p").textContent;
            var commentText = commentElement.querySelector("p").textContent;

            comments.push({
                userImage: userImage,
                userName: userName,
                commentText: commentText
            });
        });

        // Save the comments array to local storage
        localStorage.setItem("comments_" + newPost.id, JSON.stringify(comments));
    }

    // Function to load comments from local storage
    function loadCommentsFromLocalStorage(newPost) {
        var commentsContainer = newPost.querySelector(".comments-container");
        var savedComments = localStorage.getItem("comments_" + newPost.id);

        if (savedComments) {
            var comments = JSON.parse(savedComments);

            // Clear the existing comments
            commentsContainer.innerHTML = "";

            // Create comment elements and append to the comments container
            comments.forEach(function(comment) {
                var newComment = document.createElement("div");
                newComment.className = "comment";

                // Create the user information structure
                var userInfo = document.createElement("div");
                userInfo.className = "user-info";

                var userImage = document.createElement("img");
                userImage.src = comment.userImage;
                userImage.alt = "User Image";

                var userName = document.createElement("p");
                userName.textContent = comment.userName;

                userInfo.appendChild(userImage);
                userInfo.appendChild(userName);

                newComment.appendChild(userInfo);

                // Create comment text element
                var commentTextElement = document.createElement("p");
                commentTextElement.textContent = comment.commentText;

                newComment.appendChild(commentTextElement);

                // Create heart icon and delete button
                var heartIcon = document.createElement("i");
                heartIcon.className = "fa-regular fa-heart";
                heartIcon.addEventListener("click", function() {
                    toggleHeartIcon(heartIcon);
                });

                var deleteIcon = document.createElement("i");
                deleteIcon.className = "fa-solid fa-trash-can";
                deleteIcon.addEventListener("click", function() {
                    newComment.remove();
                    saveCommentsToLocalStorage(newPost); // Update local storage when a comment is deleted
                });

                newComment.appendChild(heartIcon);
                newComment.appendChild(deleteIcon);

                // Append the new comment to the comments container
                commentsContainer.appendChild(newComment);
            });
        }
    }
    // Call this function to load comments when the page is loaded
    window.addEventListener("load", function() {
        var posts = document.querySelectorAll('.manshor');
        posts.forEach(function(post) {
            loadCommentsFromLocalStorage(post);
        });
    });
/* end makeComment */



/* start fealing button */
document.addEventListener('DOMContentLoaded', function () {
    var feelingButton = document.getElementById('feelingButton');
    var feelingIcon = document.getElementById('feelingIcon');
    var feelingCaption = document.getElementById('feelingCaption');

    feelingButton.addEventListener('click', function () {
        // Show custom input prompt using Swal
        Swal.fire({
            title: 'How u feel?',
            input: 'text',
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                // Translate the feeling to emoji using Emoji Intuition API (replace with your actual API)
                translateFeelingToEmoji(result.value);
            }
        });
    });

    function translateFeelingToEmoji(feeling) {
        // Implement your logic here to translate feeling to emoji (replace with actual implementation)
        // You can use an API or any other method to get the corresponding emoji based on the feeling.
        // For simplicity, I'm using a static mapping. Replace this with your actual implementation.
const emojiMapping = {
    'happy': '😊',
    'sad': '😢',
    'angry': '😠',
    'surprised': '😲',
    'laughing': '😄',
    'confused': '😕',
    'love': '❤️',
    'ok': '👍',
    'not ok': '👎',
    'cool': '😎',
    'celebration': '🎉',
    'thinking': '🤔',
    'sleepy': '😴',
    'excited': '😃',
    'shocked': '😱',
    'nerd': '🤓',
    'worried': '😟',
    'bored': '😑',
    'grinning': '😁',
    'clapping': '👏',
    'facepalm': '🤦‍♂️',
    'sunglasses': '😎',
    'fire': '🔥',
    'money': '💰',
    'robot': '🤖',
    'unicorn': '🦄',
    'pizza': '🍕',
    'coffee': '☕',
    'taco': '🌮',
    'cake': '🍰',
    'soccer': '⚽',
    'music': '🎵',
    'book': '📚',
    'film': '🎬',
    'guitar': '🎸',
    'surfing': '🏄‍♂️',
    'gaming': '🎮',
    'meditation': '🧘‍♂️',
    'boxing': '🥊',
    'karaoke': '🎤',
    'painting': '🎨',
    'basketball': '🏀',
    'rocket': '🚀',
    'earth': '🌍',
    'rainbow': '🌈',
    'moon': '🌙',
    'sun': '☀️',
    'cloud': '☁️',
    'thumbsUp': '👍',
    'thumbsDown': '👎',
    'heart': '❤️',
    'brokenHeart': '💔',
    'poop': '💩',
    'ghost': '👻',
    'alien': '👽',
    'camera': '📷',
    'microphone': '🎤',
    'telephone': '☎️',
    'bomb': '💣',
    'trafficLight': '🚦',
    'hammer': '🔨',
    'key': '🔑',
    'lock': '🔒',
    'unlock': '🔓',
    'gear': '⚙️',
    'hourglass': '⌛',
    'snowflake': '❄️',
    'umbrella': '☔',
    'santa': '🎅',
    'christmasTree': '🎄',
    'fireworks': '🎆',
    'birthday': '🎂',
    // Add more mappings as needed
};


        // Check if the entered feeling has a corresponding emoji
        if (emojiMapping.hasOwnProperty(feeling.toLowerCase())) {
            const emoji = emojiMapping[feeling.toLowerCase()];

            // Update the feeling icon and caption
            feelingIcon.innerHTML = emoji;
            feelingCaption.innerHTML = feeling;

            // You can also handle storing or using the selected feeling and emoji as needed
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to translate feeling to emoji!',
            });
        }
    }
});
function resetFeelingCaption() {
    // Set the feeling caption content to its default state
    document.getElementById("feelingCaption").innerHTML = '<i class="fa-regular fa-face-smile" style="color:#f7b928;"></i> I feel';
    document.getElementById("feelingIcon").innerHTML = '';
}
/* end fealing button */




/* start uploads  */
document.addEventListener('DOMContentLoaded', function () {
    var photoUploadInput = document.getElementById('photoUpload');
    var photoContainer = document.querySelector('.uploads');

    // Function to handle image deletion
    function deleteImage(imgElement) {
        imgElement.remove();
    }

    // Function to handle file uploads
    function handleFileUpload(files) {
        // Loop through selected files
        for (var i = 0; i < files.length; i++) {
            var selectedFile = files[i];

            // Create a FileReader to read the file
            var reader = new FileReader();

            // Set up the FileReader onload event
            reader.onload = function (event) {
                // Create a new media container
                var mediaContainer = document.createElement('div');
                mediaContainer.classList.add('media-container');

                // Create a delete button
                var deleteButton = document.createElement('i');
                deleteButton.classList.add('fa-solid', 'fa-trash-can', 'delete-button');
                deleteButton.addEventListener('click', function () {
                    deleteImage(mediaContainer);
                });

                // Create a new media element (image or video)
                var mediaElement = document.createElement(selectedFile.type.startsWith('video/') ? 'video' : 'img');
                mediaElement.src = URL.createObjectURL(selectedFile);

                // Set controls for video
                if (selectedFile.type.startsWith('video/')) {
                    mediaElement.controls = true;
                }

                // Append the delete button and the media element to the media container
                mediaContainer.appendChild(mediaElement);
                mediaContainer.appendChild(deleteButton);

                // Append the media container to the photo container
                photoContainer.appendChild(mediaContainer);
            };

            // Read the selected file as a data URL
            reader.readAsDataURL(selectedFile);
        }
    }

    // Listen for changes in the file input
    photoUploadInput.addEventListener('change', function () {
        // Call the handleFileUpload function with the selected files
        handleFileUpload(photoUploadInput.files);

        // Clear the file input after processing
        photoUploadInput.value = '';
    });

    // Trigger file input click when the "Photo" icon is clicked
    var photoIcon = document.querySelector('.makingPost-sache i.fa-image');
    photoIcon.addEventListener('click', function () {
        photoUploadInput.click();
    });
});

// Function to handle image or video uploads
function handleFileUpload(files, containerId) {
    var container = document.getElementById(containerId);

    // Iterate through each file
    for (var i = 0; i < files.length; i++) {
        var file = files[i];

        // Create a new media preview element (image or video)
        var mediaPreview = document.createElement(file.type.startsWith('video/') ? 'video' : 'img');
        mediaPreview.src = URL.createObjectURL(file);

        // Set controls for video
        if (file.type.startsWith('video/')) {
            mediaPreview.controls = true;
        }

        // Create a delete button for the media
        var deleteButton = document.createElement('i');
        deleteButton.className = 'fa-solid fa-trash-can delete-icon';
        deleteButton.addEventListener('click', function () {
            // Remove the media preview and delete button
            container.removeChild(mediaPreview);
            container.removeChild(this);
        });

        // Append the media preview and delete button to the container
        container.appendChild(mediaPreview);
        container.appendChild(deleteButton);
    }
}
/* end uploads */





/* start reacts color */
function setupReactions(post) {
    var icons = post.querySelectorAll('.manshor-reacts i');

    icons.forEach(function (icon) {
        icon.addEventListener('click', function () {
            // Check if the clicked icon is already in the solid state
            var isSolid = icon.classList.contains('fa-solid');

            // Remove 'fa-solid' class from all icons within the specific post
            icons.forEach(function (otherIcon) {
                otherIcon.classList.remove('fa-solid');
                otherIcon.classList.add('fa-regular');
            });

            // Toggle between regular and solid icons for the clicked icon
            if (!isSolid) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
            }
        });
    });
}
/* end reacts color */





/* start sound effects */
document.addEventListener('DOMContentLoaded', function () {
    // Get all elements with the class 'soundButton' and set up event listeners
    var buttons = document.querySelectorAll('.soundButton');
    buttons.forEach(function (button) {
        button.addEventListener('click', function (event) {
            var soundId = this.getAttribute('data-sound');

            // Check if the element has the 'fileLink' class
            var isFileLink = button.classList.contains('fileLink');

            // Play sound if soundId is defined
            if (soundId) {
                if (isFileLink) {
                    event.preventDefault(); // Prevent the default behavior of the link for file links
                    playSound(soundId);

                    // Continue with the default behavior after a delay (e.g., 500 milliseconds)
                    setTimeout(function () {
                        window.location.href = button.getAttribute('href');
                    }, 500);
                } else {
                    playSound(soundId); // Play sound without preventing the default behavior for regular links
                }
            }
            // Your other functionality here
        });
    });
    function playSound(soundId) {
        var audio = document.getElementById(soundId);
        if (audio) {
            audio.play();
        }
    }
});
/* end sound effects */







/* start header div */
    document.addEventListener('DOMContentLoaded', function () {
    var scrollingHeader = document.querySelector('.scrolling-header');
    var header = document.querySelector('.header');

    window.addEventListener('scroll', function () {
        var scrollPosition = window.scrollY;

        if (scrollPosition > 50) {
            scrollingHeader.classList.add('navbar-scrolled');
            scrollingHeader.style.display = 'none';

            // Calculate the adjusted top value for the .header div
            var adjustedTop = Math.max(0, 97 - Math.floor(scrollPosition / 2) * 2);
            header.style.top = adjustedTop + 'px';
        } else {
            scrollingHeader.classList.remove('navbar-scrolled');
            header.style.top = '97px'; /* Initial top value for the .header div */
            scrollingHeader.style.display = 'block';
        }
    });
});
/* end header div */








/* start header list */
        document.addEventListener('DOMContentLoaded', function () {
            var toggleButton = document.getElementById('toggle-menu');
            var myList = document.getElementById('myList');

            // Toggle the "active" class to control visibility when the button is clicked
            toggleButton.addEventListener('click', function () {
                myList.classList.toggle('active');
            });

            // Close the list when clicking anywhere outside of it
            document.addEventListener('click', function (event) {
                var isClickInside = myList.contains(event.target) || toggleButton.contains(event.target);

                if (!isClickInside) {
                    myList.classList.remove('active');
                }
            });
        });
/* end header list */







