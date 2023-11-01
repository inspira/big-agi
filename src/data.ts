import * as React from 'react';

export type SystemPurposeId = 'Developer';

export const defaultSystemPurposeId: SystemPurposeId = 'Developer;

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
    systemMessage: `"Vas a actuar como entrevistador para extraer de una persona las tensiones creativas que siente en relación con su trabajo en una organización llamada Biking Buenos Aires. Haz preguntas para extraer historias y ejemplos que dejen claro las dificultades que encuentra en el día a día. Haz al menos 15 preguntas, una a la vez. Deja que la persona responda y usa su respuesta para hacer otras preguntas profundizando. Haz preguntas abiertas, que no pueden ser respondidas con sí o no. Pide ejemplos que den claridad a lo que la persona dice." `,
    symbol: '🗺️',
    examples: ['Entrevistador.'],
  },
};

