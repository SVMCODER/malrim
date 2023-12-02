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