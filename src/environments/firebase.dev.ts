// Configuración para desarrollo local sin Firebase
export const mockFirebaseConfig = {
  // Esta configuración permite que la app funcione sin Firebase real
  // Solo para desarrollo y pruebas locales
  apiKey: "development-key",
  authDomain: "localhost",
  projectId: "inia-cuyes-dev",
  storageBucket: "localhost",
  messagingSenderId: "000000000000",
  appId: "development-app-id"
};

// Mock de funciones Firebase para desarrollo
export const developmentMode = {
  useEmulators: true,
  authEmulatorPort: 9099,
  firestoreEmulatorPort: 8080
};
