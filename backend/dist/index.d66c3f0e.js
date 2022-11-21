const form = document.querySelector("form");
form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const input = document.querySelector("input");
    const address = input.value;
    if (!address) return alert("Please enter an address");
    fetch(`/trace?address=${address}`).then((response)=>response.json()).then((data)=>{
        if (data.error) return console.log(data);
        else console.log(data);
    });
});

//# sourceMappingURL=index.d66c3f0e.js.map
