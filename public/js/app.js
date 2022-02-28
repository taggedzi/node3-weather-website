const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const msg1 = document.getElementById('msg1')
const msg2 = document.getElementById('msg2')

weatherForm.addEventListener('submit', (event) => {
    event.preventDefault()
    msg1.textContent = 'Fetching weather data...'
    msg2.textContent = ''

    fetch(`./weather?address=${search.value}`).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                msg1.textContent = data.error
            } else {
                msg1.textContent = `${data.location}`
                msg2.innerHTML = `${data.forecast}`
            }
        })
    })
})