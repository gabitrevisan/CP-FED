document.getElementById("btn1").addEventListener("click", function(){
  document.body.style.backgroundColor = "red";
});

document.getElementById("btn2").addEventListener("click", function(){
document.body.style.backgroundColor = "green";
});

document.getElementById("btn3").addEventListener("click", function(){
document.body.style.backgroundColor = "blue";
});

document.getElementById("btn4").addEventListener("click", function(){
document.body.style.backgroundColor = "";
});


const formControl = {
  hasSubmitted: false,
  fields: {
    fullName: {
      label: 'Nome completo',
      error: false,
      rules: [(value) => value && value.length > 0]
    },
    phone: {
      label: 'Telefone celular',
      error: false,
      rules: [(value) => value && value.length > 0, (value) => value.replace(/\D+/g, '').length === 11],
      mask: (value) =>
        value
          .replace(/\D/g, '')
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/((\d{5})|\d{4})(\d{4})/, '$1-$3')
          .substring(0, 15)
    },
    location: {
      label: 'Localização',
      error: false,
      rules: [(value) => value && value.length > 0]
    }
  },
  isFormValid() {
    let isValid = false

    const subscribeUserDto = Object.fromEntries(new FormData())

    Object.entries(subscribeUserDto).forEach(entry => {
      const [key, value] = entry

      console.log(entry)

      isValid = formControl.fields[key].rules.every(fn => {
        const success = fn(value)
        formControl.fields[key].error = false

        if (!success) {
          formControl.fields[key].error = true
        }

        return success
      })
    })

    return isValid
  },
  handleSubmit(event) {
    event.preventDefault()

    formControl.hasSubmitted = true

    $submitButton.disabled = true
    $submitButton.textContent = 'Enviando...'

    const isValid = formControl.isFormValid()

    if (!isValid) {
      // Object.entries(formControl.fields).filter(([, value]) => value.error).forEach(input => {
      //   const [key, value] = input

      //   const $formInput = document.querySelector(`#want-be-warned-form .styled-input`)

      //   $formMaskedInput.child
      // })

      const invalidFields = Object.entries(formControl.fields).filter(([, control]) => control.error).map(([, control]) => control.label).join('\n')

      alert(`Campos inválidos, revise: \n\n${invalidFields}`)

      $submitButton.textContent = 'Inscrever-se'
      return
    }

    setTimeout(() => {
      $submitButton.disabled = false
      formControl.hasSubmitted = false
      $submitButton.textContent = 'Inscrever-se'
      $wantBeWarnedForm.reset()
    }, 500)
  },
  applyMasks() {
    Object.entries(formControl.fields).filter(([, value]) => value.mask).forEach(input => {
      const [key, value] = input

      const $formMaskedInput = document.querySelector(`#want-be-warned-form input[name="${key}"]`)

      $formMaskedInput.addEventListener('change', (event) => {
        console.log('mudei')

        event.target.value = value.mask(event.target.value)
      })
    })
  },
  observeChange() {
    if (!formControl.hasSubmitted) return

    const isValid = formControl.isFormValid()

    if (!isValid) {
      return
    }

    $submitButton.disabled = false
    formControl.hasSubmitted = false
  }
}

// Use to apply event listener
setTimeout(() => formControl.applyMasks(), 2)

$wantBeWarnedForm.addEventListener('submit', formControl.handleSubmit)
$wantBeWarnedForm.addEventListener('change', formControl.observeChange)