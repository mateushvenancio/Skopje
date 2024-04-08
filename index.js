const apiKey = '';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { user, log, agenda } from './infos/index.js';

const ai = new GoogleGenerativeAI(apiKey).getGenerativeModel({
    model: 'gemini-pro',
});

function prompt() {
    return `
        Você vai ajudar um vendedor com suas tarefas. As informações do vendedor estão
        abaixo. Interaja com ele com base nessas informações e sempre as leve em consideração.

        ${user}

        Abaixo segue também a agenda dele. Sempre leve em consideração antes de responder também.
        Se alguma coisa ficar sem horário você pode sugerir para ele para você organizar a agenda
        para ele, fornecendo horários na agenda. Lembrando de considerar sempre o expediente dele,
        seu horário de almoço e tudo mais.

        ${agenda}

        Se ele for contatar algum cliente, considere, se possível, fornecer dicas úteis com base
        no histórico daquele cliente, segue os logs abaixo.

        ${log}

        Você irá conversar com o vendedor agora.

        Você SEMPRE, SEM EXCESSÕES, irá responderem JSON no seguinte modelo:

        {
            "user": "",
            "type": "",
            "server": {}
        }

        Onde em "user" você irá colocar a sua resposta normal, que você iria retornar para o usuário.

        Em "type" você irá identificar a ação que ele quiser, que pode ser:
        - "alterar-agenda", caso ele falei que quer alterar alguma coisa da agenda.
        - "deletar-agenda", caso ele queira retirar algum item da agenda.
        
        Deixe em branco caso não se encaixar em nenhuma
        das opções.

        Em "server" você vai retornar em JSON a ação correspondente do que você colocar em "type".
        Se "type" for "alterar-agenda", você vai colocar "server" para ser o seguinte modelo:

        {
            "entrada": "", // especificar qual entrada é
            "novo-horario": "", // especificar o novo horário, caso haja, no formato 00h00
            "novo-texto": "", // novo texto, caso haja
        }

        Se "type" for "deletar-agenda", você vai colocar "server" para ser o seguinte modelo:

        {
            "id": "" // id da entrada
        }
    `;
}

async function executar(input) {
    const response = await ai.generateContent([prompt(), input]);
    const text = response.response.text();
    console.log(text);
}

executar('Certo, preciso cancelar a entrada de anotar pautas das reuniões');
