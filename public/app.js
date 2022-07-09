const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
    console.log("Submitted");
    e.preventDefault();
    console.log("Submit after e.preventDefault()");
    const input = document.querySelector('input');
    const address = input.value;
    if (!address) {
        return alert('Please enter an address');
    }

    fetch(`/trace?address=${address}`).then(response => response.json())
        .then(data => {
            if (data.error) {
                return console.log(data.error);
            } else {
                console.log(data);
            }
        })

})
