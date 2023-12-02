var firebaseConfig = {
    apiKey: "AIzaSyCOA_2bf_b1o1nXSHZO5Re5DjSD66Pa6MY",
    authDomain: "https://raona0-default-rtdb.firebaseio.com",
    projectId: "raona0",
    storageBucket: "raona0.appspot.com",
    messagingSenderId: "797719983777",
    appId: "1:797719983777:web:d7ffca1316891b51ec62e0"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

auth.onAuthStateChanged(async (user) => {
  if (user) {
    const userId = user.uid;
    let email = '';
    let bio = '';
    const phoneNumberElement = document.getElementById('phone-number');
    const emailElement = document.getElementById('email');
    const shippingAddressElement = document.getElementById('shipping-address');
    const verifiedtick = document.getElementById('infoo')
    const profilePicture = document.getElementById('profile-picture');
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const bioElement = document.getElementById('bio');

    profilePicture.src = user.photoURL || 'https://wallpapers.com/images/hd/cool-pictures-fz4qiypiy3ob4vix.jpg';
    
    if (user.displayName == 'BTS ARMY 💜 아니카') {
      verifiedtick.innerHTML = `
      <h4 id="user-name" style="color:purple;">BTS ARMY 💜 아니카</h4>
          <h4 id="tickk" class="bx bx-check" ></h4>
          
      `;
      document.getElementById('role').innerHTML = "Developer's Wife ❤"
    }
    else if (user.displayName == 'Nekko Shaurya') {
      verifiedtick.innerHTML = `
      <h4 id="user-name" style="color:red;">Shaurya Tripathi</h4>
          <h4 id="tickk" class="bx bx-check" ></h4>
          
      `;
      document.getElementById('role').innerHTML = "Developer"
    }
    else if (user.displayName == 'Ananya Srivastava') {
      verifiedtick.innerHTML = `
      <h4 id="user-name" onclick="editname()" style="color:purple;">Ananya Srivastava</h4>
          <h4 id="tickk" class="bx bx-check"  ></h4>
          
      `;
      
      document.getElementById('role').innerHTML = "BTS ARMY LEADER"
    }
    else if (user.displayName == 'Savit') {
      verifiedtick.innerHTML = `
      <h4 id="user-name" style="color:red;">Savit Sharma</h4>
          <h4 id="tickk" class="bx bx-check" ></h4>
          
      `;
      document.getElementById('role').innerHTML = "Founder"
    }
    else if (user.displayName == 'Aviral Tripathi') {
      verifiedtick.innerHTML = `
      <h4 id="user-name" style="color:red;">Aviral Tripathi</h4>
          <h4 id="tickk" class="bx bx-check" ></h4>
          
      `;
      document.getElementById('role').innerHTML = "Founder"
    }
    else if (user.displayName == 'YashRaj') {
      verifiedtick.innerHTML = `
      <h4 id="user-name" style="color:red;">Yash Raj</h4>
          <h4 id="tickk" class="bx bx-check" ></h4>
          
      `;
      document.getElementById('role').innerHTML = "Founder"
    }
    else {
      verifiedtick.innerHTML = `

      <h4 id="user-name">${user.displayName}</h4>
      `;
      document.getElementById('editbtn').style.display = 'block'
    }
    userEmail.textContent = user.email || '';

    // Display the shipping address
    const userDocRef = db.collection("shippingAddresses").doc(userId);
    const accountCreationDate = new Date(user.metadata.creationTime);
    document.getElementById('cd').innerHTML = "Joined: "+ accountCreationDate.toDateString();
    try {
      const userDoc = await userDocRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        bio = userData.bio || 'No bio';
        bioElement.innerHTML = bio.replace('tesssttttttttttttt',`
        (⁠≧⁠▽⁠≦⁠)Wish me on 15 February 🥂 <br>
          #BTS ARMY ♾️ 💜 <br>
          #Selenophile🌕 <br>
          Fav colour purple ,grey and black <br>
          (Krishna ki deewani)💓🕉️📿 <br>
          🇮🇳💜🇰🇷 ʕ⁠っ⁠•⁠ᴥ⁠•⁠ʔ⁠っ <br>
        `);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }


    async function updateUserProfile(userId, displayName, photoURL) {
      profilePicture.src = user.photoURL || 'https://wallpapers.com/images/hd/cool-pictures-fz4qiypiy3ob4vix.jpg';
      userName.textContent = user.displayName || '';
      userEmail.textContent = user.email || '';
      bioElement.textContent = bio;
      const accountCreationDate = new Date(user.metadata.creationTime);
      document.getElementById('cd').innerHTML = "Joined: "+ accountCreationDate.toDateString();
    }
      
    document.getElementById('editbtn').addEventListener('click', async () => {
      const { value: formValues } = await Swal.fire({
        title: "Edit Profile",
        html:
          `<input id="swal-newName" class="input" placeholder="New Name" value="${user.displayName || ''}" minlength="3" maxlength="16"> <br><br>` +
          `<label for="swal-newPhoto" class="swal2-file-label bx bx-camera button" > Profile Picture<input type="file" id="swal-newPhoto" class="swal2-file" style="display:none;"></label>`, // Replace "Icon Here" with your icon
    
        focusConfirm: false,
        preConfirm: () => {
          const newNameInput = document.getElementById("swal-newName");
          const newPhotoInput = document.getElementById("swal-newPhoto");
    
          const newName = newNameInput.value.trim();
          const newPhoto = newPhotoInput.files[0];
    
          if (newName.length < 3 || newName.length > 16) {
            Swal.showValidationMessage("Username must be between 3 and 16 characters");
            return false;
          }
    
          return {
            newName,
            newPhoto,
          };
        },
      });
    
      if (formValues) {
        const { newName, newPhoto } = formValues;
    
        Swal.fire({
          title: "Updating Profile...",
          allowOutsideClick: false,
          didOpen: async () => {
            Swal.showLoading();
    
            try {
              if (newPhoto) {
                const storageRef = firebase.storage().ref();
                const photoRef = storageRef.child(`profile-photos/${userId}`);
                const uploadTask = photoRef.put(newPhoto);
    
                const snapshot = await uploadTask;
                const downloadURL = await snapshot.ref.getDownloadURL();
                await user.updateProfile({
                  displayName: newName,
                  photoURL: downloadURL,
                });
    
                updateUserProfile(userId, newName, downloadURL);
                Swal.fire("Success!", "Profile updated successfully!", "success");
              } else {
                await user.updateProfile({
                  displayName: newName,
                });
    
                updateUserProfile(userId, newName, user.photoURL);
                Swal.fire("Success!", "Profile updated successfully!", "success");
              }
            } catch (error) {
              Swal.fire("Error", "An error occurred while updating the profile.", "error");
              console.error("Error updating profile:", error);
            }
          },
        });
      }
    });
    

    try {
      const userDoc = await userDocRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        phoneNumber = userData.phoneNumber || '';
        email = userData.email || '';
        phoneNumberElement.textContent = phoneNumber; // Update phone number element
        emailElement.textContent = email; // Update email element
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }

    document.getElementById('editShippingBtn').addEventListener('click', async () => {
      const { value: formValue } = await Swal.fire({
        title: 'Edit Bio',
        html:
          `<div style="text-align: center;">
            <textarea id="swal-bio" class="input" placeholder="Enter bio" value="${bio || ''}" style="resize:none;"></textarea>
          </div>`,
        focusConfirm: false,
        preConfirm: () => {
          const newBio = document.getElementById('swal-bio').value;

          if (!newBio.trim()) {
            Swal.showValidationMessage('Bio is required');
            return false;
          }
          
          return {
            newBio,
          };
        },
        showCancelButton: true,
        confirmButtonText: 'Save',
      });

      if (formValue) {
        try {
          // Update bio
          const newBio = formValue.newBio;

          await db.collection('shippingAddresses').doc(userId).set({
            bio: newBio,
          });

          // Update the displayed values
          bio = newBio;
          bioElement.textContent = bio;

          Swal.fire('Success!', 'Profile details updated successfully!', 'success');
        } catch (error) {
          Swal.fire('Error', 'An error occurred while updating the profile details.', 'error');
          console.error('Error updating profile details:', error);
        }
      }
    });
    

  } else {
    console.log("User is not signed in");
  }
});

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
  
