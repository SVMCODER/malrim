var firebaseConfig = {
  apiKey: "AIzaSyCOA_2bf_b1o1nXSHZO5Re5DjSD66Pa6MY",
  authDomain: "https://raona0-default-rtdb.firebaseio.com",
  projectId: "raona0",
  storageBucket: "raona0.appspot.com",
  messagingSenderId: "797719983777",
  appId: "1:797719983777:web:d7ffca1316891b51ec62e0"
};
// Initialize Firebase (Replace these credentials with your own)
firebase.initializeApp(firebaseConfig);

// Function to format the timestamp into a relative time difference
function formatTimestamp(timestamp) {
  const messageDate = new Date(timestamp);
  const currentDate = new Date();

  const timeDifference = currentDate.getTime() - messageDate.getTime();
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return 'Just now';
  } else if (minutes === 1) {
    return '1 minute ago';
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours === 1) {
    return '1 hour ago';
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return `${days} days ago`;
  } else if (weeks === 1) {
    return '1 week ago';
  } else if (weeks < 4) {
    return `${weeks} weeks ago`;
  } else if (months === 1) {
    return '1 month ago';
  } else if (months < 12) {
    return `${months} months ago`;
  } else if (years === 1) {
    return '1 year ago';
  } else {
    return `${years} years ago`;
  }
}
const chatContainer = document.getElementById('chatContainer');
const messagesDiv = document.getElementById('messages');
const messageForm = document.getElementById('messageForm');
const roomId = new URLSearchParams(window.location.search).get('id');
document.getElementById('hed').innerHTML = `
<i class="bx bxs-heart" onclick="heart()" id="heart"></i>
<i class="bx bxs-moon" id="moon" onclick="moon()"></i>
<i id="leave-group-btn" class="bx bx-log-out leave-group-btn" onclick="leaveGroup(${roomId})" style="color: red;"></i>
`

function leaveGroup(groupCode) {
  const user = firebase.auth().currentUser;

  if (user) {
    // Use SweetAlert to confirm leaving the group
    Swal.fire({
      title: 'Leave Group',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, leave the group!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Remove the user from the members list in the group
        const groupRef = firebase.database().ref(`chatrooms/${groupCode}/members/${user.uid}`);
        groupRef.remove()
          .then(() => {
            console.log(`Successfully left group ${groupCode}`);
            sendSystemMessage(groupCode, `😟 ${user.displayName} left the chat`);
            window.location.replace('home.html')
          })
          .catch((error) => {
            console.error(`Error leaving group ${groupCode}:`, error);
          });
      }
    });
  } else {
    console.error('User not authenticated');
    // Handle the case where the user is not authenticated
  }
}
// Get the current user's username from Firebase Authentication
let username = ''; // Global variable to store the username
let touchStartTime; // Variable to store the start time of the touch event for long-press detection

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    username = user.displayName || 'Anonymous'; // Use the display name, or set to 'Anonymous' if not available
    localStorage.setItem('icon',user.photoURL);
    console.log(user.photoURL)
    if (localStorage.getItem('icon') == 'null') {
      localStorage.setItem('icon', 'MEDIA/user.jpg');
      console.log('Niggas')
  }
  }
});


function scrollChatToBottom() {
  var height = document.body.scrollHeight;
  window.scroll(0, height);
}


// Function to handle the context menu (pop-up) for message deletion
function handleContextMenu(event, messageDiv, messageKey, messageUsername, messagesRef) {
  event.preventDefault();

  // Check if the current user is the sender of the message
  if (messageUsername === username) {
    Swal.fire({
      title: 'Delete Message',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Delete the message from the database
        messagesRef.child(messageKey).remove()
          
          .catch((error) => {
            console.error('Error deleting message:', error);
            Swal.fire({
              title: 'Error',
              text: 'An error occurred while deleting the message.',
              icon: 'error'
            });
          });
      }
    });
  }
}

// Function to handle the long-press event for messages
function handleLongPress(event, messageDiv, messageKey, messageUsername, messagesRef) {
  event.preventDefault();
  let longPressTimer;

function scrollChatToBottom()
{
    var height = document.body.scrollHeight;
    window.scroll(0 , height);
}
  
  // Function to handle the deletion of a message
  function handleDeleteMessage(messageDiv) {
    Swal.fire({
      title: 'Delete Message?',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        messageDiv.remove();
      }
    });
  }

  // Start the long-press timer
  longPressTimer = setTimeout(() => {
    handleContextMenu(event, messageDiv, messageKey, messageUsername, messagesRef);
  }, 500); // Set the threshold for long-press (in milliseconds)

  // Clear the long-press timer when the touch/click event ends
  messageDiv.addEventListener('touchend', clearLongPressTimer);
  messageDiv.addEventListener('mouseup', clearLongPressTimer);

  // Function to clear the long-press timer
  function clearLongPressTimer() {
    clearTimeout(longPressTimer);
  }
}

