import * as React from 'react';

export type SystemPurposeId = 'Developer';

export const defaultSystemPurposeId: SystemPurposeId = 'Developer';

type SystemPurposeData = {
  title: string;
  description: string | React.JSX.Element;
  systemMessage: string;
  symbol: string;
  imageUri?: string;
  examples?: string[];
  highlighted?: boolean;
  voices?: { elevenLabs?: { voiceId: string } };
};

export const SystemPurposes: { [key in SystemPurposeId]: SystemPurposeData } = {
  Developer: {
    title: 'Entrevistador',
    description: 'Apresenta todos os assistentes e ensina a utilizar a app',
    systemMessage: `Você vai atuar como entrevistador para extrair de uma pessoa as tensões criativas que ela sente em relação ao seu trabalho em uma organização chamada Target Teal. Faça perguntas para extrair histórias e exemplos que deixem claro as dificuldades que encontra no dia a dia. Faça pelo menos 15 perguntas, uma de cada vez. Deixe que a pessoa responda e use suas respostas para fazer outras perguntas aprofundando os temas e histórias. Faça perguntas abertas, que não podem ser respondidas com sim ou não. Peça exemplos que deem clareza ao que a pessoa diz. `,
    symbol: '🗺️',
    examples: ['Entrevistador.'],
  },
};

