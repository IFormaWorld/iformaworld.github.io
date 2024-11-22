const scriptURL = 'https://script.google.com/macros/s/AKfycbziJ68FNQM_GVPZgqlXfmZqPENoGuLyK4Cv_TU3f3KN/dev'

const form = document.forms['contact-form']

form.addEventListener('submit', e => {
	e.preventDefault()
	fetch(scriptURL, { method: 'POST', body: new FormData(form)})
	.then(response => alert("Thank you! your form is submitted successfully." ))
	.then(() => { window.location.reload(); })
	.catch(error => console.error('Error!', error.message))
})