// Add long-press event listeners to each message for showing the delete option
function initMessageLongPress(messageDiv, messageKey, messageUsername, messagesRef) {
  messageDiv.addEventListener('touchstart', (event) => {
    handleLongPress(event, messageDiv, messageKey, messageUsername, messagesRef);
  });
  messageDiv.addEventListener('mousedown', (event) => {
    handleLongPress(event, messageDiv, messageKey, messageUsername, messagesRef);
  });
}




if (!roomId) {
  messagesDiv.innerHTML = '<p>No chatroom found. Please create or join a chatroom.</p>';
}

else {
  const chatroomRef = firebase.database().ref('chatrooms/' + roomId);
  const messagesRef = chatroomRef.child('messages');

  chatroomRef.once('value')
    .then((snapshot) => {
      const roomName = snapshot.val().name;
      document.title = `Chatroom - ${roomName}`;
    })
    .catch((error) => {
      console.error('Error fetching chatroom:', error);
    });
// Initialize long-press event for each message to show the delete option
const allMessages = document.querySelectorAll('.message');
allMessages.forEach((messageDiv) => {
  const messageKey = messageDiv.getAttribute('data-message-key');
  const messageUsername = messageDiv.getAttribute('data-message-username');
  initMessageLongPress(messageDiv, messageKey, messageUsername, messagesRef);
});
function refreshChat() {
  // Clear existing messages
  messagesDiv.innerHTML = '';

  // Fetch all messages again and populate the chat
  messagesRef.once('value')
    .then((snapshot) => {
      const messages = [];

      snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        messages.push({
          key: childSnapshot.key,
          username: message.username,
          userId: message.userId, // Add userId to messages if available
          timestamp: message.timestamp,
          text: message.text,
          formattedTimestamp: formatTimestamp(message.timestamp),
          isSystemMessage: message.system || false
        });
      });

      // Sort the messages based on their timestamps in ascending order (oldest to newest)
      messages.sort((a, b) => a.timestamp - b.timestamp);

      // Generate message HTML
      let chatHTML = '';
      messages.forEach((message) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add(message.isSystemMessage ? 'sysmsg' : 'message');
        messageDiv.classList.add(message.username === username ? 'sent' : 'received');

        // Set a data attribute to identify the message div with its key
        messageDiv.setAttribute('data-message-key', message.key);
        messageDiv.setAttribute('data-message-username', message.username);

        // If the message is a system message, display "System Message" as the username
        const displayedUsername = message.isSystemMessage ? 'Group' : message.username;

        // Create the message content
        const messageContentDiv = document.createElement('div');
        messageContentDiv.classList.add(message.isSystemMessage ? 'h' : 'messageContent');
        const userProfileImage = `${localStorage.getItem('icon') || 'MEDIA/user.jpg'}`;
        const profileImageHTML = `<img src="${userProfileImage}" class="profile-image" >`;

        if (message.isSystemMessage) {
          messageContentDiv.innerHTML = `
            <div>${message.text}</div>
          `;
        } else {
          messageContentDiv.innerHTML = `
            <div class="chat-container">
              <div class="chat-bubble">
                <div class="messageHeader">
                  <div class="usernameContainer" onclick="redirectToUserProfile('${message.userId}')">
                    ${profileImageHTML}
                    <div class="uname">${displayedUsername}</div>
                   
                  </div>
                </div>
                <div class="text">${message.text}</div>
                <div class="times">${message.formattedTimestamp}</div>
              </div>
            </div>
          `;
        }

        // Append message content to the messageDiv
        messageDiv.appendChild(messageContentDiv);

        chatHTML += messageDiv.outerHTML;
      });

      // Update the chat with the generated HTML
      messagesDiv.innerHTML = chatHTML;
      scrollChatToBottom();

      // Scroll to the bottom to see new messages
      messagesDiv.scrollTop = messagesDiv.scrollHeight;

      // Initialize long-press event for each message to show the delete option
      const allMessages = document.querySelectorAll('.message');
      allMessages.forEach((messageDiv) => {
        const messageKey = messageDiv.getAttribute('data-message-key');
        const messageUsername = messageDiv.getAttribute('data-message-username');
        initMessageLongPress(messageDiv, messageKey, messageUsername, messagesRef);
      });
    })
    .catch((error) => {
      console.error('Error fetching messages:', error);
    });
}

