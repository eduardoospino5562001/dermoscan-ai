import { motion } from 'framer-motion';

const ResultsDisplay = ({ results, imagePreview, onReset }) => {
  // Función auxiliar para determinar el color según la probabilidad
  const getColor = (prob) => {
    if (prob > 0.7) return "bg-red-500 text-red-500 shadow-red-500/50";
    if (prob > 0.3) return "bg-yellow-500 text-yellow-500 shadow-yellow-500/50";
    return "bg-green-500 text-green-500 shadow-green-500/50";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl bg-secondary/50 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-700 mt-8"
    >
      <div className="grid md:grid-cols-2 gap-8 items-center">
        
        {/* Columna Izquierda: Imagen */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <img 
            src={imagePreview} 
            alt="Uploaded skin" 
            className="relative rounded-2xl w-full h-64 object-cover shadow-lg border border-slate-600"
          />
        </div>

        {/* Columna Derecha: Predicciones */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Resultados del Análisis</h2>
            <p className="text-slate-400 text-sm">
              Detección basada en el modelo MobileNetV2
            </p>
          </div>

          <div className="space-y-4">
            {results.predictions.map((pred, index) => {
              const colorClass = getColor(pred.probability);
              const percentage = (pred.probability * 100).toFixed(1);

              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-300">{pred.label}</span>
                    <span className={colorClass.split(" ")[1]}>{percentage}%</span>
                  </div>
                  
                  {/* Barra de progreso con fondo oscuro */}
                  <div className="h-2.5 w-full bg-slate-700 rounded-full overflow-hidden">
                    {/* Barra de progreso animada (relleno) */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                      className={`h-full rounded-full shadow-lg ${colorClass.split(" ")[0]}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={onReset}
            className="w-full mt-4 py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium text-sm"
          >
            Analizar otra imagen
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultsDisplay;