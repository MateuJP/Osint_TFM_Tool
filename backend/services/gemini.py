import json
import google.generativeai as genai
from datetime import date, datetime


class AIGenerator:
    def __init__(self, provider: str = "gemini", api_key: str | None = None):
        self.provider = provider.lower()
        self.api_key = api_key

        if self.provider == "gemini":
            if not self.api_key:
                raise ValueError("Gemini API Key es necesaria")
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel("gemini-1.5-flash")

    def generar_identidad(self, objetivo: str) -> dict:
        hoy = date.today().strftime("%Y-%m-%d")

        prompt = f"""
Actúa como un asistente especializado en inteligencia operativa. 
Tu rol es ayudar a un analista humano que te solicita generar una identidad completamente ficticia pero verosímil, diseñada para cumplir con un objetivo de investigación específico.

Esta identidad será utilizada dentro de una aplicación que gestiona operaciones encubiertas o investigaciones estratégicas, por lo tanto, debe estar optimizada para ser utilizada por otro humano como fachada realista en dicho contexto.

Recibirás como entrada un objetivo claro, y deberás devolver una identidad completa y detallada en formato JSON, con los siguientes campos estrictamente definidos:

{{
  "nombre": "str (min 2, max 100)",
  "apellido": "str (min 2, max 100)",
  "edad": "int (coherente con la fecha de nacimiento)",
  "fecha_nacimiento": "date (formato YYYY-MM-DD, compatible con PostgreSQL y coherente con la edad)",
  "profesion": "str (max 100)",
  "nivel_educativo": "str (max 100)",
  "nombre_padre": "str (max 100)",
  "nombre_madre": "str (max 100)",
  "numero_hermanos": "int",
  "bibliografia": "str (lo más completa posible; debe incluir logros, publicaciones, afiliaciones, premios, conferencias, investigaciones y otros elementos relevantes al objetivo)",
  "observaciones": "str (debe incluir la situación sentimental, orientación política, historia personal, motivaciones, rasgos de personalidad, estilo de comunicación, ideologías, debilidades, y cualquier otro dato útil para que el analista pueda interpretar y utilizar esta identidad como cobertura operativa)"
}}

⚠️ Instrucciones importantes:
- La salida debe ser EXCLUSIVAMENTE un objeto JSON válido.
- No incluyas explicaciones, comentarios, ni bloques de código (```).
- Todos los campos son obligatorios.
- Asegúrate de que la edad y la fecha de nacimiento sean coherentes con la fecha actual (hoy es {hoy}).

Objetivo: {objetivo}
        """

        response = self.model.generate_content(prompt)
        text = response.text.strip()

        if text.startswith("```"):
            text = text.strip("`")
            if text.lower().startswith("json"):
                text = text[4:].strip()

        try:
            identidad = json.loads(text)
        except Exception as e:
            raise ValueError(f"Error al procesar la respuesta de Gemini: {str(e)}\nRespuesta: {text}")

        try:
            fecha_nac = datetime.strptime(identidad["fecha_nacimiento"], "%Y-%m-%d").date()
            edad_calculada = (
                date.today().year - fecha_nac.year
                - ((date.today().month, date.today().day) < (fecha_nac.month, fecha_nac.day))
            )
            if identidad["edad"] != edad_calculada:
                raise ValueError(
                    f"Incoherencia detectada: edad declarada {identidad['edad']} "
                    f"pero calculada {edad_calculada} según fecha_nacimiento {fecha_nac}"
                )
        except Exception as e:
            raise ValueError(f"Error validando coherencia edad/fecha_nacimiento: {e}")

        return identidad
