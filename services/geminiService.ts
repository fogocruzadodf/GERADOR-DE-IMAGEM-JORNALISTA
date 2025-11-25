import { GoogleGenAI, Modality, Part } from "@google/genai";
import { ImageGeneratorInputs, ThumbnailGeneratorInputs } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = 'gemini-2.5-flash-image';

const generateContentAndExtractImage = async (parts: Part[]): Promise<string> => {
  const response = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  const firstPart = response.candidates?.[0]?.content?.parts?.[0];
  if (firstPart && firstPart.inlineData) {
    const { data, mimeType } = firstPart.inlineData;
    return `data:${mimeType};base64,${data}`;
  }

  throw new Error("Não foi possível extrair a imagem da resposta da API.");
};

export const generateImage = async (inputs: ImageGeneratorInputs): Promise<string> => {
  const { characterImage, objectImage, backgroundImage, clothing, action, journalisticStyle } = inputs;

  const parts: Part[] = [];

  parts.push({
    inlineData: { mimeType: characterImage.mimeType, data: characterImage.base64 },
  });
  if (objectImage) {
    parts.push({
      inlineData: { mimeType: objectImage.mimeType, data: objectImage.base64 },
    });
  }
  if (backgroundImage) {
    parts.push({
      inlineData: { mimeType: backgroundImage.mimeType, data: backgroundImage.base64 },
    });
  }

  let prompt = `
    INSTRUÇÃO CRÍTICA: Mantenha a identidade exata do personagem da primeira imagem (rosto, cabelo, tipo físico). NÃO ALTERE O PERSONAGEM.
    
    Crie uma nova imagem com este mesmo personagem.
    ${backgroundImage ? 'Coloque o personagem no cenário da imagem de fundo.' : ''}
    ${objectImage ? 'O personagem deve estar segurando o objeto da segunda imagem de forma natural.' : ''}
    
    A roupa do personagem deve ser: "${clothing}".
    A ação do personagem é: "${action}".
    
    ${journalisticStyle ? 'Renderize a cena em um estilo de fotorrealismo, como uma matéria jornalística.' : 'O estilo da imagem deve ser vibrante e de alta qualidade.'}
    
    A imagem final deve ser uma única cena coesa e bem composta.
  `;

  parts.push({ text: prompt });

  return generateContentAndExtractImage(parts);
};

export const generateThumbnail = async (inputs: ThumbnailGeneratorInputs): Promise<string> => {
  const { templateImage, characterImage, backgroundImage, text } = inputs;
  
  const parts: Part[] = [
    { inlineData: { mimeType: templateImage.mimeType, data: templateImage.base64 } },
    { inlineData: { mimeType: characterImage.mimeType, data: characterImage.base64 } },
  ];

  if (backgroundImage) {
    parts.push({ inlineData: { mimeType: backgroundImage.mimeType, data: backgroundImage.base64 } });
  }

  const prompt = backgroundImage
    ? `
      INSTRUÇÃO CRÍTICA: Siga ESTRITAMENTE o estilo da primeira imagem (template de thumbnail), incluindo tipografia, cores e composição.

      1. **Estilo Base:** A primeira imagem é o modelo. Analise e replique seu estilo de texto (fonte, cor, tamanho, efeitos) e layout geral.
      2. **Cenário:** A terceira imagem é o novo cenário de fundo. Use-a como background.
      3. **Personagem:** A segunda imagem contém o personagem. Recorte o personagem e integre-o de forma natural e coesa ao novo cenário (terceira imagem).
      4. **Texto:** Adicione o seguinte texto à thumbnail, mantendo o estilo do modelo: "${text}".

      O resultado final deve ser uma thumbnail com o personagem no cenário fornecido, com o texto aplicado, tudo no estilo do template original.
    `
    : `
      Analise a primeira imagem, que é um modelo de thumbnail. Extraia seu estilo visual: tipografia (fonte, tamanho, cor, efeitos como contorno ou sombra), paleta de cores e composição.
      
      Agora, crie uma nova thumbnail que siga ESTRITAMENTE este estilo.
      
      Substitua o assunto principal do modelo pelo personagem da segunda imagem.
      
      Use o seguinte texto na thumbnail: "${text}".
      
      A nova thumbnail deve parecer ter sido feita com o mesmo modelo. A tipografia e as cores do texto devem ser idênticas ao modelo.
    `;
    
  parts.push({ text: prompt });

  return generateContentAndExtractImage(parts);
};
