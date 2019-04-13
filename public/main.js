var checkBox = document.getElementsByClassName("checkBox");
var trash = document.getElementsByClassName("fa-times-circle");

Array.from(checkBox).forEach(function(element) {
      element.addEventListener('click', function(){
        const order = this.parentNode.parentNode.childNodes[1].innerText
        const custName = this.parentNode.parentNode.childNodes[3].innerText
        fetch('checkBox', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'custName': custName,
            'order': order
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
