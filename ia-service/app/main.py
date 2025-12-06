# ia-service/app/main.py

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import logging
import numpy as np
import tensorflow as tf
from PIL import Image
import io

# --- Configuración y Carga del Modelo ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Parámetros del modelo (deben coincidir con los del entrenamiento)
IMG_HEIGHT, IMG_WIDTH = 224, 224
CLASS_NAMES = ["Melanoma", "Nevus", "Queratosis"] # Asegúrate que el orden es correcto

# Carga el modelo de Keras. Esto se hace una sola vez al iniciar la aplicación
# para mayor eficiencia, en lugar de cargarlo en cada petición.
try:
    model = tf.keras.models.load_model('dermoscan_model.h5')
    logger.info("Modelo de IA cargado exitosamente.")
except Exception as e:
    logger.error(f"Error al cargar el modelo: {e}")
    model = None

# --- Instancia de FastAPI ---
app = FastAPI(
    title="DermoScan AI Service",
    description="Microservicio para el análisis de imágenes de piel mediante un modelo de IA.",
    version="1.0.0"
)

# --- Funciones Auxiliares ---
def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Toma los bytes de una imagen, la redimensiona y la normaliza
    para que sea compatible con el modelo.
    """

    # Abre la imagen desde los bytes en memoria.
    image = Image.open(io.BytesIO(image_bytes))
    
    # Redimensiona la imagen al tamaño esperado por el modelo (e.g., 224x224).
    image = image.resize((IMG_HEIGHT, IMG_WIDTH))
    
    # Convierte la imagen a un array de numpy.
    image_array = np.array(image)

    # Si la imagen es PNG con canal alfa (RGBA), descarta el canal alfa.
    if image_array.shape[2] == 4:
        image_array = image_array[:, :, :3]

    # Añade una dimensión extra para el 'batch' (el modelo espera un lote de imágenes).
    # El resultado pasa de (224, 224, 3) a (1, 224, 224, 3).
    image_array = np.expand_dims(image_array, axis=0)

    # Normaliza los valores de los píxeles al rango [-1, 1], como espera MobileNetV2.
    # Esta es la función de pre-procesamiento específica para MobileNetV2.
    preprocessed_image = tf.keras.applications.mobilenet_v2.preprocess_input(image_array)

    return preprocessed_image

# --- Endpoints de la API ---
@app.get("/", tags=["General"])
def read_root():
    """Endpoint de health check para verificar si el servicio está activo."""
    return {"status": "ok", "service": "DermoScan AI Service"}

@app.post("/analyze", tags=["Análisis de Imágenes"])
async def analyze_image(file: UploadFile = File(...)):
    """
    Recibe un archivo de imagen, la pre-procesa, obtiene una predicción del modelo
    y devuelve los resultados.
    """
    if model is None:
        raise HTTPException(status_code=500, detail="El modelo de IA no está disponible.")

    logger.info(f"Análisis solicitado para: {file.filename}")

    if not file.content_type.startswith("image/"):
        logger.warning(f"Tipo de archivo no válido: {file.content_type}")
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen.")

    try:
        # Lee el contenido del archivo en bytes.
        image_bytes = await file.read()
        
        # Pre-procesa la imagen para el modelo.
        processed_image = preprocess_image(image_bytes)
        
        # Realiza la predicción.
        prediction_raw = model.predict(processed_image)
        
        # Formatea la respuesta en un JSON legible.
        # `prediction_raw` es un array como [[0.85, 0.10, 0.05]]
        predictions = [
            {"label": CLASS_NAMES[i], "probability": float(prob)}
            for i, prob in enumerate(prediction_raw[0])
        ]

        response_data = {
            "filename": file.filename,
            "predictions": predictions,
            "is_mock": False
        }
        
        return JSONResponse(content=response_data)

    except Exception as e:
        logger.error(f"Error en el endpoint /analyze: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor.")