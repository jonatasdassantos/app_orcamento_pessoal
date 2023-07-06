// Cadastro de despesas (pegando os valores atravez dos id)
class Despesas{
    constructor(ano,mes,dia,tipo,descricao,valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for(let i in this) {
            if(this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}

class Bd {

    constructor() {
        let id = localStorage.getItem('id')

        if(id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(d) {
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))

       localStorage.setItem('id', id)
    }


    recuperarTodosRegistros(){
        //array de despesas
        let despesas = Array()

        let id = localStorage.getItem('id')

        //recuperar todas as despesas cadastradas em locaStorage
        for(let i = 1; i <= id; i++){

            //recuperar a despesa
            let despesa = JSON.parse(localStorage.getItem(i))

            //existe a possibilidade de haver indices que foram pilados/removidos.
            //nestes casos nós vamos pular esses indices
            if(despesa === null) {
                continue
            }

            despesa.id = i
            despesas.push(despesa)
        }

        return despesas
    }

    pesquisar(despesa){

        let despesasFiltradas = Array()

        despesasFiltradas = this.recuperarTodosRegistros()
        console.log(despesa)
        console.log(despesasFiltradas)

        //ano
        console.log('filtro de ano');
        if(despesa.ano != ''){
            despesasFiltradas =  despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
      
        //mes
        console.log('filtro de mes');
        if(despesa.mes != ''){
            despesasFiltradas =  despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        
        if(despesa.dia != ''){
            despesasFiltradas =  despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        if(despesa.tipo != ''){
            despesasFiltradas =  despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        if(despesa.descricao != ''){
            despesasFiltradas =  despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        if(despesa.valor != ''){
            despesasFiltradas =  despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    } 

    removeDespesa(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function CadastrarDespesas(){
   let ano = document.getElementById('ano')
   let mes = document.getElementById('mes')
   let dia = document.getElementById('dia')
   let tipo = document.getElementById('tipo')
   let descricao = document.getElementById('descricao')
   let valor = document.getElementById('valor')

   let despesas = new Despesas(ano.value , mes.value , dia.value , tipo.value ,descricao.value , valor.value)

  if(despesas.validarDados()) {
    bd.gravar(despesas)
    document.getElementById('titulo_modal').innerHTML = 'Resistro inserido com Sucesso'
    document.getElementById('titulo_modal_div').className = 'modal-header text-success'
    document.getElementById('msg_modal').innerHTML = 'Despesa cadastrada com Sucesso'
    document.getElementById('modal_btn').innerHTML = 'Voltar'
    document.getElementById('modal_btn').className = 'btn btn-success'
    
    $('#registroGravacao').modal('show')

    
   ano.value = ''
   mes.value = ''
   dia.value = ''
   tipo.value = ''
   descricao.value = ''
   valor.value = ''

  }else {
    document.getElementById('titulo_modal').innerHTML = 'Erro na inclusão do Registro'
    document.getElementById('titulo_modal_div').className = 'modal-header text-danger'
    document.getElementById('msg_modal').innerHTML = 'Erro na gravação, Existem campos obrigatório sem preencher'
    document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
    document.getElementById('modal_btn').className = 'btn btn-danger'

    $('#registroGravacao').modal('show')
  }
}

function carregaListaDespesas(despesas = Array(), filtro = false) {

    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarTodosRegistros()
    } 

   

   //selecionando o elemento tbody da tabela
   let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

   despesas.forEach(function(d) { 
        
        //criando a linha (tr)
        let linha = listaDespesas.insertRow()

        //criar as colunas (td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        switch(d.tipo){
            case '1': d.tipo = 'Alimentação'
            break
            case '2': d.tipo = 'Educação'
            break
            case '3': d.tipo = 'Lazer'
            break
            case '4': d.tipo = 'Saúde'
            break
            case '5': d.tipo = 'Transporte'
            break

        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //criar o botão de exclusão
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class = "fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function(){
            //remover a despesa
            let id = this.id.replace('id_despesa_', '')
            //alert(id)

            bd.removeDespesa(id)

            window.location.reload()
        }
        linha.insertCell(4).append(btn)
        
   }) 

   
}

function PesquisarDespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesas(ano, mes, dia, tipo, descricao, valor)

    let despesas =  bd.pesquisar(despesa)

    this.carregaListaDespesas(despesas, true)
   

}

