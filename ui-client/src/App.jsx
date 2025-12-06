import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiActivity, FiAlertCircle } from 'react-icons/fi';
import ImageUploader from './components/ImageUploader';
import ResultsDisplay from './components/ResultsDisplay';

// URL del Backend (API Gateway en Java)
const API_URL = 'http://localhost:8080/api/scan';

function App() {
  // --- Estados de la Aplicación ---
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // --- Manejadores de Eventos (Handlers) ---

  // 1. Manejo de Drag & Drop
  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  // 2. Selección manual de archivo
  const onFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  // Función auxiliar para validar y previsualizar
  const validateAndSetFile = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
      setResults(null); // Limpiar resultados anteriores
    } else {
      setError("Por favor, sube un archivo de imagen válido (JPG, PNG).");
    }
  };

  // 3. Llamada a la API 
  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    // Creación FormData para enviar el archivo como 'multipart/form-data'
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Petición POST al Gateway de Java
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // await new Promise(resolve => setTimeout(resolve, 1500)); 

      setResults(response.data);
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor. Asegúrate de que el Backend (Java) esté corriendo.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Reiniciar la app
  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResults(null);
    setError(null);
  };

  // --- Renderizado de la UI ---
  return (
    <div className="min-h-screen bg-primary text-slate-200 font-sans selection:bg-accent selection:text-white pb-20">
      
      {/* Header / Navbar */}
      <header className="p-6 border-b border-slate-800 bg-primary/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="bg-gradient-to-tr from-accent to-blue-600 p-2 rounded-lg shadow-lg shadow-accent/20">
            <FiActivity className="text-white text-xl" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            DermoScan <span className="text-accent">AI</span>
          </h1>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-4xl mx-auto px-6 mt-12">
        
        {/* Título y Descripción */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Análisis de Piel Inteligente
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Utilizando Inteligencia Artificial avanzada para la detección temprana y clasificación de lesiones cutáneas.
          </p>
        </div>

        {/* Zona de Errores */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl mb-8 flex items-center gap-3"
            >
              <FiAlertCircle className="text-xl flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lógica de Vistas (Loading -> Results -> Uploader) */}
        <div className="flex flex-col items-center">
          
          {loading ? (
            // --- Vista de Carga ---
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-t-4 border-accent rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-b-4 border-purple-500 rounded-full animate-spin animation-delay-200"></div>
              </div>
              <p className="mt-8 text-xl font-medium text-slate-300 animate-pulse">
                Analizando imagen...
              </p>
              <p className="text-sm text-slate-500 mt-2">Enviando datos a la red neuronal</p>
            </div>
          ) : results ? (
            // --- Vista de Resultados ---
            <ResultsDisplay 
              results={results} 
              imagePreview={preview} 
              onReset={handleReset} 
            />
          ) : (
            // --- Vista de Subida (Default) ---
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full"
            >
              <ImageUploader 
                file={file}
                onFileSelect={onFileSelect}
                isDragging={isDragging}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              />

              {/* Botón de Analizar (Solo visible si hay archivo) */}
              <AnimatePresence>
                {file && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 text-center"
                  >
                    <button
                      onClick={handleAnalyze}
                      className="bg-accent hover:bg-sky-400 text-primary font-bold py-3 px-8 rounded-full shadow-lg shadow-sky-500/30 transition-all transform hover:scale-105 active:scale-95 text-lg"
                    >
                      Analizar Imagen
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}

export default App;