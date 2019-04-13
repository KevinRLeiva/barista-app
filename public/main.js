var checkBox = document.getElementsByClassName("checkBox");
var trash = document.getElementsByClassName("fa-times-circle");

Array.from(checkBox).forEach(function(element) {
      element.addEventListener('click', function(){
        const order = this.parentNode.parentNode.childNodes[1].innerText,
        custName = this.parentNode.parentNode.childNodes[3].innerText
        let barista = document.querySelector('#baristaName').textContent
        //parses barista textContent to only contain the user email
        barista = barista.replace('Logged Barista: ', '')
        fetch('checkBox', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'custName': custName,
            'order': order,
            'barista': barista
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const order = this.parentNode.parentNode.childNodes[1].innerText
        const custName = this.parentNode.parentNode.childNodes[3].innerText
        fetch('orders', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'custName': custName,
            'order': order
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
