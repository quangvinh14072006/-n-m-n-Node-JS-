  var Clock = document.getElementById('DateTime');

  function time() {
            let DateTime = new Date()
            let CurrentDate = DateTime.toDateString()
            let CurrentTime = DateTime.toLocaleTimeString()
            Clock.innerText = `${CurrentDate}, ${CurrentTime}`
            setTimeout(time, 1000)
        }
        time()