function redirectToUserProfile(userId) {
  // Redirect to user.html with the user's ID
  window.location.href = `profile.html?userid=${userId}`;
}


 
  // Listen for child_removed event to detect when a message is deleted
  messagesRef.on('child_removed', (snapshot) => {
    // Get the key of the deleted message
    const deletedMessageKey = snapshot.key;

    // Find the corresponding message div and remove it from the UI
    const deletedMessageDiv = document.querySelector(`[data-message-key="${deletedMessageKey}"]`);
    if (deletedMessageDiv) {
      deletedMessageDiv.classList.add('deleted');
      deletedMessageDiv.textContent = 'Message Deleted!';
    }
  });

  // Listen for any change in the database to refresh the chat
  messagesRef.on('value', () => {
    refreshChat();
    scrollChatToBottom();
    // Scroll to the bottom to see new messages
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });

  // Send Message Function
  const messageInput = document.getElementById('messageText');
  const sendButton = document.getElementById('sendButton');
  const MAX_MESSAGE_LENGTH = 2500;
  let isTyping = false;

  function updateTypingStatus(isTyping) {
    const user = firebase.auth().currentUser;
    if (user && roomId) {
      const typingRef = firebase.database().ref(`chatrooms/${roomId}/typing/${user.uid}`);
      typingRef.set(isTyping)
        .then(() => console.log('Typing status updated successfully'))
        .catch((error) => console.error('Error updating typing status:', error));
    }
  }
  
  function displayTypingIndicator(userId, isTyping) {
    const typingIndicatorId = `typing-indicator-${userId}`;
    const typingIndicatorDiv = document.getElementById(typingIndicatorId);
  
    // Check if the user is typing and it's not the current user
    if (isTyping && userId !== firebase.auth().currentUser.uid) {
      if (!typingIndicatorDiv) {
        const newTypingIndicatorDiv = document.createElement('div');
        newTypingIndicatorDiv.classList.add('message', 'typing-indicator');
        newTypingIndicatorDiv.setAttribute('id', typingIndicatorId);
        newTypingIndicatorDiv.innerHTML = `Typing...`;
        messagesDiv.appendChild(newTypingIndicatorDiv);
        scrollChatToBottom();
      }
    } else {
      if (typingIndicatorDiv) {
        typingIndicatorDiv.remove();
        scrollChatToBottom();
      }
    }
  }
  
  // Event listener for input to detect when the user is typing
  messageInput.addEventListener('input', () => {
    isTyping = messageInput.value.trim() !== '';
    updateTypingStatus(isTyping);
  });
  
  // Listen for changes in typing status for other users
  const typingRef = firebase.database().ref(`chatrooms/${roomId}/typing`);
  typingRef.on('child_changed', (snapshot) => {
    const userId = snapshot.key;
    const isUserTyping = snapshot.val();
    displayTypingIndicator(userId, isUserTyping);
  });

// Function to send "seen" status to the database
function markMessageAsSeen(messageKey) {
  const user = firebase.auth().currentUser;
  if (user && roomId) {
    const seenByRef = firebase.database().ref(`chatrooms/${roomId}/messages/${messageKey}/seenBy`);
    seenByRef.child(user.uid).set(true);
  }
}

// Listen for changes in "seenBy" field for a message
messagesRef.on('child_changed', (snapshot) => {
  const messageKey = snapshot.key;
  const seenBy = snapshot.val().seenBy || {};

  // Display seenBy data in the UI
  displaySeenBy(messageKey, seenBy);
});

// Function to display seenBy data in the UI
function displaySeenBy(messageKey, seenBy) {
  // Implement your logic to show seenBy data in the UI
  // You can use messageKey to identify the message
  // and seenBy to determine which users have seen the message
}

function sendMessage() {
  const messageText = messageInput.value.trim();
  if (messageText !== '' && messageText.length <= MAX_MESSAGE_LENGTH) {
    const truncatedMessage = messageText.slice(0, MAX_MESSAGE_LENGTH);

    const newMessage = {
      username: username,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      text: truncatedMessage,
      seenBy: { [firebase.auth().currentUser.uid]: true }
    };

    messagesRef.push(newMessage);

    messageInput.value = '';
    scrollChatToBottom();
    updateSendButtonState();
    displayTypingIndicator(firebase.auth().currentUser.uid, false);
  }
}


