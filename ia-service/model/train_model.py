import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam

# Parámetros para el modelo
IMG_SIZE = (224, 224)
NUM_CLASSES = 3  

def build_model(num_classes):
    """
    Construye un modelo de clasificación usando MobileNetV2 como base (Transfer Learning).
    """
    # Carga MobileNetV2 pre-entrenado en ImageNet, sin su capa de clasificación final.
    base_model = MobileNetV2(
        weights='imagenet',
        include_top=False,
        input_shape=IMG_SIZE + (3,)
    )
    # Congela el modelo base para preservar sus pesos aprendidos.
    base_model.trainable = False

    # Crea una nueva "cabeza" de clasificación sobre la salida del modelo base.
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dropout(0.5)(x) # Capa de regularización para prevenir overfitting.
    predictions = Dense(num_classes, activation='softmax')(x)

    # Ensambla el modelo final.
    model = Model(inputs=base_model.input, outputs=predictions)

    # Compila el modelo con un optimizador, función de pérdida y métricas.
    model.compile(
        optimizer=Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    return model

def main():
    """
    Orquesta la creación del modelo y lo guarda en disco.
    En un caso real, aquí se ejecutaría el entrenamiento con `model.fit()`.
    """
    print("Construyendo el modelo...")
    model = build_model(num_classes=NUM_CLASSES)
    model.summary()

    # --- SIMULACIÓN DE ENTRENAMIENTO ---
    # En un proyecto real, aquí se cargaría el dataset y se entrenaría el modelo:
    # model.fit(train_data, epochs=10, validation_data=val_data)
    
    # Guarda el modelo final (arquitectura + pesos) para su uso en la API.
    model_save_path = "dermoscan_model.h5"
    model.save(model_save_path)
    print(f"\nModelo base guardado exitosamente en: {model_save_path}")
    print("Este modelo guardado contiene la arquitectura y los pesos iniciales de MobileNetV2.")


if __name__ == "__main__":
    main()