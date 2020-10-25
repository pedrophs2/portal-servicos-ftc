import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Unidade from 'App/Models/Unidade'
import Usuario from 'App/Models/Usuario'
import {
  getErroValidacao,
  getCampoErroValidacao,
  formatarErroCampoObrigatorio,
} from 'App/Utils/Utils'

export default class UnidadesController {
  public async cadastro ({ request, response }: HttpContextContract) {
    try {
      const dadosCadastro = await request.validate({
        schema: schema.create({
          nome: schema.string(),
          id_diretor: schema.number(),
        }),
      })

      const diretor = await Usuario.find(request.input('id_diretor'))

      if(diretor?.tipo !== '') {
        return response.status(401).json({
          'mensagem': 'Usuário escolhido para diretor da unidade não tem essa função cadastrada',
        })
      }

      await Unidade.create({...dadosCadastro})

      return response.status(201).json({ mensagem: 'Unidade criada com sucesso' })
    } catch (error) {
      if (getErroValidacao(error) === 'required') {
        const campoErro = getCampoErroValidacao(error)

        const erro = formatarErroCampoObrigatorio(campoErro)

        return response.status(401).json(erro)
      }

      return response.badRequest({ error })
    }
  }
}