// Function to update the "seenBy" field when a message is opened
function markMessageAsOpened(messageKey) {
  const user = firebase.auth().currentUser;
  if (user && roomId) {
    const seenByRef = firebase.database().ref(`chatrooms/${roomId}/messages/${messageKey}/seenBy`);
    seenByRef.child(user.uid).set(true);
  }
}

  // Listen for click event on the send button
  sendButton.addEventListener('click', sendMessage);

  // Function to update the send button state based on the message input
  function updateSendButtonState() {
    const messageText = messageInput.value.trim();
    sendButton.disabled = messageText === '';
  }

  // Listen for input event on the message input to update the send button state
  messageInput.addEventListener('input', updateSendButtonState);
}

// Updated logout function with confirmation
function logout() {
  Swal.fire({
    title: 'Logout',
    text: 'Are you sure you want to log out?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, Log out',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      firebase.auth().signOut()
        .then(() => {
          console.log("User logged out");
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "User logged out successfully!"
          });
          window.location.href = "login.html"; // Redirect the user to the login page after logout
        })
        .catch((error) => {
          console.error("Logout error:", error);
          Swal.fire({
            icon: "error",
            title: "Logout Error",
            text: "An error occurred while logging out."
          });
        });
    }
  });
}
function sendSystemMessage(groupCode, message) {
  const messagesRef = firebase.database().ref(`chatrooms/${groupCode}/messages`);
  const timestamp = firebase.database.ServerValue.TIMESTAMP;

  messagesRef.push({
    text: message,
    timestamp,
    system: true
  })
    .then(() => {
      console.log('System message sent successfully');
    })
    .catch((error) => {
      console.error('Error sending system message:', error);
    });
}
function profile() {
  window.location.href = 'profile.html'
}

function settings() {
  window.location.href = 'settings.html'
}
function home() {
  window.location.href = 'home.html'
}
if (localStorage.getItem('m') == 'On') {
  document.getElementById('moon').style.color = 'gray'
}
else if (localStorage.getItem('m') == 'Off') {
  document.getElementById('moon').style.color = 'yellow'
}
else if (localStorage.getItem('h') == 'On') {
  document.getElementById('heart').style.color = 'rgb(255, 0, 43) '
}
else if (localStorage.getItem('h') == 'Off') {
  document.getElementById('heart').style.color = 'white'
}
function heart() {
  if (localStorage.getItem('h') == 'Off') {
      localStorage.setItem('h','On')
      localStorage.setItem('hm','You can now chat with your partner')
      
      if (localStorage.getItem('h') == 'On') {
          document.getElementById('heart').style.color = 'rgb(255, 0, 43) '
      }
      else if (localStorage.getItem('h') == 'Off') {
          document.getElementById('heart').style.color = 'white'
      }
  }
  else if (localStorage.getItem('h') == 'On') {
      localStorage.setItem('h','Off')
      localStorage.setItem('hm','Turn it on again for better love experience')
      if (localStorage.getItem('h') == 'On') {
          document.getElementById('heart').style.color = 'rgb(255, 0, 43) '
      }
      else if (localStorage.getItem('h') == 'Off') {
          document.getElementById('heart').style.color = 'white'
      }
  }
  
  Swal.fire({
      icon: "success",
      title: "Turned "+localStorage.getItem('h'),
      text: localStorage.getItem('hm')
    });
}
function moon() {
  if (localStorage.getItem('m') == 'Off') {
      localStorage.setItem('m','On')
      localStorage.setItem('mm','You are now in quiet mode')
      if (localStorage.getItem('m') == 'On') {
          document.getElementById('moon').style.color = 'gray'
      }
      else if (localStorage.getItem('m') == 'Off') {
          document.getElementById('moon').style.color = 'yellow'
      }
  }
  else if (localStorage.getItem('m') == 'On') {
      localStorage.setItem('m','Off')
      localStorage.setItem('mm','You will now receive messages from others')
      if (localStorage.getItem('m') == 'On') {
          document.getElementById('moon').style.color = 'gray'
      }
      else if (localStorage.getItem('m') == 'Off') {
          document.getElementById('moon').style.color = 'yellow'
      }
  }
  
  Swal.fire({
      icon: "success",
      title: "Turned "+localStorage.getItem('m'),
      text: localStorage.getItem('mm')
    });
} 