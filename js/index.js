window.onload = function () {
    const logado = JSON.parse(window.sessionStorage.getItem('logado'))
    if (!logado) {
        window.location = 'login.html'
    }
}

const body = document.querySelector('body')
const formulario = document.querySelector('form')
const tabela = document.querySelector('#listaAtividades')
const tabelaConfirmados = document.querySelector('#atividadesConfirmadas')
const btnLogout = document.querySelector('#BtnLogout')

let lista = Array()
let confirmados = Array()

carregaLocalStorage()
adicionaLinhasHTML(lista, tabela, true)
adicionaLinhasHTML(confirmados, tabelaConfirmados, false)
atualizaMedia()

btnLogout.addEventListener('click', function(){
    window.sessionStorage.setItem('logado', JSON.stringify(false))
    window.location = 'login.html'
})

function carregaLocalStorage() {
    const atv = localStorage.getItem('atividades')
    const atvC = localStorage.getItem('atividadesConfirmadas')
    if (atv) {
        lista = JSON.parse(atv)
    }
    if (atvC) {
        confirmados = JSON.parse(atvC)
    }

}

function adicionaLinhasHTML(minhaLista, minhaTabela, adicionaOK) {
    if (minhaLista) {
        for (let i = 0; i < minhaLista.length; i++) {
            adicionaLinhaTabela(minhaLista[i], minhaLista, minhaTabela, adicionaOK)
        }
    }
}

function adicionaLinhaTabela(obj, minhaLista, minhaTabela, adicionaOk) {
    let linha = criaTR(obj, minhaLista, minhaTabela, adicionaOk)
    minhaTabela.appendChild(linha)
}

formulario.addEventListener('submit', function (evt) {
    evt.preventDefault()

    let inicio = formulario.querySelector('#inicio').value
    let fim = formulario.querySelector('#fim').value
    let atividade = formulario.querySelector('#atividade').value

    let validos = valida(inicio, fim, atividade)
    if (validos) {
        let obj = geraObjeto(inicio, fim, atividade)
        if (!repetido(obj, lista)) {
            adicionaEmLista(obj, lista)
            adicionaLinhaTabela(obj, lista, tabela, true)
            atualizaMedia()

            const dados = JSON.stringify(lista)
            localStorage.setItem('atividades', dados)
        }else{
            alert('Elemento já inserido')
        }
    }
})

function valida(inicio, fim, atividade) {
    if (inicio == '') {
        alert('Preencha a hora de início')
        return false
    }
    if (fim == '') {
        alert('Preencha a hora de término')
        return false
    }
    if (atividade == '') {
        alert('Preencha a descrição')
        return false
    }
    return true
}

function repetido(elemento, minhaLista) {
    for (let i = 0; i < minhaLista.length; i++) {
        let aux = minhaLista[i]
        if (aux.comeco === elemento.comeco
            && aux.termino === elemento.termino
            && aux.duracao === elemento.duracao
            && aux.descricao === elemento.descricao) {
            return true
        }
    }
    return false
}

function criaTR(obj, minhaLista, minhaTabela, adicionaOK = true) {
    let linha = document.createElement('tr')
    linha.id = 'tr' + lista.length
    let tdA = criaTD(obj.comeco)
    let tdB = criaTD(obj.termino)
    let tdC = criaTD(obj.duracao)
    let tdD = criaTD(obj.descricao)
    let tdE = criaTD('')
    let btnExcluir = criaBtnExcluir(obj, minhaLista, minhaTabela)
    tdE.appendChild(btnExcluir)
    if (adicionaOK) {
        let btnOK = criaBtnOK(obj, linha)
        tdE.appendChild(btnOK)
    }
    linha.appendChild(tdA)
    linha.appendChild(tdB)
    linha.appendChild(tdC)
    linha.appendChild(tdD)
    linha.appendChild(tdE)

    return linha
}


function removeLinha(botao, obj, minhaLista, minhaTabela) {
    let btn = botao.target
    let node = (btn.parentNode).parentNode
    let indexLista = minhaLista.indexOf(obj)
    if (indexLista >= 0) {
        minhaTabela.removeChild(node)
        minhaLista.splice(indexLista, 1)
    }
}


function moveLinha(obj) {
    if(!confirmados){
        confirmados = Array()
    }
    confirmados.push(obj)
    adicionaLinhaTabela(obj, confirmados, tabelaConfirmados, false)

    atualizaStorage()
}

function atualizaStorage(){
    const dadosConfirmados = JSON.stringify(confirmados)
    localStorage.setItem('atividadesConfirmadas', dadosConfirmados)
    const dados = JSON.stringify(lista)
    localStorage.setItem('atividades', dados)
}

function criaBtnOK(obj, linha) {
    let botao = novoBotaoHTML('OK')
    botao.style.backgroundColor='#00FF00'
    botao.style.borderBlockColor='#00ff00'
    botao.addEventListener('click', function (btn) {
        removeLinha(btn, obj, lista, tabela, 'atividades')
        moveLinha(obj)
        atualizaStorage()
        atualizaMedia()
    })
    return botao
}

function filtrarTabela(){
    
}

function criaBtnExcluir(obj, minhaLista, minhaTabela) {
    let botao = novoBotaoHTML('X')
    botao.className = 'BtnExcluir'
    botao.style.backgroundColor='#FF0000'
    botao.style.borderBlockColor='#ff0000'
    botao.addEventListener('click', function (botao) {
        removeLinha(botao, obj, minhaLista, minhaTabela)
        atualizaStorage()
        atualizaMedia()
    })
    return botao
}

function criaTD(conteudo) {
    let td = document.createElement('td')
    td.innerHTML = conteudo
    return td
}

function novoBotaoHTML(texto) {
    let botao = document.createElement('button')
    botao.innerHTML = texto
    return botao
}

function geraObjeto(inicio, fim, atividade) {
    let inicio_em_minutos = diaEmMinutos(inicio)
    let fim_em_minutos = diaEmMinutos(fim)

    let tempo = fim_em_minutos - inicio_em_minutos

    let obj = {
        comeco: inicio,
        termino: fim,
        duracao: tempo,
        descricao: atividade
    }

    return obj
}

function atualizaMedia(){
    calculaMedia(lista, 'DuracaoMedia')
    calculaMedia(confirmados, 'DuracaoMediaConfirmados')
}

function calculaMedia(lst, idTagP) {
    let media = 0
    if (lst.length > 0) {
        media = lst.reduce((acumulado, atual) => {
            return { duracao: acumulado.duracao + atual.duracao }
        }).duracao / lst.length
    }

    let pDOM = document.querySelector('#' + idTagP)
    if (pDOM) {
        pDOM.innerHTML = 'Média de tempo de ' + media + ' minutos'
    }
}

function adicionaEmLista(obj, minhaLista) {
    if (repetido(obj, minhaLista)) {
        alert('Elemento já adicionado')
    } else {
        minhaLista.push(obj)
    }
}

function diaEmMinutos(hora) {
    let tempo = hora.split(':')
    return parseInt(tempo[0]) * 60 + parseInt(tempo[1])
}