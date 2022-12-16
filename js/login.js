
const login_esperado = 'admin'
const senha_esperada = '1234'
const formulario = document.querySelector('form')

formulario.addEventListener('submit', function(evento){
    evento.preventDefault()

    const login = formulario.querySelector('#login').value
    const senha = formulario.querySelector('#senha').value

    if(login === login_esperado && senha === senha_esperada){
        window.sessionStorage.setItem('logado', JSON.stringify(true))
        window.location = "index.html";
    }else{
        window.sessionStorage.setItem('logado', JSON.stringify(false))
        alert('Login ou senha incorretos')
    }
})