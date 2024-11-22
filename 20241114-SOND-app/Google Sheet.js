const scriptURL = 'https://script.google.com/macros/s/AKfycbzAIvf9k47KcMrsk-JsKVvN4uMMAPw30LuT_iYlMojs1QSBh9ITOyGWootcQUJA-KARdw/exec'

const form = document.forms['contact-form']

form.addEventListener('submit', e => {
	e.preventDefault()
	fetch(scriptURL, { method: 'POST', body: new FormData(form)})
	.then(response => alert("Thank you! your form is submitted successfully." ))
	.then(() => { window.location.reload(); })
	.catch(error => console.error('Error!', error.message))
})

