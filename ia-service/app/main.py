
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import logging

# Configuración básica de logging para monitorización.
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Instancia principal de la aplicación FastAPI.
app = FastAPI(
    title="DermoScan AI Service",
    description="Microservicio para el análisis de imágenes de piel mediante un modelo de IA.",
    version="1.0.0"
)

@app.get("/", tags=["General"])
def read_root():
    """Endpoint de health check para verificar si el servicio está activo."""
    return {"status": "ok", "service": "DermoScan AI Service"}

@app.post("/analyze", tags=["Análisis de Imágenes"])
async def analyze_image(file: UploadFile = File(...)):
    """
    Recibe un archivo de imagen y devuelve una predicción simulada.
    """
    logger.info(f"Análisis solicitado para: {file.filename}")

    # Validación fundamental: asegurar que el archivo subido es una imagen.
    if not file.content_type.startswith("image/"):
        logger.warning(f"Tipo de archivo no válido: {file.content_type}")
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen.")

    try:
        # Reemplazar con la lógica real del modelo de ML.
        # Por ahora, se devuelve una respuesta mock para desacoplar el desarrollo.
        mock_response = {
            "filename": file.filename,
            "predictions": [
                {"label": "Melanoma", "probability": 0.85},
                {"label": "Nevus", "probability": 0.10},
                {"label": "Queratosis", "probability": 0.05}
            ],
            "is_mock": True
        }
        
        return JSONResponse(content=mock_response)

    except Exception as e:
        # Captura de errores inesperados durante el procesamiento.
        logger.error(f"Error en el endpoint /analyze: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor.")