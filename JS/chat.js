var firebaseConfig = {
    apiKey: "AIzaSyCOA_2bf_b1o1nXSHZO5Re5DjSD66Pa6MY",
    authDomain: "https://raona0-default-rtdb.firebaseio.com",
    projectId: "raona0",
    storageBucket: "raona0.appspot.com",
    messagingSenderId: "797719983777",
    appId: "1:797719983777:web:d7ffca1316891b51ec62e0"
  };
// Initialize Firebase
// Your firebaseConfig here
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
// Assuming roomList is a div element with the id 'roomList'
const roomList = document.getElementById('roomList');

// Fetch and build the room list when the page loads
window.addEventListener('load', () => {
  // Check if the user is logged in
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is logged in, build the room list
      const userId = user.uid;
      buildRoomList(userId);
    } else {
      // User is not logged in, show the login prompt
      roomList.innerHTML = '<p>Please log in to view rooms.</p>';
    }
  });
});

const createRoomBtn = document.getElementById('createRoomBtn');

function buildRoomList(userId) {
  firebase.database().ref('chatrooms').on('value', (snapshot) => {
    const chatrooms = snapshot.val();

    // Check if there are no rooms or no rooms for the user
    if (!chatrooms || (Object.keys(chatrooms).length === 0) || !roomsAvailableForUser(chatrooms, userId)) {
      roomList.innerHTML = '<div class="errors"><i class="bx bx-sad" id="dds"></i><br><br> No Groups Available, Create or Join one now.</div>';
    } else {
      roomList.innerHTML = ''; // Clear existing content

      Object.entries(chatrooms).forEach(([roomId, roomData]) => {
        // Check if the current user is a member of the room
        if (roomData.members && roomData.members[userId]) {
          addRoomToList(roomId, roomData.name, roomData.image);
        }
      });
    }
  });
}

// Helper function to check if there are rooms available for the user
function roomsAvailableForUser(chatrooms, userId) {
  return Object.values(chatrooms).some((roomData) => {
    return roomData.members && roomData.members[userId];
  });
}






