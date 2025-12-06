import { motion } from 'framer-motion';
import { FiUploadCloud, FiFile } from 'react-icons/fi';

const ImageUploader = ({ file, onFileSelect, isDragging, onDragOver, onDragLeave, onDrop }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors duration-300
          ${isDragging 
            ? 'border-accent bg-accent/10' 
            : 'border-slate-600 hover:border-accent hover:bg-slate-800/50 bg-secondary/30'
          }
        `}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => document.getElementById('fileInput').click()}
      >
        <input
          id="fileInput"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={onFileSelect}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          {file ? (
            // Estado: Archivo Seleccionado
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-accent"
            >
              <FiFile className="w-16 h-16 mb-2" />
              <p className="text-sm font-medium text-slate-300 truncate max-w-[200px]">
                {file.name}
              </p>
              <p className="text-xs text-slate-500 mt-1">Clic para cambiar</p>
            </motion.div>
          ) : (
            // Estado: Esperando Archivo
            <>
              <div className={`p-4 rounded-full ${isDragging ? 'bg-accent/20 text-accent' : 'bg-slate-700/50 text-slate-400'}`}>
                <FiUploadCloud className="w-10 h-10" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-200">
                  {isDragging ? '¡Suéltala aquí!' : 'Sube tu imagen'}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Arrastra y suelta o haz clic para explorar
                </p>
              </div>
              <p className="text-xs text-slate-600">
                Soporta JPG, PNG, WEBP
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ImageUploader;