// Fetch and build the room list when the page loads
window.addEventListener('load', () => {
  // Check if the user is logged in
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is logged in, build the room list
      const userId = user.uid;
      buildRoomList(userId);
    } else {
      // User is not logged in, show the login prompt
      roomList.innerHTML = '<p>Please log in to view rooms.</p>';
    }
  });
});

 // Function to check if a group with the same name already exists
 function checkGroupNameExists(groupName) {
  const chatroomsRef = firebase.database().ref('chatrooms');
  return chatroomsRef
    .orderByChild('name')
    .equalTo(groupName)
    .once('value')
    .then((snapshot) => snapshot.exists());
}


  function generateGroupCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  function createRoom() {
    Swal.fire({
      title: 'Create Group',
      html:
        '<input type="text" id="groupTitle" class="input" placeholder="Group Title">' +
        '<input type="file" id="groupImage" class="input" accept="image/*" placeholder="Group Image (Optional)">',
      showCancelButton: true,
      confirmButtonText: 'Create',
      cancelButtonText: 'Cancel',
      preConfirm: async () => {
        const groupName = Swal.getPopup().querySelector('#groupTitle').value;
        const groupImageInput = Swal.getPopup().querySelector('#groupImage');
        const groupImageFile = groupImageInput.files[0];
  
        if (!groupName) {
          Swal.showValidationMessage('Please enter group title');
        }
        else if (!groupImageFile) {
          Swal.showValidationMessage('Group Image is required');
        }
         else {
          try {
            const groupExists = await checkGroupNameExists(groupName);
            if (groupExists) {
              throw new Error('Group name already exists');
            }
  
            const groupCode = generateGroupCode();
  
            // Show the progress popup
            const progressSwal = Swal.fire({
              title: 'Creating Group',
              html: 'Setting up...',
              allowOutsideClick: false,
              onBeforeOpen: () => {
                Swal.showLoading();
              },
            });
  
            const storageRef = firebase.storage().ref(`groupImages/${groupCode}`);
            const uploadTask = storageRef.put(groupImageFile);
  
            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on(
              'state_changed',
              (snapshot) => {
                // Handle progress
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progressSwal.update({ html: `Please wait (${progress}%)` });
              },
              (error) => {
                console.error('Error uploading image:', error);
                Swal.showValidationMessage('Failed to upload image');
              },
              async () => {
                // Get the image URL after upload
                const groupImage = await storageRef.getDownloadURL();
  
                // Update the database with the group details
                await firebase.database().ref('chatrooms/' + groupCode).set({
                  name: groupName,
                  code: groupCode,
                  image: groupImage || 'MEDIA/image.jpg',
                  members: {
                    [firebase.auth().currentUser.uid]: true,
                  },
                });
  
                // Close the progress popup
                progressSwal.close();
  
                // Show the success popup
                Swal.fire({
                  icon: 'success',
                  title: 'Group Created!',
                  text: 'Invite your friends',
                  inputValue: `Group Code: ${groupCode}`,
                  showCancelButton: true,
                  confirmButtonText: 'Copy Invite Code',
                }).then((copyResult) => {
                  if (copyResult.isConfirmed) {
                    const input = document.createElement('input');
                    document.body.appendChild(input);
                    input.value = `Group Code: ${groupCode}`;
                    input.select();
                    document.execCommand('copy');
                    document.body.removeChild(input);
                  }
  
                });
              }
            );
          } catch (error) {
            Swal.showValidationMessage(error.message || 'Failed to create group');
          }
        }
      },
    });
  }
  
  
  
  // function addRoomToList(groupCode, groupName, groupImage) {
  //   const listItemHtml = `
  //     <div class="user">
  //       <div class="imgd">
  //         <img src="${groupImage || 'MEDIA/image.jpg'}" class="profile-image" alt="">
  //         <i class="bx bxs-circle active-indicator"></i>
  //       </div>
  //       <div class="usene">
  //         <div id="username">${groupName}</div>
  //         <div id="msg-info">Chat in Group</div>
  //       </div>
  //       <div id="user-act" class="bx bx-trash delete-group-btn" data-group-code="${groupCode}" style="color: red;"></div>
  //     </div>
  //   `;
  
  //   roomList.innerHTML += listItemHtml;
  
  //   // Attach event listener to the delete group button
  //   const deleteGroupBtn = document.querySelector(`.delete-group-btn[data-group-code="${groupCode}"]`);
  //   if (deleteGroupBtn) {
  //     deleteGroupBtn.addEventListener('click', () => {
  //       deleteGroup(groupCode, groupName);
  //     });
  //   }
  // }
  function addRoomToList(groupCode, groupName, groupImage) {
    const roomList = document.getElementById('roomList');

    const listItemHtml = `
      <div class="user" data-group-code="${groupCode}">
        <div class="imgd" onclick="window.location.href='chatroom.html?id=${groupCode}'">
          <img src="${groupImage || 'MEDIA/bg.jpg'}" class="profile-image" >
        </div>
        <div class="usene" onclick="window.location.href='chatroom.html?id=${groupCode}'">
          <div id="username">${groupName}</div>
          <div id="msg-info">You Joined the group!</div>
        </div>
        <div id="user-act" class="bx bx-trash delete-group-btn" onclick="deleteGroup(${groupCode}, '${groupName}')" style="color: red;"></div>
      </div>
    `;

    roomList.innerHTML += listItemHtml;

    // Fetch and display the latest message
    fetchLatestMessage(groupCode);
  }

  function fetchLatestMessage(groupCode) {
    const messagesRef = firebase.database().ref(`chatrooms/${groupCode}/messages`);

    // Query the messages to get the latest one
    messagesRef.limitToLast(1).once('value')
      .then((snapshot) => {
        const messages = snapshot.val();

        if (messages) {
          const latestMessage = Object.values(messages)[0];
          const msgInfoElement = document.querySelector(`.user[data-group-code="${groupCode}"] #msg-info`);

          if (msgInfoElement) {
            msgInfoElement.textContent = latestMessage.text;
          }
        } else {
          // No messages in the group
          const msgInfoElement = document.querySelector(`.user[data-group-code="${groupCode}"] #msg-info`);

          if (msgInfoElement) {
            msgInfoElement.textContent = 'No messages in this group';
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching latest message:', error);
      });
  }


  function deleteGroup(groupCode, groupName) {
    Swal.fire({
      title: 'Delete Group',
      text: `Are you sure you want to delete the group "${groupName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Remove the group from the database
        firebase.database().ref('chatrooms').child(groupCode).remove()
          
          .catch((error) => {
            console.error('Error deleting group:', error);
            Swal.fire('Error', 'Failed to delete group', 'error');
          });
      }
    });
  }
  
// Function to send a message in the group
function sendMessageToGroup(roomId, username, message, timestamp) {
  const messagesRef = firebase.database().ref('chatrooms/' + roomId + '/messages');
  messagesRef.push({
    username: username,
    text: message,
    timestamp: timestamp
  });
}
// Function to join a room using an invite code
function joinRoomWithInviteCode() {
  Swal.fire({
    title: 'Enter Group Code',
    input: 'text',
    inputValidator: (value) => {
      if (!value) {
        return 'Please enter the invite code';
      } else {
        // Check if the invite code is valid and the room exists
        const chatroomsRef = firebase.database().ref('chatrooms');
        chatroomsRef.once('value')
          .then((snapshot) => {
            const chatrooms = snapshot.val();
            if (chatrooms && chatrooms[value]) {
              // The room exists, add the user to the members list
              const currentUser = firebase.auth().currentUser;
              if (currentUser) {
                const userId = currentUser.uid;
                const userDisplayName = currentUser.displayName || 'Anonymous';

                chatroomsRef.child(value).child('members').child(userId).set(true)
                  .then(() => {
                    // Sending the system message
                    return sendSystemMessage(value, `${userDisplayName} joined the group`);
                  })
                  .then(() => {
                    // Both set and sending system message succeeded
                    Swal.fire({
                      icon: 'success',
                      title: 'Success',
                      text: 'You have joined the group successfully!'
                    });
              
                    // Build the room list after joining the group
                    const currentUser = firebase.auth().currentUser;
                    if (currentUser) {
                      const userId = currentUser.uid;
                      buildRoomList(userId);
                    }
                  })
                  .catch((error) => {
                    console.error('Error joining group:', error);
                    Swal.fire('Error', 'Failed to join group', 'error');
                  });
              } else {
                Swal.fire('Error', 'Please log in to join the group', 'error');
              }
            } else {
              Swal.fire('Error', 'Invalid invite code or room does not exist', 'error');
            }
          })
          .catch((error) => {
            console.error('Error fetching chatrooms:', error);
            Swal.fire('Error', 'Failed to join group', 'error');
          });
      }
    }
  });
}



// Attach event listeners
createRoomBtn.addEventListener('click', createRoom);
  // Attach an event listener to the 'beforeunload' event
  
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
  